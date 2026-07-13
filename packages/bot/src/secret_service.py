import subprocess


SECRET_TOOL = "/usr/bin/secret-tool"


def load_signing_key(project: str) -> str:
    result = subprocess.run(
        [
            SECRET_TOOL,
            "lookup",
            "application",
            "local-signing-key",
            "project",
            project,
        ],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    signing_key = result.stdout.rstrip("\n")
    if result.returncode != 0 or not signing_key:
        raise RuntimeError(
            f"Could not load the {project} signing key from Secret Service. "
            "Unlock the desktop keyring and try again."
        )
    return signing_key
