package com.amethyst.browser

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val wv = WebView(this)
    wv.settings.javaScriptEnabled = true
    wv.webViewClient = WebViewClient()
    setContentView(wv)
    wv.loadUrl("https://example.com")
  }

  override fun onBackPressed() {
    val wv = (window.decorView.rootView as? WebView)
    if (wv != null && wv.canGoBack()) wv.goBack() else super.onBackPressed()
  }
}
