package com.amethyst.browser

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.TextView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // HARD GATE — GhostPass
        if (!GhostPass.validate()) {
            finish()
            return
        }

        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.proofButton)
        val output = findViewById<TextView>(R.id.proofOutput)

        button.setOnClickListener {
            output.text = DeterministicProof.generate()
        }
    }
}
