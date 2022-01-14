# CloudLog.JS
## 基本功能

### 将不同级别的日志以不同颜色格式化输出到控制台

### 将日志记录上传到 MongoDB 数据库

### 将 MongoDB 数据库内的日志记录可视化展示（并提供筛选功能）

## 使用方法

### 开始使用

#### 1、导入包

```shell
npm install cloudlogjs --save
```

你也可以使用其他任何你喜欢的包管理器，这里演示使用 npm。

#### 2、引入 CloudLog.JS

```js
//nodejs
const cloudlog = require('cloudlogjs');
//ES6 Module
import cloudlog from 'cloudlogjs';
```

#### 3、初始化

```js
const logger = new cloudlog();
```

### 格式化输出日志

```js
logger.trace('这是一个TRACE级别日志');
logger.debug('这是一条debug信息');
logger.info('这是一条消息');
logger.warn('这是一条警告');
logger.error('这是一条错误信息');
logger.fatal('这是一条致命错误信息');
```

### 将日志上传到数据库

你可以使用一个免费的 MongoDB 云数据库，注册地址：https://www.mongodb.com/atlas/database

如果你使用自己搭建的 CloudLOG 后端，你可以使用你后端服务器的本地数据库，例如：`mongodb://localhost:27017`

总之，最终你会得到一个允许 CloudLOG 后端访问的数据库链接，格式类似于这样：

`mongodb://localhost:27017` 或`mongodb+srv://username:password@......`

这就是你要将日志上传到数据库的链接。

接下来，你还需要一个 CloudLOG 后端来提供日志上传服务，你可以选择使用这个我提供的公用网站：https://cl.msfasr.com

或者，你可以非常简单地搭建一个 CloudLOG后端：

```shell
cd backend
npm install
npm run serve
```

然后，初始化 logger，告诉它你需要使用的 CloudLOG 后端 url 与数据库链接：

```js
logger.init('https://cl.msfasr.com', 'mongodb+srv://username:password@......');
```

这样，你的日志就会被上传到数据库。

### 设置日志级别

你可以设置要输出的日志级别，所有在该级别以下的日志将不会被输出到控制台上。

```js
logger.setLevel('DEBUG');//DEBUG 级别以下的日志不会输出
```

但是，所有级别的日志都会被上传到数据库，原因是CloudLOG 前端有筛选显示日志级别的选项。

### 设置日志集合

如果你没有设置日志集合，那么所有日志都会被打到默认的 main 集合中，你可以手动设置要将日志打到哪个集合中，以区分不同系统的日志：

```js
logger.setCollection('MyCollection');
```

