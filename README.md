<p align="center">
  <h3 align="center">rn-dji-tello</h3>
  <p align="center">
    React native dji tello sdk wrapper
  </p>
</p>

## Table of contents

- [Quick start](#quick-start)
- [Usage](#usage)
- [What's included](#whats-included)
- [Creators](#creators)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)

## Quick start

This wrapper is totally based on https://github.com/AlexanderGranhof/tello-drone, special thanks to the author of this repo. 🙏

Important, install `react-native-udp` in your base project.

- `yarn add rn-dji-tello`

or

- `npm install rn-dji-tello`

## Usage

This is a Tello SDK wrapper exposed [here](https://dl-cdn.ryzerobotics.com/downloads/Tello/Tello%20SDK%202.0%20User%20Guide.pdf)

```jsx
import Tello from 'rn-dji-tello';
const drone = new Tello();
```

### Listeners

```jsx
drone.current.on(event_type, callback);
```

| event type | description                 | callback args                |
| ---------- | --------------------------- | ---------------------------- |
| connection | success connection listener | -                            |
| state      | sensor state                | state: DroneState            |
| send       | on send event listener      | error: Error, lenght: Number |
| message    | -                           | message: String              |

#### Senders

await drone.current?.send(command, options?, froce?);

command list:

```ts
type list =
  | 'command'
  | 'takeoff'
  | 'land'
  | 'streamon'
  | 'streamoff'
  | 'emergency'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'forward'
  | 'back'
  | 'cw'
  | 'ccw'
  | 'flip'
  | 'go'
  | 'curve'
  | 'speed'
  | 'rc'
  | 'wifi'
  | 'speed?'
  | 'battery?'
  | 'time?'
  | 'wifi?'
  | 'sdk?'
  | 'sn?';
```

---

```ts
interface options {
  value?: number | string;
  x?: number;
  y?: number;
  z?: number;
  x1?: number;
  y1?: number;
  z1?: number;
  x2?: number;
  y2?: number;
  z2?: number;
  speed?: number;
  a?: number;
  b?: number;
  c?: number;
  d?: number;
}
```

---

force: boolean

Please, read tello documentation to group the appropriate options for the desired command.

## What's included

- Support for typescript and sockets using react-native-udp.

## Example

```jsx
import  React, {useRef, useState} from  'react';

import {Button, SafeAreaView, StatusBar, StyleSheet, View} from  'react-native';

import  Tello  from  'rn-dji-tello';


const  App = () => {

  const [init, setInit] = useState<boolean>(false);

  const  drone = useRef<Tello>();



  const  onInit = () => {

    try {

      drone.current = new  Tello();



      drone.current.on('connection', () => {
       setInit(true);

       console.log('Connected to drone');

      });



      drone.current.on('state', state  => {

        console.log('Received State > ', state);

      });



      drone.current.on('send', (err, length) => {

        if (err) {
          console.log('error', err);
        }

        console.log(`Sent command is ${length} long`);

      });


      drone.current.on('message', message  => {

        console.log('Recieved Message > ', message);

      });


    } catch (error) {

      console.error(error);

      setInit(false);

    }
  };



  const  run = async () => {

    await  drone.current?.send('takeoff');

    await  drone.current?.send('battery?');

    await  drone.current?.send('land');

  };



  return (

    <SafeAreaView  style={styles.container}>

      <StatusBar  barStyle="light-content"  />

      <View  style={styles.viewWrapper}>

        <Button  title="Run"  disabled={!init}  onPress={run}  />

        <Button  title="Init"  disabled={init}  onPress={onInit}  />

      </View>

    </SafeAreaView>

  );

};


....


```

## Creators

**Me, NoRoboto**

## Thanks

https://github.com/AlexanderGranhof/tello-drone

## Copyright and license

MIT
