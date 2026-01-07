package com.amethyst.browser.pilgrim

object PilgrimBridge {

    // This is a deterministic stand-in until native core is bound
    fun executeDeterministicAction(
        identityToken: String,
        action: String
    ): String {
        if (identityToken.isBlank()) {
            throw IllegalStateException("IDENTITY_MISSING")
        }

        // Deterministic output (no randomness)
        return "ACTION=$action;IDENTITY_HASH=${identityToken.hashCode()}"
    }
}
