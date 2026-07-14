# Signing-key storage

## Glia bot Secret Service migration (July 2026)

- The bot must load its blockchain signing key from the desktop Secret Service item identified by `application=local-signing-key, project=glia-bot`.
- It must not accept a signing key from `.env` or silently fall back when the keyring is unavailable.
- The stored key was potentially readable by other local accounts before 2026-07-13 and was not rotated.
- The bot remains manual-only while signing depends on an unlocked desktop Secret Service collection. Any unattended execution requires an explicit credential-delivery decision first.

## Project-scoped OpenRouter attribution

- `packages/bot/.env` owns the bot's OpenRouter key and overrides inherited shell values so Glia usage is not charged to another project's key.
