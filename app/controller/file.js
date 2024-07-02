const BaseController = require("./base");
const OSS = require("ali-oss");
const sendToWormhole = require("stream-wormhole");
const path = require("path");
const dayjs = require("dayjs");

class FileController extends BaseController {
  async upload() {
    const { ctx } = this;
    // this.success({}, 'success')
    // ctx.logger.info(ctx.request, "345");
    // const { file } = ctx.request.files[0];
    const stream = await ctx.getFileStream();
    ctx.logger.info(process.env.OSS_ACCESS_KEY_ID, "123");
    const client = new OSS({
      region: "oss-cn-guangzhou", // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
      accessKeyId: process.env.OSS_ACCESS_KEY_ID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
      bucket: "z-cadillac", // 示例：'my-bucket-name'，填写存储空间名称。
      timeout: 120000,
    });
    // 自定义请求头
    const headers = {
      // 指定Object的存储类型。
      "x-oss-storage-class": "Standard",
      // 指定Object的访问权限。
      "x-oss-object-acl": "private",
      // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
      "Content-Disposition": 'attachment; filename="example.txt"',
      // 设置Object的标签，可同时设置多个标签。
      "x-oss-tagging": "Tag1=1&Tag2=2",
      // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
      "x-oss-forbid-overwrite": "true",
    };

    try {
      // 将filename替换成一个日期+时间+随机数的字符串+原始文件格式
      // 如IMG_20141129_214717.jpg替换成2024-07-02-123456.jpg
      // const filename = stream.filename;
      const now = new Date();
      const milliseconds = now.getMilliseconds();
      const filename = `${dayjs().format("YYYY-MM-DD-hh:mm:ss")}-${milliseconds}${path.extname(
        stream.filename
      )}`;
      const result = await client.put(filename, stream, { headers });
      this.success(
        {
          key: result.name,
          url: result.url,
        },
        "Upload success"
      );
    } catch (e) {
      // 确保流被消费掉，防止内存泄漏
      await sendToWormhole(stream);
      throw e;
    }
  }

  async download() {
    const { ctx } = this;
    const { key } = ctx.query;
    const client = new OSS({
      region: "oss-cn-guangzhou", // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
      accessKeyId: process.env.OSS_ACCESS_KEY_ID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
      bucket: "z-cadillac", // 示例：'my-bucket-name'，填写存储空间名称。
      timeout: 12000,
    });
    let url = client.signatureUrl(key, {
      // process: 'image/resize,w_200', // 设置图片处理参数。
      expires: 36,
    });
    this.success({ url }, "success");
  }
}

module.exports = FileController;
