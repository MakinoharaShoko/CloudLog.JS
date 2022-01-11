const cloudlog = require('../cloudlog/index')

const logger = new cloudlog();
logger.init('http://localhost:3001','mongodb://localhost:27017/');
logger.setLevel('all');
logger.trace('网络些许波动');
logger.debug('当前正在处理数据：',{id:'114514',name:'田所浩二',location:'下北泽'});
logger.debug('当前正在处理数据：',{id:'114514',name:'田所浩二',location:'下北泽',class:{id:'1919810',name:'19级810班'}});
logger.info('有新用户注册');
logger.warn('服务器负载接近阈值');
logger.error('错误的数据录入');
logger.fatal('服务器负载过大',);