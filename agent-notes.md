# Bot OpenRouter Env

- `packages/bot` keeps its own OpenRouter key in `packages/bot/.env`. The bot loads that env file with override enabled so inherited shell keys cannot merge Glia bot usage into another project's OpenRouter usage.

# Bot signing key

- The Glia signing key is intentionally separate from the bot's ordinary `.env` configuration and requires an unlocked desktop Secret Service collection.
- No cron or user systemd unit currently invokes the bot; revisit credential delivery before making it unattended.
