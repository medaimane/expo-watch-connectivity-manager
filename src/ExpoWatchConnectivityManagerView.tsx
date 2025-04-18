import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoWatchConnectivityManagerViewProps } from './ExpoWatchConnectivityManager.types';

const NativeView: React.ComponentType<ExpoWatchConnectivityManagerViewProps> = requireNativeView(
  'ExpoWatchConnectivityManager',
);

export default function ExpoWatchConnectivityManagerView(
  props: ExpoWatchConnectivityManagerViewProps,
) {
  return <NativeView {...props} />;
}
