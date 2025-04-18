import WatchConnectivity

typealias SendEventCallback = (_ eventName: String, _ body: [String: Any?]) -> Void

class ExpoWatchConnectivityManager: NSObject, WCSessionDelegate {
  private let session = WCSession.default

  private var hasListeners: Bool = false
  private var sendEvent: SendEventCallback? = nil
  
  override init() {
    super.init()
    
    if WCSession.isSupported() {
      session.delegate = self
      session.activate()
    }
  }
  
  func setSendEvent(sendEventCallback: @escaping SendEventCallback) {
    self.hasListeners = true
    self.sendEvent = sendEventCallback
  }
  
  func isSupported() -> Bool {
    return WCSession.isSupported()
  }
  
  func isReachable() -> Bool {
    return session.isReachable
  }
  
  func sendMessage(_ message: [String : Any], replyHandler: (([String : Any]) -> Void)?, errorHandler: ((any Error) -> Void)? = nil) -> Void {
    session.sendMessage(message, replyHandler: replyHandler, errorHandler: errorHandler)
  }
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) -> Void {
    replyHandler(["status": "WatchMessageReceived"])
 
    guard self.hasListeners else {
      print("[Phone] SendEvent is not set!")
      return
    }

    self.sendEvent?("onWatchMessageReceived", ["message": message])
  }
  
  func sessionReachabilityDidChange(_ session: WCSession) -> Void {
    guard self.hasListeners else {
      print("[Phone] SendEvent is not set!")
      return
    }
    
    self.sendEvent?("onPhoneReachabilityChange", ["reachable": session.isReachable])
  }

  func sessionDidBecomeActive(_ session: WCSession) -> Void {
    print("[Phone] Session became active!")
    self.sendEvent?("onPhoneReachabilityChange", ["reachable": session.isReachable])
  }
  
  func sessionDidBecomeInactive(_ session: WCSession) -> Void {
    print("[Phone] Session became inactive!")
    session.activate()
  }

  func sessionDidDeactivate(_ session: WCSession) -> Void {
    print("[Phone] Session deactivated!")
    session.activate()
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) -> Void {
    guard let error = error else {
      print("[Phone] Session activated with state: \(activationState.rawValue)")
      return
    }

    print("[Phone] Session activation failed: \(error.localizedDescription)")
    session.activate()
  }
}
