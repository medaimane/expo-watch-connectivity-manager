import * as React from 'react';

import { WatchConnectivityManagerViewProps } from './types';

export default function ExpoWatchConnectivityManagerView(props: WatchConnectivityManagerViewProps) {
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
