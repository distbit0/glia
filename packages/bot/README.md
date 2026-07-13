# Glia bot

The bot reads its RPC, contract, and OpenRouter settings from `.env`. Its
blockchain signing key is stored separately in the desktop Secret Service under
`application=local-signing-key, project=glia-bot`.

The keyring may require an unlock after reboot. A missing, locked, or cancelled
lookup stops the bot; it never falls back to an environment variable.
