import {NativeModule, registerWebModule} from 'expo';
import {WatchConnectivityManagerModuleEvents, WCCommandReply} from './types';

class ExpoWatchConnectivityManagerModule extends NativeModule<WatchConnectivityManagerModuleEvents> {
  isSupported = false;
  initialize(): void {
    this.emit('onInitialized', {status: 'Web is ready'});
  }
  isPhoneReachable(): Promise<boolean> {
    return Promise.resolve(false);
  }
  sendMessage(): Promise<WCCommandReply> {
    return Promise.reject(new Error('Oops, Not supported on web!'));
  }
}

export default registerWebModule(ExpoWatchConnectivityManagerModule);
