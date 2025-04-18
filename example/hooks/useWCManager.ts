import {useCallback, useEffect, useState} from 'react';
import {NativeEventSubscription} from 'react-native';

import WCManager, {
  WCCommandReplyStatus,
  WCMessage,
  WCSensorDataChunk,
  WCSensorStatus,
  WCSessionStatus,
  WCStatus,
  WatchMessageReceivedSyncSensorData,
  WatchMessageReceivedWatchReachable,
} from 'expo-watch-connectivity-manager';

// TODO: Refactor addEventListner to useEvent
// const onChangePayload = useEvent(ExpoWatchConnectivityManager, 'onChange');

type WatchMessageReceivedHandlers = {
  onStarted: () => void;
  onStopped: () => void;
  onDataChunk: (chunk: WCSensorDataChunk) => void;
};

export function useWCManager() {
  const [status, setStatus] = useState<WCStatus>();
  const [isReachable, setIsReachable] = useState(false);
  const [connectedWatch, setConnectedWatch] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  const getConnectedWatch = useCallback(async () => {
    try {
      const reply = await WCManager.sendMessage({command: 'watch'});
      console.log('📱 Connected watch reply:', reply);
      if (reply.status === WCCommandReplyStatus.WatchCommandReceived) {
        setConnectedWatch(reply.watch);
        setIsReachable(true);
      }
    } catch (err) {
      console.log('📱🚨 Failed to get watch name:', err);
      setIsReachable(false);
    }
  }, []);

  const checkWCReachability = useCallback(async () => {
    try {
      const reachable = await WCManager.isPhoneReachable();
      setIsReachable(reachable);
      if (reachable) {
        await getConnectedWatch();
      }
    } catch (err) {
      console.log('⌚️🚨 Failed to check phone reachability:', err);
      setIsReachable(false);
    }
  }, [getConnectedWatch]);

  const phoneInitializedListener = useCallback(() => {
    return WCManager.addListener('onInitialized', ({status}) => {
      console.log('📱 Phone initialized:', status);
      setInitialized(true);

      if (!WCManager.isSupported) {
        setStatus(WCSessionStatus.SessionNotSupported);
        return;
      }

      checkWCReachability().catch(console.log);
    });
  }, []);

  const phoneReachabilityListener = useCallback(() => {
    return WCManager.addListener('onPhoneReachabilityChange', ({reachable}) => {
      setIsReachable(reachable);

      console.log('📱 Phone reachability changed:', reachable);

      if (reachable) {
        getConnectedWatch().catch(console.log);
      }
    });
  }, [getConnectedWatch]);

  useEffect(() => {
    WCManager.initialize();
  }, []);

  useEffect(() => {
    const subscribtion = phoneInitializedListener();
    return subscribtion.remove;
  }, [phoneInitializedListener]);

  useEffect(() => {
    const subscribtion = phoneReachabilityListener();
    return subscribtion.remove;
  }, [phoneReachabilityListener]);

  const watchMessageReceivedListener = useCallback(
    (handlers: WatchMessageReceivedHandlers): NativeEventSubscription => {
      return WCManager.addListener('onWatchMessageReceived', ({message}) => {
        console.log('⌚️💬 Watch message received:', message.status);

        setStatus(message.status);

        if (message.status === WCSessionStatus.SessionReachable) {
          const connectedWatchMessage = message as WatchMessageReceivedWatchReachable;
          setConnectedWatch(connectedWatchMessage.watch);
          return;
        }

        if (message.status === WCSensorStatus.SensorStarted) {
          handlers.onStarted();
          return;
        }

        if (message.status === WCSensorStatus.SensorStopped) {
          handlers.onStopped();
          return;
        }

        if (message.status === WCSensorStatus.SyncSensorData) {
          const syncMessage = message as WatchMessageReceivedSyncSensorData;
          handlers.onDataChunk(syncMessage);
        }
      });
    },
    [],
  );

  const sendMessageToWatch = useCallback(async (message: WCMessage) => {
    try {
      const reply = await WCManager.sendMessage(message);
      console.log('📱 Message sent successfully:', reply);
      return reply;
    } catch (err) {
      console.log('📱🚨 Failed to send message:', err);
      return null;
    }
  }, []);

  return {
    status,
    initialized,
    isReachable,
    connectedWatch,
    checkWCReachability,
    watchMessageReceivedListener,
    sendMessageToWatch,
  };
}
