# egg-example-zfr

egg实操

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org


### 开发过程的一些思考

- 邮箱验证码如何发送？
- 用户在邮箱上收到验证码后，点击注册时，如何验证？且如何验证码是否有效的时间内、----发送验证码时，将生成的验证码与邮箱存在表上。同时，存下验证码的生成时间。在用户注册时，将时间进行匹配.

- controller层仅处理用户的输入与输出，一些代码上的交互逻辑是否应该剥离出去？ ---- 经官方文档提示，可以在service层处理复杂业务逻辑的封装。

- 数据库中那么多时间类型的数组，总不能在查出来之后，通过nodejs再处理一遍吧？数据量一大，那多消耗性能啊。------ 刚开始是按照前端的思路想去引用外部组件moment之类的或者自己封装方法，但是一想不对，后来查一下，原来sql本身提供在查询数据时格式化再返回的功能
 
- 前端的入参有form表单检验，那么后端是否可以校验参数呢？ ---- egg-validate插件

## 部署过程的一些备忘

- 问：centos如何查看当前已经启动的nodejs服务，并且停止该服务
- 答：查看 Node.js 服务  ps aux | grep node，停止nodejs服务：kill 1234

- 问：如何查看mysql某个表上的数据内容？如何查看表上个字段的内容？
- 答：describe my_new_table;SELECT * FROM my_new_table;

- 问：查看云服务器上的Jenkins是否已经启动
- 答：sudo systemctl status jenkins

- 问: 如何重置mysql密码

- 问：查看mysql端口是否正在被占用
- 答：sudo netstat -tuln | grep 3306 
- tcp 表示连接类型。
- 第一个 0 表示接收队列（recv-q）中的数据量，第二个 0 表示发送队列（send-q）中的数据量。
- 127.0.0.1:3306 是本地地址和端口，表示 MySQL 正在这个地址和端口上监听连接。
- 0.0.0.0:* 是远程地址和端口，* 表示任何地址和端口。
- LISTEN 表示 MySQL 正在监听连接。

- jenkins初始密码：c5bd5af9a75c46569b008edfcbe832be

### node服务如何排查线上问题
- 打印出来的console如何查看。如何debugger线上代码？
