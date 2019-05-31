<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button } from "ant-design-vue";
Vue.use(Input);
Vue.use(Button);
@Component
export default class ResetPsd extends Vue {
    userName = "";
    password = "";
    verifyCode = "";
    img = require("../../assets/images/bg.png");
    doLogin() {
        console.log(this.userName, this.password, this.verifyCode, 'ssssssssss');
        this.$router.replace({name: "home"});
    }
    getVerifyCode() {

    }
	render() {
		return (
            <div class="login-page">
                <h1 class="title">重置密码</h1>
                <div class="login-box">
                    <p class="input-item">
                        <span>手机号：</span>
                        <a-input class="inputs" v-model={this.userName} placeholder="请输入手机号" />
                    </p>
                    <p class="input-item">
                        <span>新密码：</span>
                        <a-input class="inputs" v-model={this.password} type={"password"} placeholder="请输入密码" />
                    </p>
                    <p class="input-item">
                        <span>确认新密码：</span>
                        <a-input class="inputs" v-model={this.password} type={"password"} placeholder="请输入密码" />
                    </p>
                    <p class="input-item">
                        <span>短信验证码：</span>
                        <div class="verify-code">
                            <a-input class="inputs verify-input" v-model={this.verifyCode} type={"password"} placeholder="请输短信验证码" />
                            <a-button type="primary" class="login-btn" onClick={this.getVerifyCode}>获取验证码</a-button>
                        </div>
                    </p>
                    <div class="btns-field">
                        <a-button type="primary" class="login-btn" onClick={this.doLogin}>登录</a-button>
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
        text-align: center;
    }
    .login-box{
        width: 400px;
        height: 235px;
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