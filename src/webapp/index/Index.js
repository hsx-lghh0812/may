/**
 * Created by hsx on 2017/5/8.
 */
import React, {Component} from 'react';
import head_icon from "../source/head.png";
import {bindActionCreators} from 'redux'
import {promptTypes} from "../../actions/actionType"
import {connect} from 'react-redux';
import Qr from "../../common/Qr";
import {updateProfile} from "../../actions/loginController"
import {promptOp} from "../../actions/promptController"
import {pathSeparator} from "../../common/common"
class Index extends Component {


    constructor(props) {
        super(props);
        this.options = {
            text: "http://www.yltfy.cn/#/static/private/index",
            width: 256,
            height: 256,
            typeNumber: -1,
            correctLevel: 2,
            background: "#ffffff",
            foreground: "#000000"

        }
        this.state = {
            userLogo: (this.props.userInfo && this.props.userInfo.userlogo) ? pathSeparator(this.props.userInfo.userlogo) : head_icon,
            edit: false,
            userInfo: this.props.userInfo,
            qrcoe: "",
            autoFocus: false,
            logoChange: false
        }
    }


    render() {
        return (
            <div style={{padding: "60px 60px 0px 60px"}}>
                <div className="form-horizontal index-basic">

                    <div className="form-group">
                        <label className="col-sm-2 control-label" style={{paddingTop: "0"}}>名称</label>
                        <div className="col-sm-10">
                            <span
                                className={"name_label " + (this.state.edit ? "hide" : "")}>{this.state.userInfo.username}<span
                                className="mgl10 op-text"
                                onClick={(e) => this.editName(e, true)}>修改名称</span></span>
                            <input ref="username_input"
                                   value={this.state.userInfo.username ? this.state.userInfo.username : ""}
                                   onChange={(e) => this.editName(e, false)}
                                   onBlur={(e) => this.editFinish(e)}
                                   className={"form-control " + (this.state.edit ? "" : "hide")}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label" style={{paddingTop: "0"}}>头像</label>
                        <div className="col-sm-10">
                            <div className="head-pic">
                                <input ref="head_fileUpload" type="file" onChange={(e) => this.showNewLogo(e)}
                                       className="hide"/>
                                <img src={this.state.userLogo}/>
                                <div onClick={() => this.updateHeadLogo()}>修改头像</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label" style={{paddingTop: "0"}}>二维码</label>
                        <div className="col-sm-10"><Qr ref="tempQr" options={this.options} args={{
                            canvasId: "qrcode", canvasClass: "rect", returnType: true,
                            hasLogo: true, logoPath: this.state.userLogo
                        }}/>
                            <a onClick={() => {
                                this.refs.tempQr.getBase64Img();
                            }}>下载
                            </a>
                        </div>
                    </div>

                    {/*<div className="form-group">
                     <div className="col-sm-offset-2 col-sm-10">
                     <div className="checkbox">
                     <label>
                     <input type="checkbox"/> Remember me
                     </label>
                     </div>
                     </div>
                     </div>*/}
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default" onClick={() => this.updateUserInfo()}>
                                update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    updateUserInfo() {
        this.props.promptOps({
            type: promptTypes.promptLoading,
            status: true
        });
        var formData = new FormData();
        if (this.state.logoChange)
            formData.append('userLogo', this.refs.head_fileUpload.files[0]);
        formData.append('accessToken', this.props.userInfo.access_token);
        formData.append('username', this.props.userInfo.username);
        this.props.updateProfile({
            formData: formData,
            callback: (data) => {
                this.setState({userLogo: pathSeparator(data.result.userlogo), userInfo: data.result});
                console.log("update  success")
                this.props.promptOps({
                    type: promptTypes.promptSuccess,
                    status: true,
                    content:"更新成功"
                });
            }
        });
    }

    updateHeadLogo() {
        this.refs.head_fileUpload.click();
    }

    showNewLogo(e) {
        let fr = new FileReader();
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = (frEvent) => {
            this.setState({userLogo: frEvent.target.result, logoChange: true});
        }
    }

    editName(e, flag) {
        //点击修改名字
        if (flag) {

            this.setState({edit: true, autoFocus: true});
            // 300毫秒之后获得焦点
            setTimeout(() => {
                this.refs.username_input.focus();
            }, 200);
        }
        // 触发input的onchange 事件
        else { console.log(e.target.value,">>>>>>>>>>>>>>>>>>>>>>>>>>");
            let temp = this.state.userInfo;
            temp.username = e.target.value;
            console.log(temp,">>>>>>>>>>>>>>>>>>>>>>>>>>");
            this.setState({userInfo: temp});
        }
    }

    editFinish(e) {
        this.setState({edit: false});
    }
}

const mapStateToProps = state => ({
    userInfo: state.loginRd.userInfo,
})

const mapDispatchToProps = dispatch => ({
    updateProfile: bindActionCreators(updateProfile, dispatch),
    promptOps: bindActionCreators(promptOp, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index)