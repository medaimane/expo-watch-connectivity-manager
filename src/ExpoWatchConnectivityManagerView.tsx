import { requireNativeView } from 'expo';
import * as React from 'react';

import { WatchConnectivityManagerViewProps } from './types';

const NativeView: React.ComponentType<WatchConnectivityManagerViewProps> = requireNativeView(
  'ExpoWatchConnectivityManager',
);

export default function ExpoWatchConnectivityManagerView(props: WatchConnectivityManagerViewProps) {
  return <NativeView {...props} />;
}
