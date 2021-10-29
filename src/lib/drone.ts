import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import dgram from 'react-native-udp';

import { config, defaultOptions } from './constants';
import { ValidCommandOptions, ValidCommands } from './types/commands.types';
import { DroneEventEmitter, DroneOptions } from './types/drone.types';
import { formatCommand, parseDroneState, verifyCommand } from './utility';

export default class Drone {
  readonly HOST: string;
  readonly MAIN_PORT: number;
  readonly STATE_PORT: number;
  readonly droneIO: any; // @TODO: fix types
  readonly droneState: any;
  connected: boolean;
  readonly events: EventEmitter;

  constructor(options?: DroneOptions) {
    const { host, port, statePort, skipOk } = { ...defaultOptions, ...options };

    this.HOST = host;
    this.MAIN_PORT = port;
    this.STATE_PORT = statePort;

    this.droneIO = dgram.createSocket({
      type: config.sockeType,
      debug: true,
    });
    this.droneState = dgram.createSocket({
      type: config.sockeType,
      debug: true,
    });

    this.droneIO.bind(this.MAIN_PORT);
    this.droneState.bind(this.STATE_PORT);

    this.connected = false;

    this.events = new EventEmitter();

    this.droneState.on(config.events.message, (stateBuffer: Buffer) => {
      this.events.emit(config.events.state, parseDroneState(stateBuffer));
    });

    this.droneIO.on(config.events.message, (...args: unknown[]) => {
      const [messageBuffer] = args;
      const parsedMessage = Buffer.isBuffer(messageBuffer)
        ? messageBuffer.toString()
        : messageBuffer;

      if (parsedMessage !== config.ok) {
        return this.events.emit(config.events.message, parsedMessage);
      }

      this.events.emit(config._ok);

      if (!this.connected) {
        this.connected = true;
        this.events.emit(config.events.connection);
      }

      if (!skipOk) {
        this.events.emit(config.events.message, parsedMessage);
      }
    });

    // Add a minor delay so that the events can be attached first
    // @ts-ignore: Unreachable code error
    setTimeout(() => this.send('command'));
  }

  send(
    command: ValidCommands,
    options?: ValidCommandOptions,
    force = false,
  ): Promise<void> {
    const error = verifyCommand(command, options);
    let formattedCommand: string = command;

    if (options) {
      formattedCommand = formatCommand(command, options);
    }

    return new Promise((resolve, reject) => {
      if (error && !force) {
        return reject(error);
      }

      this.droneIO.send(
        formattedCommand,
        0,
        formattedCommand.length,
        this.MAIN_PORT,
        this.HOST,
        this.events.emit.bind(this.events, 'send'),
      );

      // I need to really double check this below, but i will not change it for now since im only porting to TS

      // If the command is a read command resolve immediately
      if (formattedCommand.includes('?')) {
        return resolve();
      }

      // otherwise wait for OK from drone
      this.events.once('_ok', resolve);
    });
  }

  forceSend(command: ValidCommands, options: ValidCommandOptions) {
    return this.send.call(this, command, options, true);
  }

  readonly on: DroneEventEmitter = (event, callback) => {
    this.events.on(event, callback);
  };
}

