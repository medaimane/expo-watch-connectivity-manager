// See https://developer.apple.com/documentation/coremotion/cmdevicemotion

import {Measurement} from './Measurement';
import {TimeInterval} from './TimeInterval';

export type Attitude = {
  roll: number;
  pitch: number;
  yaw: number;
  rotationMatrix: {
    m11: number;
    m12: number;
    m13: number;
    m21: number;
    m22: number;
    m23: number;
    m31: number;
    m32: number;
    m33: number;
  };
  quaternion: Measurement & {
    w: number;
  };
};

export type RotationRate = Measurement;

export type Acceleration = Measurement;

export enum MagneticFieldCalibrationAccuracy {
  Uncalibrated = 'Uncalibrated',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export type CalibratedMagneticField = {
  field: Measurement;
  accuracy: MagneticFieldCalibrationAccuracy;
};

export enum SensorLocation {
  Default = 'Default',
  HeadphoneLeft = 'HeadphoneLeft',
  HeadphoneRight = 'HeadphoneRight',
}

export type DeviceMotion = TimeInterval & {
  // Getting Attitude and Rotation Rate
  attitude: Attitude;
  rotationRate: RotationRate;

  // Getting Acceleration Data
  gravity: Acceleration;
  userAcceleration: Acceleration;

  // Getting the Calibrated Magnetic Field
  magneticField: CalibratedMagneticField;

  // Getting the Heading
  heading: number;

  // Getting the Sensor Location
  sensorLocation: SensorLocation;
};
