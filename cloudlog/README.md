# CloudLog.JS
## 基本功能

### 将不同级别的日志以不同颜色格式化输出到控制台

![T 7YP~1%FSV1M8B}UAMLMID](https://user-images.githubusercontent.com/30483415/149433496-e0a9fb0f-c951-4dc6-8539-1c7d0f588a8b.png)

### 将日志记录上传到 MongoDB 数据库

![image](https://user-images.githubusercontent.com/30483415/149433545-e9727bde-d630-4074-b6bd-08c30deebb5f.png)

### 将 MongoDB 数据库内的日志记录可视化展示（并提供筛选功能）

![3)2OGN4D1O{SVRJJ_{N$PA8](https://user-images.githubusercontent.com/30483415/149433558-11be1599-1d79-48ec-9662-3c5ff837fee3.png)

![@K~ZZ~6C5}7NNQ~%7H@$PHS](https://user-images.githubusercontent.com/30483415/149433569-4b3c2077-1672-4b91-837a-8905bb0138e2.png)

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

![image](https://user-images.githubusercontent.com/30483415/149433607-d4926ae3-58a6-440a-aa62-7f6844787a68.png)

**如果你想要在输出日志的时候附加数据，你可以传入第二个参数：**

```js
logger.debug('这是一条debug信息',{name:'info',message:'Hello, CloudLog!'});
```

**如果有某一条数据你不想上传到数据库，你可以传入第三个参数：**

```js
logger.debug('这条信息不会被上传到数据库',{name:'info',message:'Hello, CloudLog!'},false);
```

```js
logger.debug('这条信息不会被上传到数据库',undefined,false);//不附加数据的情况
```


### 将日志上传到数据库

你可以使用一个免费的 MongoDB 云数据库，注册地址：https://www.mongodb.com/atlas/database

如果你使用自己搭建的 CloudLOG 后端，你可以使用你后端服务器的本地数据库，例如：`mongodb://localhost:27017`

总之，最终你会得到一个允许 CloudLOG 后端访问的数据库链接，格式类似于这样：

`mongodb://localhost:27017` 或`mongodb+srv://username:password@......`

这就是你要将日志上传到数据库的链接。

接下来，你还需要一个 CloudLOG 后端来提供日志上传服务，你可以选择使用这个我提供的公用服务（不安全且性能有限，仅供测试或娱乐使用）：

https://cl.msfasr.com

或者，你可以非常简单地搭建一个 CloudLOG后端：

```shell
cd backend
npm install
npm run serve
```

然后，初始化 logger，告诉它你需要使用的 CloudLOG 后端 url 与数据库链接：

第一个参数是使用的 CloudLOG 后端 url，第二个参数是数据库链接。

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

### 一个完整的示例

```js
const cljs = require('cloudlogjs');
//或： import cljs from 'cloudlogjs';

const logger = new cljs();//初始化
logger.init('https://log.msfasr.com','mongodb+srv://username:password@......')//设置后端及数据库链接
logger.level('DEBUG');//只会显示DEBUG级别以上的日志

logger.trace('这是一个TRACE级别日志');
logger.debug('这是一条debug信息');
logger.info('这是一条消息');
logger.warn('这是一条警告');
logger.error('这是一条错误信息');
logger.fatal('这是一条致命错误信息');
```

## 使用 CloudLOG 前端

当你完成后端服务的启动后，你就可以访问 CloudLOG 网站了：

比如，如果你在本地启动了 CloudLOG 服务，你可以访问：

http://localhost:3001  来访问 CloudLOG 前端。

如果你使用了我提供的公用 CloudLOG 服务，请访问：

https://cl.msfasr.com/

然后，在数据源管理中提供数据库访问链接，并为其设置一个备注后，你就可以访问到数据库里的 log 了。

![image](https://user-images.githubusercontent.com/30483415/149433636-8447bdac-3b73-4d68-83bb-9db8ef4f94b1.png)

你可以使用筛选功能来筛选你想要看到的信息:

![image](https://user-images.githubusercontent.com/30483415/149433646-b2f16817-9c7f-456d-b928-5ca9c41f71d4.png)
