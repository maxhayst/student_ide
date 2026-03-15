import { Octokit } from '@octokit/rest';

/**
 * Service to handle automatic syncing of student code to their GitHub repository.
 * Requires a fine-grained Personal Access Token (PAT) with repo contents access.
 */
export class GitSyncService {
    private octokit: Octokit;

    constructor(token: string) {
        this.octokit = new Octokit({ auth: token });
    }

    /**
     * Pushes a file update directly to the student's repository branch.
     */
    async autoCommit(
        owner: string,
        repo: string,
        path: string,
        content: string,
        branch: string = 'main',
        message: string = 'Auto-sync code update'
    ) {
        try {
            // 1. Get current file SHA (required by GitHub API to update an existing file)
            let sha: string | undefined;
            try {
                const { data } = await this.octokit.repos.getContent({
                    owner,
                    repo,
                    path,
                    ref: branch,
                });

                if ('sha' in data) {
                    sha = data.sha;
                }
            } catch (err: any) {
                // File might not exist yet, which is fine (404)
                if (err.status !== 404) {
                    console.error(`[GitSync] Failed to fetch existing file: ${err.message}`);
                    throw err;
                }
            }

            // 2. Commit the new content
            const response = await this.octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: Buffer.from(content).toString('base64'), // Octokit requires base64 encoding
                branch,
                sha,
            });

            console.log(`[+] Auto-commit successful: ${path} to ${owner}/${repo}`);
            return response.data;

        } catch (error: any) {
            console.error(`[-] Git sync failed for ${path}:`, error.message);
            // In a real app we would want to buffer failed commits and retry
        }
    }
}

// In a real setup, we might manage multiple instances or one master instance 
// acting with an OAuth App installation token.
export const gitSync = new GitSyncService(process.env.GITHUB_TOKEN || '');
