// import pino from 'pino';
//
// export const createLogger = (name: string) => {
//   return pino({
//     name,
//     prettyPrint: {
//       colorize: true,
//       translateTime: 'HH:MM:ss.l',
//       levelFirst: true,
//       crlf: true,
//       ignore: 'hostname,pid',
//     }
//   });
// };

import nodeFetch from 'node-fetch';
const { HOST_NETWORK } = process.env;

class Logger {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
  info(message: string) {
    console.log(`${this.name}: ${message}`);
    if (HOST_NETWORK) {
      nodeFetch(`http://${HOST_NETWORK}:5050`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          message
        })
      });
    }
  }

  error(message: string) {
    this.info(message)
  }
}

export const createLogger = (name: string) => {
  return new Logger(name)
};
