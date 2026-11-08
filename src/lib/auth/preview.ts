/**
 * Shared LIVE-PREVIEW OAuth client (server-only — NEVER import from the client).
 *
 * The secret that ships in the sandbox is intentionally not in this public repo.
 * Set PREVIEW_CLIENT_SECRET from the deployer when you need live-preview sign-in.
 */
export const PREVIEW_CLIENT_ID = "grok_preview";
export const PREVIEW_CLIENT_SECRET = "REDACTED_PREVIEW_ONLY_NOT_A_REAL_SECRET";

/** The shared auth broker issuer (OIDC discovery lives under it). */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns whose callbacks the preview client accepts.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
