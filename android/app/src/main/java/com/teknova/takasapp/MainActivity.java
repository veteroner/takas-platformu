package com.teknova.takasapp;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Context;
import android.graphics.Bitmap;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private boolean hasLoadedOfflinePage = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        
        // WebView'e özel error handler ekle
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.setWebViewClient(new WebViewClient() {
                
                @Override
                public void onPageStarted(WebView view, String url, Bitmap favicon) {
                    super.onPageStarted(view, url, favicon);
                    // Sayfa yüklenmeye başladığında flag'i sıfırla
                    if (!url.contains("file://")) {
                        hasLoadedOfflinePage = false;
                    }
                }

                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    
                    // Ana frame için hata kontrolü
                    if (request.isForMainFrame() && !hasLoadedOfflinePage) {
                        // İnternet bağlantısını kontrol et
                        if (!isNetworkAvailable()) {
                            hasLoadedOfflinePage = true;
                            // Offline sayfasını yükle
                            view.loadUrl("file:///android_asset/public/index.html");
                        }
                    }
                }

                @Override
                public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                    super.onReceivedError(view, errorCode, description, failingUrl);
                    
                    // Eski API uyumluluğu için
                    if (!hasLoadedOfflinePage && !isNetworkAvailable()) {
                        hasLoadedOfflinePage = true;
                        view.loadUrl("file:///android_asset/public/index.html");
                    }
                }
            });
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager != null) {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }
        return false;
    }
}
