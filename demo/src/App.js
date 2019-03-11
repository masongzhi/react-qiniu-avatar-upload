import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import "react-qiniu-avatar-upload/dist/index.css";
import ReactQiniuAvatarUpload from "react-qiniu-avatar-upload";

class App extends Component {
  state = {
    visible: false,
    imgUrl: ""
  };

  handleClick = () => {
    this.setState({ visible: true });
  };

  off = () => {
    this.setState({ visible: false });
  };

  upload = ({ imgUrl, blob }) => {
    console.log("imgUrl===>>>>", imgUrl);
    console.log("blob===>>>>", blob);
  };

  handleCropUploadSuccess = (res, ki) => {
    console.log("res ki===>>>>", res, ki);
    this.setState({
      imgUrl: "http://pnii3cub4.bkt.clouddn.com/" + res.key
    });
    this.off();
  };

  handleCropUploadFail = (err, ki) => {
    console.log("err ki===>>>>", err, ki);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="set-upload-btn" onClick={this.handleClick}>
            设置上传
          </button>
          {this.state.visible && (
            <ReactQiniuAvatarUpload
              qiniuTokenUrl="/api/v1/public/getQiniuToken"
              off={this.off}
              upload={this.upload}
              withCredentials={true}
              handleCropUploadSuccess={this.handleCropUploadSuccess}
              handleCropUploadFail={this.handleCropUploadFail}
            />
          )}
          {this.state.imgUrl && (
            <img
              style={{ marginTop: "10px" }}
              src={this.state.imgUrl}
              alt="七牛上传图片"
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
