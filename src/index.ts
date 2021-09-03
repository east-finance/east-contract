import { config } from 'dotenv';
config();

import { RPCService } from './services/RPCService';
import { createLogger } from './utils/logger';
import { BigNumber } from 'bignumber.js';

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

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
