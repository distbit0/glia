# Signing-key storage

## Glia bot Secret Service migration (July 2026)

- The bot must load its blockchain signing key from the desktop Secret Service item identified by `application=local-signing-key, project=glia-bot`.
- It must not accept a signing key from `.env` or silently fall back when the keyring is unavailable.
- The stored key was potentially readable by other local accounts before 2026-07-13 and was not rotated.
