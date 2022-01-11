const cloudlog = require('../cloudlog/index')

const logger = new cloudlog();
logger.init('http://localhost:3000','mongodb://localhost:27017/');
logger.setLevel('all');
logger.trace('123');
logger.debug('123');
logger.info('123');
logger.warn('123');
logger.error('123');
logger.fatal('123');