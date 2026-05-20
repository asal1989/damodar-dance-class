package com.damodardance.app

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.ProgressBar
import android.widget.RelativeLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var offlineLayout: RelativeLayout

    private val websiteUrl = "https://asal1989.github.io/damodar-dance-class/"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView      = findViewById(R.id.webView)
        progressBar  = findViewById(R.id.progressBar)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        offlineLayout = findViewById(R.id.offlineLayout)

        // ── WebView Settings ──────────────────────────────────────
        webView.settings.apply {
            javaScriptEnabled        = true
            domStorageEnabled        = true
            loadWithOverviewMode     = true
            useWideViewPort          = true
            builtInZoomControls      = false
            displayZoomControls      = false
            setSupportZoom(false)
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // ── WebViewClient ─────────────────────────────────────────
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility  = View.VISIBLE
                offlineLayout.visibility = View.GONE
                webView.visibility      = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility   = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (request?.isForMainFrame == true) {
                    progressBar.visibility  = View.GONE
                    webView.visibility      = View.GONE
                    offlineLayout.visibility = View.VISIBLE
                    swipeRefresh.isRefreshing = false
                }
            }
        }

        // ── Chrome client (progress bar) ──────────────────────────
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) progressBar.visibility = View.GONE
            }
        }

        // ── Pull-to-refresh ───────────────────────────────────────
        swipeRefresh.setColorSchemeColors(
            resources.getColor(R.color.gold, theme)
        )
        swipeRefresh.setOnRefreshListener { webView.reload() }

        // ── Retry button ──────────────────────────────────────────
        findViewById<Button>(R.id.retryButton).setOnClickListener {
            if (isConnected()) {
                offlineLayout.visibility = View.GONE
                webView.visibility       = View.VISIBLE
                webView.loadUrl(websiteUrl)
            }
        }

        // ── Load site ─────────────────────────────────────────────
        if (isConnected()) {
            webView.loadUrl(websiteUrl)
        } else {
            offlineLayout.visibility = View.VISIBLE
            webView.visibility       = View.GONE
        }
    }

    // ── Back button navigates within the WebView ──────────────────
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    // ── Network check ─────────────────────────────────────────────
    private fun isConnected(): Boolean {
        val cm = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val caps    = cm.getNetworkCapabilities(network) ?: return false
        return caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
               caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
    }
}
