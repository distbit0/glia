# Bot OpenRouter Env

- `packages/bot` keeps its own OpenRouter key in `packages/bot/.env`. The bot loads that env file with override enabled so inherited shell keys cannot merge Glia bot usage into another project's OpenRouter usage.
