import ExpoModulesCore

public class ExpoWatchConnectivityManagerModule: Module {
  private let manager = ExpoWatchConnectivityManager()

  public func definition() -> ModuleDefinition {
    Name("WCManager")

    Constants(["isSupported": self.manager.isSupported()])

    Events("onInitialized", "onWatchMessageReceived", "onPhoneReachabilityChange")

    Function("initialize") {
        manager.setSendEvent(sendEventCallback: self.sendEvent)
        self.sendEvent("onPhoneInitialized", ["status": "Phone is ready"])
    }

    AsyncFunction("isPhoneReachable") { (promise: Promise) in
        guard manager.isReachable() else {
            promise.reject("ERROR", "[Phone] Session unreachable!")
            return
        }

        promise.resolve(manager.isReachable())
    }

    AsyncFunction("sendMessage") { (message: [String: Any], promise: Promise) in
        guard manager.isReachable() else {
            promise.reject("ERROR", "[Phone] Session unreachable!")
            return
        }

        manager.sendMessage(message, replyHandler: { reply in promise.resolve(reply) }, errorHandler: { error in promise.reject("ERROR", error.localizedDescription)})
    }

    // Enables the module to be used as a native view.
    View(ExpoWatchConnectivityManagerView.self) {
        // Defines a setter for the `url` prop.
        Prop("url") { (view: ExpoWatchConnectivityManagerView, url: URL) in
            if view.webView.url != url {
                view.webView.load(URLRequest(url: url))
            }
        }

        Events("onLoad")
    }
  }
}
