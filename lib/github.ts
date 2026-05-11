import { Octokit } from "@octokit/rest";
import { prisma } from "@/lib/prisma";
import { splitRepository } from "@/lib/validators";

type GitHubLabel = string | { name?: string | null };

function createOctokit(token?: string) {
  const environmentToken = process.env.NODE_ENV === "production" ? undefined : process.env.GITHUB_TOKEN;

  return new Octokit({
    auth: token || environmentToken || undefined,
    userAgent: "agentops-playground",
  });
}

function serializeLabels(labels: GitHubLabel[]) {
  return JSON.stringify(
    labels
      .map((label) => (typeof label === "string" ? label : label.name))
      .filter(Boolean),
  );
}

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : new Date();
}

export class GitHubImportError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "GitHubImportError";
  }
}

export async function importRepositoryData(fullName: string, token?: string) {
  const { owner, repo } = splitRepository(fullName);
  const octokit = createOctokit(token);

  try {
    const [repositoryResponse, issuesResponse, pullRequestsResponse, commitsResponse, releasesResponse] =
      await Promise.all([
        octokit.repos.get({ owner, repo }),
        octokit.issues.listForRepo({
          owner,
          repo,
          state: "all",
          per_page: 50,
          sort: "updated",
          direction: "desc",
        }),
        octokit.pulls.list({
          owner,
          repo,
          state: "all",
          per_page: 50,
          sort: "updated",
          direction: "desc",
        }),
        octokit.repos.listCommits({ owner, repo, per_page: 100 }),
        octokit.repos.listReleases({ owner, repo, per_page: 10 }),
      ]);

    const repositoryData = repositoryResponse.data;

    const repository = await prisma.repository.upsert({
      where: { fullName: repositoryData.full_name },
      update: {
        owner,
        name: repo,
        description: repositoryData.description,
        url: repositoryData.html_url,
        importedAt: new Date(),
      },
      create: {
        owner,
        name: repo,
        fullName: repositoryData.full_name,
        description: repositoryData.description,
        url: repositoryData.html_url,
      },
    });

    const issueItems = issuesResponse.data.filter((issue) => !issue.pull_request);
    const pullRequestItems = pullRequestsResponse.data;
    const commitItems = commitsResponse.data;
    const releaseItems = releasesResponse.data;

    await prisma.$transaction([
      ...issueItems.map((issue) =>
        prisma.issue.upsert({
          where: {
            repositoryId_githubId: {
              repositoryId: repository.id,
              githubId: String(issue.id),
            },
          },
          update: {
            number: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: serializeLabels(issue.labels as GitHubLabel[]),
            author: issue.user?.login,
            url: issue.html_url,
            createdAt: toDate(issue.created_at),
            updatedAt: toDate(issue.updated_at),
          },
          create: {
            repositoryId: repository.id,
            githubId: String(issue.id),
            number: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: serializeLabels(issue.labels as GitHubLabel[]),
            author: issue.user?.login,
            url: issue.html_url,
            createdAt: toDate(issue.created_at),
            updatedAt: toDate(issue.updated_at),
          },
        }),
      ),
      ...pullRequestItems.map((pullRequest) =>
        prisma.pullRequest.upsert({
          where: {
            repositoryId_githubId: {
              repositoryId: repository.id,
              githubId: String(pullRequest.id),
            },
          },
          update: {
            number: pullRequest.number,
            title: pullRequest.title,
            body: pullRequest.body,
            state: pullRequest.state,
            author: pullRequest.user?.login,
            url: pullRequest.html_url,
            mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
            createdAt: toDate(pullRequest.created_at),
            updatedAt: toDate(pullRequest.updated_at),
          },
          create: {
            repositoryId: repository.id,
            githubId: String(pullRequest.id),
            number: pullRequest.number,
            title: pullRequest.title,
            body: pullRequest.body,
            state: pullRequest.state,
            author: pullRequest.user?.login,
            url: pullRequest.html_url,
            mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
            createdAt: toDate(pullRequest.created_at),
            updatedAt: toDate(pullRequest.updated_at),
          },
        }),
      ),
      ...commitItems.map((commit) =>
        prisma.commit.upsert({
          where: {
            repositoryId_sha: {
              repositoryId: repository.id,
              sha: commit.sha,
            },
          },
          update: {
            message: commit.commit.message,
            author: commit.commit.author?.name ?? commit.author?.login,
            url: commit.html_url,
            committedAt: toDate(commit.commit.author?.date),
          },
          create: {
            repositoryId: repository.id,
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author?.name ?? commit.author?.login,
            url: commit.html_url,
            committedAt: toDate(commit.commit.author?.date),
          },
        }),
      ),
      ...releaseItems.map((release) =>
        prisma.release.upsert({
          where: {
            repositoryId_githubId: {
              repositoryId: repository.id,
              githubId: String(release.id),
            },
          },
          update: {
            tagName: release.tag_name,
            name: release.name,
            body: release.body,
            url: release.html_url,
            publishedAt: release.published_at ? new Date(release.published_at) : null,
          },
          create: {
            repositoryId: repository.id,
            githubId: String(release.id),
            tagName: release.tag_name,
            name: release.name,
            body: release.body,
            url: release.html_url,
            publishedAt: release.published_at ? new Date(release.published_at) : null,
          },
        }),
      ),
    ]);

    return prisma.repository.findUniqueOrThrow({
      where: { id: repository.id },
      include: {
        _count: {
          select: {
            issues: true,
            pullRequests: true,
            commits: true,
            releases: true,
          },
        },
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error && "status" in error) {
      const status = Number((error as { status?: number }).status);
      if (status === 404) {
        throw new GitHubImportError("Repository not found or token cannot access it.", status);
      }
      if (status === 403) {
        throw new GitHubImportError("GitHub rate limit or permission check failed.", status);
      }
      if (status === 401) {
        throw new GitHubImportError("GitHub token was rejected.", status);
      }
    }

    throw error;
  }
}
