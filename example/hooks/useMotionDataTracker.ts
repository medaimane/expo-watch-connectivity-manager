import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, NativeEventSubscription} from 'react-native';
import {DeviceMotion, WCSensorData} from 'expo-watch-connectivity-manager';

import {useWCManager} from './useWCManager';
import {useMotionDataReceiver} from './useMotionDataReceiver';

export function useMotionDataTracker() {
  const subscription = useRef<NativeEventSubscription>();

  const [tracking, setTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<DeviceMotion[]>([]);
  const [trackingStartedAt, setTrackingStartedAt] = useState<Date | null>(null);
  const [trackingCompletedAt, setTrackingCompletedAt] = useState<Date | null>(null);

  const {
    isReachable,
    connectedWatch,
    sendMessageToWatch,
    watchMessageReceivedListener,
    checkWCReachability,
  } = useWCManager();

  const onComplete = useCallback(async (data: WCSensorData[]) => {
    setTrackingData(data as DeviceMotion[]);
  }, []);

  const {trackingDataHint, onDataChunk} = useMotionDataReceiver({onComplete});

  const onStarted = useCallback(() => {
    setTracking(true);
    setTrackingStartedAt(new Date());
  }, []);

  const onStopped = useCallback(() => {
    setTracking(false);
    setTrackingCompletedAt(new Date());
  }, []);

  const setupWatchListener = useCallback(() => {
    subscription.current = watchMessageReceivedListener({onStarted, onStopped, onDataChunk});
  }, [watchMessageReceivedListener, onDataChunk, onStarted, onStopped]);

  const startTracking = useCallback(
    async (info?: string) => {
      setupWatchListener();

      await checkWCReachability();
      if (!isReachable) {
        showWatchNotReachableAlert();
        return;
      }

      await sendMessageToWatch({
        command: 'start',
        sensor: 'device-motion',
        info,
      });
    },
    [isReachable, checkWCReachability, setupWatchListener, sendMessageToWatch],
  );

  const stopTracking = useCallback(async () => {
    await checkWCReachability();

    if (!isReachable) {
      showWatchNotReachableAlert();
      return;
    }

    await sendMessageToWatch({command: 'stop'});
  }, [isReachable, checkWCReachability, sendMessageToWatch]);

  useEffect(() => {
    return () => {
      subscription.current?.remove();
    };
  }, []);

  return {
    tracking,
    isReachable,
    connectedWatch,
    trackingStartedAt,
    trackingCompletedAt,
    trackingDataHint,
    trackingData,
    checkWCReachability,
    startTracking,
    stopTracking,
  };
}

function showWatchNotReachableAlert() {
  Alert.alert(
    'Watch Not Reachable Now!',
    'When you are ready, open MindfulSalat app on your Apple Watch to continue...',
  );
}
