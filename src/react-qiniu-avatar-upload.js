/* global ActiveXObject */
import React, { Component } from "react";
import ReactImageCrop from "./react-image-crop";
import * as qiniu from "qiniu-js";
import PropTypes from "prop-types";

class ReactQiniuAvatarUpload extends Component {
  constructor(props) {
    super(props);
    this.cropRef = React.createRef();
    this.state = {
      token: null
    };
  }

  static defaultProps = {
    // 七牛上传config
    qiniuUploadConfig: {
      region: qiniu.region.z2
    },
    // 七牛上传putExtra
    qiniuUploadPutExtra: {
      fname: ""
    },
    // 获取七牛token的method
    qiniuTokenMethod: "GET",
    // 支持跨域
    withCredentials: false,
    // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    ki: 0
  };

  static propTypes = {
    qiniuUploadConfig: PropTypes.object,
    qiniuUploadPutExtra: PropTypes.object,
    qiniuTokenMethod: PropTypes.string,
    // 获取七牛token的地址
    qiniuTokenUrl: PropTypes.string.isRequired,
    withCredentials: PropTypes.bool,
    ki: PropTypes.number,
    handleCropUploadSuccess: PropTypes.func.isRequired,
    handleCropUploadFail: PropTypes.func.isRequired
  };

  // 上传图片
  upload({ createImgUrl, blob, file }) {
    const that = this,
      {
        ki,
        handleCropUploadSuccess,
        handleCropUploadFail,
        qiniuUploadPutExtra,
        qiniuUploadConfig
      } = that.props;
    const observable = qiniu.upload(
      blob,
      file.name,
      this.state.token,
      qiniuUploadPutExtra,
      qiniuUploadConfig
    );
    const observer = {
      next(res) {},
      error(err) {
        handleCropUploadFail(err, ki);
      },
      complete(res) {
        handleCropUploadSuccess(res, ki);
      }
    };
    observable.subscribe(observer); // 上传开始
  }

  // 获取七牛token
  getToken() {
    const that = this,
      { withCredentials, qiniuTokenUrl, qiniuTokenMethod } = that.props;
    let client;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      client = new XMLHttpRequest();
    } else {
      // IE6, IE5 浏览器执行代码
      client = new ActiveXObject("Microsoft.XMLHTTP");
    }
    client.withCredentials = withCredentials;
    client.onreadystatechange = function() {
      if (client.readyState === 4 && client.status === 200) {
        const res = JSON.parse(client.responseText);
        that.setState({
          token: res.data.token
        });
      }
    };
    client.open(qiniuTokenMethod, qiniuTokenUrl, true);
    client.send();
  }

  componentDidMount() {
    this.getToken();
  }

  render() {
    return (
      <ReactImageCrop
        {...this.props}
        upload={this.upload.bind(this)}
        ref={this.cropRef}
      />
    );
  }
}

export default ReactQiniuAvatarUpload;
