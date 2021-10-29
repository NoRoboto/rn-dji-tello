// Taken from https://dl-cdn.ryzerobotics.com/downloads/Tello/Tello%20SDK%202.0%20User%20Guide.pdf
export const defaultOptions = {
  host: '192.168.10.1',
  port: 8889,
  statePort: 8890,
  skipOk: true,
};

export const config = {
  sockeType: 'udp4',
  ok: 'ok',
  _ok: '_ok',
  events: {
    message: 'message',
    connection: 'connection',
    emit: 'emit',
    state: 'state',
  },
};
