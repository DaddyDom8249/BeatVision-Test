# Security Notes

BeatVision-Test is a static sponsor/demo prototype. Keep the presentation build safe by keeping credentials out of the repository.

## Never Commit

- API keys
- OAuth tokens
- Provider secrets
- Database passwords
- Cloud access keys
- Private webhook URLs
- Production environment files

## Demo Mode

The default demo path should remain deterministic and credit-safe. A sponsor should be able to inspect and present the workflow without configuring paid provider credentials.

## Live Provider Integrations

When live integrations are introduced, use environment variables or the deployment platform's secret manager. Provider adapters should sit behind the interfaces described in `ARCHITECTURE.md` rather than embedding provider-specific credentials or assumptions into the presentation UI.

## Reporting a Secret Leak

If a credential is accidentally committed, revoke or rotate it immediately. Removing it from a later commit does not make an exposed credential safe.
