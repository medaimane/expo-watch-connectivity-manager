import * as React from 'react';

import { ExpoWatchConnectivityManagerViewProps } from './ExpoWatchConnectivityManager.types';

export default function ExpoWatchConnectivityManagerView(
  props: ExpoWatchConnectivityManagerViewProps
) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
