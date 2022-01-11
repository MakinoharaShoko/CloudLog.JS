const cloudlog = require('../cloudlog/index')

const logger = new cloudlog();
logger.init('localhost:3000','mongo');
logger.setLevel('all');
logger.trace('123');
logger.debug('123');
logger.info('123');
logger.warn('123');
logger.error('123');
logger.fatal('123');