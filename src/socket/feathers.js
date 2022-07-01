import io from 'socket.io-client';
import feathers from '@feathersjs/client';
// import auth from '@feathersjs/authentication-client';

// let socket = io('https://fmtracking-backend.koklass.com', {
let socket = io('https://trackingcms.boafresh.com', {
  transports: ['websocket'],
  upgrade: false
});

// let gpsSocket = io('https://gps.ekbana.net', {
//   transports: ['websocket'],
//   upgrade: false
// });

// const orderSocket = io(data.laravelSocketURL, {
//   transports: ['websocket'],
//   upgrade: false
// });


const client = feathers();

client.configure(feathers.socketio(socket));
client.configure(
  feathers.authentication({
    storage: window.localStorage
  })
);

// const gpsClient = feathers();

// gpsClient.configure(feathers.socketio(gpsSocket));
// gpsClient.configure(auth({
//   storageKey: 'auth'
// }))

// export  {client, socket, gpsClient};
export { client, socket };