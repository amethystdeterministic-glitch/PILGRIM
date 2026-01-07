package com.amethyst.browser

import java.security.MessageDigest
import java.time.Instant

object DeterministicProof {

    fun generate(): String {
        val input = "AMETHYST:${Instant.now().epochSecond}"
        val hash = MessageDigest.getInstance("SHA-256")
            .digest(input.toByteArray())
            .joinToString("") { "%02x".format(it) }

        return """
            DETERMINISTIC PROOF
            -------------------
            Authority: Amethyst Deterministic Ltd
            ZYTE: Official
            Timestamp: ${Instant.now()}
            Hash: $hash
        """.trimIndent()
    }
}
