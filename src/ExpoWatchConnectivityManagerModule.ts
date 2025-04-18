import {NativeModule, requireNativeModule} from 'expo';
import {WatchConnectivityManagerModuleEvents, WCCommandReply, WCMessage} from './types';

declare class ExpoWatchConnectivityManagerModule extends NativeModule<WatchConnectivityManagerModuleEvents> {
  isSupported: boolean;
  initialize(): string;
  isPhoneReachable(): Promise<boolean>;
  sendMessage(message: WCMessage): Promise<WCCommandReply>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWatchConnectivityManagerModule>(
  'ExpoWatchConnectivityManager'
);
