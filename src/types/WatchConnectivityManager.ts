import type {StyleProp, ViewStyle} from 'react-native';

import {Accelerometer} from './Accelerometer';
import {DeviceMotion} from './DeviceMotion';
import {Gyroscope} from './Gyroscope';

type WCCommand = 'watch' | 'start' | 'stop';
export type WCSensorType = 'all' | 'accelerometer' | 'device-motion' | 'gyroscope'; // "all" option is not yet handled on mobile side

type WCStartMessage = {
  command: 'start';
  sensor: WCSensorType;
  prayer: string;
};

export type WCMessage =
  | WCStartMessage
  | {
    command: WCCommand;
    [key: string]: any;
  };

export enum WCCommandReplyStatus {
  WatchCommandReceived = 'WatchCommandReceived',
  StartCommandReceived = 'StartCommandReceived',
  StopCommandReceived = 'StopCommandReceived',
}

export type WCWatchCommandReply = {
  status: WCCommandReplyStatus.WatchCommandReceived;
  watch: string;
};

export type WCCommandReply =
  | WCWatchCommandReply
  | {
    status: WCCommandReplyStatus.StartCommandReceived | WCCommandReplyStatus.StopCommandReceived;
  };

export enum WCSensorStatus {
  SensorStarted = 'SensorStarted',
  SensorStopped = 'SensorStopped',
  SensorUnavailable = 'SensorUnavailable',
  SyncSensorData = 'SyncSensorData',
  SensorError = 'SensorError',
}

export enum WCSessionStatus {
  SessionReachable = 'SessionReachable',
  SessionNotSupported = 'SessionNotSupported',
}

export type WCStatus = WCSessionStatus | WCSensorStatus;
export type WCSensorData = Accelerometer | DeviceMotion | Gyroscope;

export type WCSensorDataChunk = {
  data: WCSensorData[];
  index: number;
  done: boolean;
  total: number;
  sessionId: string;
};

export type WatchMessageReceivedSyncSensorData = WCSensorDataChunk & {
  status: WCSensorStatus.SyncSensorData;
  sensor: WCSensorType;
};

export type WatchMessageReceivedWatchReachable = {
  status: WCSessionStatus.SessionReachable;
  watch: string;
};

export type WatchMessageReceived =
  | WatchMessageReceivedSyncSensorData
  | WatchMessageReceivedWatchReachable
  | {
    status: WCStatus;
    sensor: WCSensorType;
  };

export enum WatchMessageReplyStatus {
  WatchMessageReceived = 'WatchMessageReceived',
}

export type WatchMessageReply = {
  status: WatchMessageReplyStatus.WatchMessageReceived;
  [key: string]: any;
};

export type InitializedEventPayload = {
  status: string;
};

export type PhoneReachabilityChangeEventPayload = {
  reachable: boolean;
};

export type WatchMessageReceivedEventPayload = {
  message: WatchMessageReceived;
};

export type WatchConnectivityManagerModuleEvents = {
  onInitialized: (params: InitializedEventPayload) => void;
  onPhoneReachabilityChange: (params: PhoneReachabilityChangeEventPayload) => void;
  onWatchMessageReceived: (params: WatchMessageReceivedEventPayload) => void;
};

// Web

export type OnLoadEventPayload = {
  url: string;
};

export type WatchConnectivityManagerViewProps = {
  url: string;
  onLoad: (event: {nativeEvent: OnLoadEventPayload}) => void;
  style?: StyleProp<ViewStyle>;
};
