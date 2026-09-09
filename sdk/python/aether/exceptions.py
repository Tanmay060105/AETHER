class AetherSDKError(Exception):
    """Base class for AETHER SDK internal exceptions."""
    pass

class InitializationError(AetherSDKError):
    """Raised when the SDK is improperly initialized."""
    pass
