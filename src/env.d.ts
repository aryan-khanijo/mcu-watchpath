// Type declarations for Cloudflare environment bindings
// Used by getCloudflareContext() from @opennextjs/cloudflare

interface CloudflareEnv {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  ASSETS: Fetcher;
}

declare module "@opennextjs/cloudflare" {
  export function getCloudflareContext(): { env: CloudflareEnv; ctx: ExecutionContext };
  export function initOpenNextCloudflareForDev(): void;
}
