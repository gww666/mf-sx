<template>
    <div class="code-box" :style="mStyle">
        <span class="iconfont icon-mima1"></span>
        <input type="text" placeholder="请输入验证码" @change="change"/>
        <span :class="['code-btn', codeBtnState ? '' : 'code-btn-disable']" @click="codeBtnClickEvent">{{codeText}}</span>
    </div>
</template>
<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        mStyle: {
            type: Object,
            default: () => {}
        },
        // value: {
        //     type: Function,
        //     default: () => {}
        // },
        blur: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            codeText: "获取验证码",
            codeBtnState: true,
            countDownTime: 60
        }
    },
    methods: {
        change(e) {
            this.$emit("input", e.target.value);
        },
        clearTimer() {
            if (this.timer) {
                console.log("清除计时器");
                
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        codeBtnClickEvent() {
            if (!this.codeBtnState) return;
            //开启倒计时
            this.codeBtnState = false;
            this.codeText = this.countDownTime + "s";
            this.timer = setInterval(() => {
                this.countDownTime -= 1;
                if (this.countDownTime < 0) {
                    //停止倒计时
                    this.clearTimer();
                    this.codeText = "获取验证码";
                    this.countDownTime = 60;
                    this.codeBtnState = true;
                    return;
                }
                this.codeText = this.countDownTime + "s";
            }, 1000);
            this.$emit("click");
        }
    },
    beforeDestroy() {
        this.clearTimer();
    },
    watch: {

    }  
}
</script>
<style lang="scss" scoped>
.code-box {
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

    .code-btn {
        color: #1db3f7;
        font-size: 0.2rem;
        border: 1px solid #1db3f7;
        border-radius: 5px;
        position: absolute;
        right: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
        padding: 0.1rem 0.2rem;
        min-width: 0.6rem;
        text-align: center;
    }
    .code-btn-disable {
        color: #bbb;
        border: 1px solid #bbb;
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
</style>

