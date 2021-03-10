import { config } from 'dotenv';
config();

import { RPCService } from './RPCService';
import { createLogger } from './utils/logger';

const logger = createLogger('Main Service');

Promise.resolve().then(async () => {
  try {
    const rpcService = new RPCService();
    rpcService.connect();

    process.on('SIGINT', async () => {
      try {
        logger.info('Graceful shutdown');
        process.exit(0);
      } catch (err) {
        logger.error(`Graceful shutdown failure: ${err.message}`);
        process.exit(1);
      }
    });

  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
});
