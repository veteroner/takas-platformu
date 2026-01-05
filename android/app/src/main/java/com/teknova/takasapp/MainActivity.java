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
import android.view.View;
import android.view.WindowManager;
import android.os.Build;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private boolean hasLoadedOfflinePage = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Splash screen için tam ekran modunu etkinleştir
        enableImmersiveMode();
    }

    @Override
    public void onResume() {
        super.onResume();
        enableImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            enableImmersiveMode();
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        
        // WebView'e özel error handler ekle
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            // WebView background color'ını splash background'a ayarla (siyah ekran sorununu önlemek için)
            webView.setBackgroundColor(0xFF8B5CF6); // splashBackground color (#8B5CF6)
            
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
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    // Sayfa yüklendiğinde WebView background'ı şeffaf yap (içerik görünsün)
                    view.setBackgroundColor(0x00000000); // Transparent
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

    /**
     * Splash screen için tam ekran (immersive) modunu etkinleştirir
     * Status bar ve navigation bar'ı gizler
     */
    private void enableImmersiveMode() {
        Window window = getWindow();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Android 11+ (API 30+): En güvenilir yöntem
            WindowCompat.setDecorFitsSystemWindows(window, false);
            WindowInsetsController controller = window.getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            // Android 10 ve altı
            int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN
                          | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                          | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
            window.getDecorView().setSystemUiVisibility(uiOptions);
            window.addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        }
    }
}
