<template>
    <div class="login-box">
        <m-header title="登录"></m-header>
        <img src="../../../public/images/icon.png" class="logo"/>
        <div class="form">
            <div class="pwd-login-box" v-if="loginType === 'pwd'">
                <phone-input v-model="phone" placeholder="请输入手机号"></phone-input>
                <phone-input v-model="password" :mStyle="codeInputStyle" placeholder="请输入密码" icon="lock" type="password"></phone-input>
                <btn :mStyle="btnStyle" text="开始使用" @click="loginByPwdEvent"></btn>
            </div>
            <div class="code-login-box" v-else-if="loginType === 'code'">
                <phone-input v-model="phone" placeholder="请输入手机号"></phone-input>
                <code-input :mStyle="codeInputStyle" @click="getCodeEvent" v-model="code"></code-input>
                <btn :mStyle="btnStyle" text="开始使用" @click="loginByCodeEvent"></btn>
            </div>
            <div class="handle-box">
                <span class="register" @click="register">点我注册</span>
                <span>|</span>
                <span class="code-login" @click="changeLoginType">{{loginText}}</span>
                <span>|</span>
                <span class="forget-pwd" @click="forgetPwd">忘记密码？</span>
            </div>
        </div>
    </div>
</template>
<script>
import Header from "../../components/header";
import PhoneInput from "../../components/input/phone";
import Input2 from "../../components/input/input2";
import CodeInput from "../../components/input/code";
import Btn from "../../components/button/btn1";
import Toast from "../../components/toast";
import md5 from "js-md5";
export default {
    data() {
        return {
            codeInputStyle: {
                marginTop: "0.5rem"
            },
            btnStyle: {
                marginTop: "1rem"
            },
            loginText: "验证码登录",
            phone: "",
            password: "",
            code: "",
            loginType: "pwd", //pwd || code
            msgId: "",//短信id
        }
    },
    methods: {
        //获取验证码
        async getCodeEvent() {
            return;
            // console.log(this.phone);
            let reg = /[0-9]{11}/;
            if (!reg.test(this.phone)) return Toast("手机号不正确");
        },
        //往localStorage中写入userToken并且设置用户信息
        setUserInfo(userInfo) {
            localStorage.setItem("sessionId", userInfo.sessionId);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        },
        //账号密码登录事件
        async loginByPwdEvent() {
            let reg = /[0-9]{11}/;
            if (!reg.test(this.phone)) return Toast("手机号不正确");
            let params = {
                phone: this.phone,
                password: md5(this.password),
                loginType: 1
            }
            let data = await this.$store.dispatch("saleLoginByPwd", params);
            if (data) {
                this.setUserInfo(data[0]);
                // location.replace("./productList.html");
                this.$router.replace("/user");
            }
        },
        //手机号、验证码登录
        async loginByCodeEvent() {
            return;
            let params = {
                phone: this.phone,
                msgId: this.msgId,
                code: this.code,
                loginType: 2
            }
        },
        //改变登录类型
        changeLoginType() {
            if (this.loginType === "code") {
                this.loginType = "pwd";
                this.loginText = "验证码登录";
            } else {
                this.loginType = "code";
                this.loginText = "密码登录";
            }
            
        },
        //注册
        register() {
            // location.href = "/password.html";
            this.loginType = "code";
            this.loginText = "密码登录";
        },
        forgetPwd() {
            return;
            location.href = "./password.html";
        }
    },
    components: {
        "m-header": Header,
        PhoneInput,
        CodeInput,
        Btn,
        Input2
    }
}
</script>

<style lang="scss" scoped>
.login-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    background: #fff;
    align-items: center;

    .logo {
        width: 2rem;
        height: 2rem;
        margin-top: 1rem;
    }

    .form {
        width: 70%;
        margin-top: 1rem;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        &>div {
            position: relative;
            width: 100%;

            .iconfont {
                position: absolute;
                left: 0.1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
                font-size: 0.3rem;
            }
            .icon-clear {
                left: unset;
                right: 0.1rem;
                color: #e0e0e0;
            }
            input {
                display: block;
                box-sizing: border-box;
                padding: 0 0.8rem;
                outline: none;
                border: 0;
                border-bottom: 1px solid #e0e0e0;
                width: 100%;
                height: 0.9rem;
                font-size: 0.26rem;
                color: #444;
            }
        }
        .password-box {
            margin-top: 0.3rem;
        }
        .btn {
            width: 100%;
            border-radius: 5px;
            height: 1rem;
            background: #1db3f7;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 0.3rem;
            margin-top: 0.88rem;
        }
        .handle-box {
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.2rem;
            margin-top: 0.3rem;


            .code-login, .register {
                color: #1db3f7;
                
            }
            .forget-pwd {
                color: #999;
            }
        }
    }
}
</style>


