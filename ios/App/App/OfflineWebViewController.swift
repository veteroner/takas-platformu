import UIKit
import WebKit
import Capacitor
import Network

class OfflineWebViewController: CAPBridgeViewController {
    
    private var hasLoadedOfflinePage = false
    private let monitor = NWPathMonitor()
    private var isConnected = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNetworkMonitoring()
    }
    
    private func setupNetworkMonitoring() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = path.status == .satisfied
                
                // Bağlantı geri geldiğinde sayfayı yeniden yükle
                if path.status == .satisfied && self?.hasLoadedOfflinePage == true {
                    self?.hasLoadedOfflinePage = false
                    self?.webView?.reload()
                }
            }
        }
        
        let queue = DispatchQueue(label: "NetworkMonitor")
        monitor.start(queue: queue)
    }
    
    override func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        super.webView(webView, didFail: navigation, withError: error)
        handleError(error)
    }
    
    override func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        super.webView(webView, didFailProvisionalNavigation: navigation, withError: error)
        handleError(error)
    }
    
    private func handleError(_ error: Error) {
        let nsError = error as NSError
        
        // Network hataları: NSURLErrorNotConnectedToInternet, NSURLErrorNetworkConnectionLost, NSURLErrorCannotConnectToHost
        let networkErrorCodes = [-1009, -1005, -1004, -1001, -1003]
        
        if networkErrorCodes.contains(nsError.code) && !hasLoadedOfflinePage {
            hasLoadedOfflinePage = true
            loadOfflinePage()
        }
    }
    
    private func loadOfflinePage() {
        guard let offlinePath = Bundle.main.path(forResource: "public/index", ofType: "html") else {
            // Fallback: public klasöründe ara
            if let publicPath = Bundle.main.resourcePath?.appending("/public/index.html") {
                let url = URL(fileURLWithPath: publicPath)
                webView?.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
            }
            return
        }
        
        let url = URL(fileURLWithPath: offlinePath)
        webView?.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
    
    deinit {
        monitor.cancel()
    }
}
