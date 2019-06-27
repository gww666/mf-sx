<script>
import Vue from "vue";
import Component from "vue-class-component";

import { Input, Button, message } from "ant-design-vue";
Vue.use(Input);
Vue.use(Button);

import { loginRequest } from "./axios";

@Component
export default class Login extends Vue {
    username = "";
    password = "";
    async doLogin() {
        if (!this.username) {
            message.warning("请输入用户名");
            return;
        };
        try {
            let res = await loginRequest(this.username, this.password);
            if (res.data.returnCode === 1) {
                this.$store.dispatch("qxz/updateUserInfo", res.data.data[0]);
                localStorage.setItem("sessionId", res.data.data[0].sessionId);
                message.success("登录成功");
                this.$router.replace({name: "dishManagement"});
            } else {
                message.error("用户名或密码不正确");
            };
        } catch (err) {
            console.log(err, "登录错误");
        };
    }
    goResetPsd() {
        this.$router.push({name: "resetPsd"});
    }
	render() {
		return (
            <div class="login-page">
                <h1 class="title">后台管理登录</h1>
                <div class="login-box">
                    <p class="input-item">
                        <span>用户名：</span>
                        <a-input class="inputs" v-model={this.username} placeholder="请输入用户名" />
                    </p>
                    <p class="input-item">
                        <span>密码：</span>
                        <a-input class="inputs" onPressEnter={this.doLogin} v-model={this.password} type={"password"} placeholder="请输入密码" />
                    </p>
                    <div class="btns-field">
                        <a-button type="primary" class="login-btn" onClick={this.doLogin}>登录</a-button>
                        <p class="forgot-psd" onClick={this.goResetPsd}>忘记密码？</p>
                    </div>
                </div>
            </div>
		)
	}
}
</script>
<style lang="less" scoped>
    .login-page{
        width: 100%;
        height: 100%;
        background: no-repeat center/100% url("../../assets/images/bg.png");
    }
    .title{
        width: 100%;
        height: 260px;
        line-height: 450px;
        color: #f5f5f5;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
    }
    .login-box{
        width: 400px;
        height: 188px;
        background: #FFF;
        padding: 30px;
        margin: 0 auto;
        box-sizing: border-box;
        border: 1px solid #1890ff;
        border-radius: 5px;
        text-align: center;
    }
    .input-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        .inputs{
            width: 270px;
        }
        .verify-code{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 270px;
        }
        .verify-input{
            width: 210px;
        }
    }
    .btns-field{
        height: 32px;
        position: relative;
    }
    .login-btn{
        margin: 0 auto;
    }
    .forgot-psd{
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 0;
        height: 32px;
        line-height: 32px;
        color: #1890ff;
        cursor: pointer;
    }
    .code-img{
        width: 70px;
        height: 32px;
        margin-left: 5px;
        border-radius: 3px;
    }
</style>