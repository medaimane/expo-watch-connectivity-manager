import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWatchConnectivityManagerModuleEvents } from './ExpoWatchConnectivityManager.types';

declare class ExpoWatchConnectivityManagerModule extends NativeModule<ExpoWatchConnectivityManagerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWatchConnectivityManagerModule>('ExpoWatchConnectivityManager');
