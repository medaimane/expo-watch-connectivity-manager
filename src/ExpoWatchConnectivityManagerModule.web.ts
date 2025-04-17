import { registerWebModule, NativeModule } from 'expo';

import { ExpoWatchConnectivityManagerModuleEvents } from './ExpoWatchConnectivityManager.types';

class ExpoWatchConnectivityManagerModule extends NativeModule<ExpoWatchConnectivityManagerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoWatchConnectivityManagerModule);
