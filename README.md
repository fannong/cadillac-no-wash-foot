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
 