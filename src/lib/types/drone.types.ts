import { EventEmitter } from 'events';

export interface TelloDrone {
  HOST: string;
  MAIN_PORT: number;
  STATE_PORT: number;
  droneIO: any;
  droneState: any;
  connected: boolean;
  events: EventEmitter;
}

export interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export interface DroneState {
  pitch: number;
  roll: number;
  yaw: number;
  vgx: number;
  vgy: number;
  vgz: number;
  templ: number;
  temph: number;
  tof: number;
  h: number;
  bat: number;
  baro: number;
  time: number;
  agx: number;
  agy: number;
  agz: number;
}

export interface DroneOptions {
  host?: string;
  port?: number;
  statePort?: number;
  skipOk?: boolean;
}

export interface DroneEvents {
  connection: () => void;
  state: (state: DroneState, udpConnection: AddressInfo) => void;
  send: (error: Error, messageLength: number) => void;
  message: (message: string, udpConnection: AddressInfo) => void;
}

export type DroneEventEmitter = <K extends keyof DroneEvents>(
  event: K,
  callback: DroneEvents[K],
) => void;
