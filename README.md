# react-qiniu-avatar-upload

A beautiful react component for avatar crop and upload. （react头像剪裁上传组件）.

**Notice**: This component is designed for pc, **not recommended for use on the mobile side**.(该组件适用于pc端，不推荐手机端使用)

## 借鉴
[vue-image-crop-upload](https://github.com/dai-siki/vue-image-crop-upload)

[react-image-crop-upload](https://github.com/masongzhi/react-image-crop-upload)

## 更新日志

#### @1.0.0
- 可以读取本地图片并进行剪辑，上传到七牛

## 示例
[点我](http://dai-siki.github.io/react-qiniu-avatar-upload/example/demo.html).

## 截图
![WX20190228-103838@2x.png](https://user-gold-cdn.xitu.io/2019/2/28/16933ae6d78d03c3?w=1240&h=777&f=png&s=195290)

## 配置环境
react


## 安装
#### npm
```shell
$ npm install react-qiniu-avatar-upload
```


## 使用
#### Props
| 名称              | 类型               | 默认             | 说明                                         |
| ----------------| ---------------- | ---------------| ------------------------------------------|
| qiniuTokenUrl             | String            |   *必填                | 获取七牛token的地址    |
| qiniuTokenMethod             | String            |   'GET'                | 获取七牛token的method    |
| qiniuUploadPutExtra             | Object            |   {fname: ""}                | 七牛上传putExtra    |
| qiniuUploadConfig             | Object            |   {region: qiniu.region.z2}                | 七牛上传config     |
| width             | Number            |   200                | 最终得到的图片宽度     |
| height             | Number            |  200                 | 最终得到的图片高度   |
| imgFormat             | string            | 'png'                  | jpg/png, 最终得到的图片格式    |
| imgBgc             | string            | '#fff'                  | 导出图片背景色,当imgFormat属性为jpg时生效   |
| noCircle            | Boolean              | false             | 关闭 圆形图像预览 |
| noSquare            | Boolean              | false             | 关闭 方形图像预览 |
| noRotate            | Boolean              | true             | 关闭 旋转图像功能 |
| withCredentials          | Boolean             | false         | 支持跨域 |
| ki          | Number             | 0         | 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分 |

#### Methods
| 名称              | 说明                                         |
| ----------------| ------------------------------------------|
| handleCropUploadSuccess | 上传成功， 参数( res, ki )    |
| handleCropUploadFail    | 上传失败， 参数( err, ki )    |

#### 使用示例
```js
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import ReactQiniuAvatarUpload from "react-qiniu-avatar-upload";

class App extends Component {
  state = {
    visible: false,
    imgUrl: ""
  };

  handleClick() {
    this.setState({ visible: true });
  }

  off() {
    this.setState({ visible: false });
  }

  upload({ imgUrl, blob }) {
    console.log("imgUrl===>>>>", imgUrl);
    console.log("blob===>>>>", blob);
  }

  handleCropUploadSuccess(res, ki) {
    console.log("res ki===>>>>", res, ki);
    this.setState({
      imgUrl: "http://pnii3cub4.bkt.clouddn.com/" + res.key
    });
    this.off();
  }

  handleCropUploadFail(err, ki) {
    console.log("err ki===>>>>", err, ki);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button
            className="set-upload-btn"
            onClick={this.handleClick.bind(this)}
          >
            设置上传
          </button>
          {this.state.visible && (
            <ReactQiniuAvatarUpload
              qiniuTokenUrl="/api/v1/public/getQiniuToken"
              off={this.off.bind(this)}
              upload={this.upload.bind(this)}
              handleCropUploadSuccess={this.handleCropUploadSuccess.bind(this)}
              handleCropUploadFail={this.handleCropUploadFail.bind(this)}
            />
          )}
          {this.state.imgUrl && (
            <img style={{marginTop: '10px'}} src={this.state.imgUrl} alt="七牛上传图片" />
          )}
        </header>
      </div>
    );
  }
}

export default App;

```

## 后端设置
https://developer.qiniu.com/kodo/sdk/1289/nodejs

### 返回格式
```json
{
    success: true,
    data: {
        token: 'xxxxxx'
    }
}
```
### Koa为例
```js
async getQiniuToken(ctx) {
    // https://portal.qiniu.com/user/key
    const accessKey = accessKey;
    const secretKey = secretKey;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    const options = {
      scope: bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);
    ctx.body = {
        token
    }
  }
```
