import logging

# Internal SDK logger. Defaults to WARNING to avoid spamming the host application.
logger = logging.getLogger("aether")
logger.setLevel(logging.WARNING)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[AETHER SDK] %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
