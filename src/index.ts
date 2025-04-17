// Reexport the native module. On web, it will be resolved to ExpoWatchConnectivityManagerModule.web.ts
// and on native platforms to ExpoWatchConnectivityManagerModule.ts
export { default } from './ExpoWatchConnectivityManagerModule';
export { default as ExpoWatchConnectivityManagerView } from './ExpoWatchConnectivityManagerView';
export * from  './ExpoWatchConnectivityManager.types';
