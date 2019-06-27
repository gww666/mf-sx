<template>
    <div class="login-box">
        <div class="title-box">
            <span class="iconfont icon-chushi"></span>
            <span class="title">智慧厨房</span>
        </div>
        <div class="form-box out-line">
            <!-- <div class="middle-line">
                <div class="inside-line"></div>
            </div> -->
            <input1 icon="canting" v-model="companyId" placeholder="请输入餐厅编号" :iconClearStyle="iconClearColor" :iconColor="iconColor" :inputStyle="inputStyle" :mStyle="input1Style" />
            <input1 icon="chushi1" v-model="account" placeholder="请输入厨师编号" :iconClearStyle="iconClearColor" :iconColor="iconColor" :inputStyle="inputStyle" :mStyle="input1Style" />
            <input1 icon="mima" v-model="password" type="password" placeholder="请输入登录密码" :iconClearStyle="iconClearColor" :iconColor="iconColor" :inputStyle="inputStyle" :mStyle="input1Style" />
            <btn1 text="开始使用" :style="btnStyle" @click="login" />
        </div>
    </div>
</template>
<script>
import Input1 from "../../components/input/input1";
import Btn1 from "../../components/button/btn1";
export default {
    data() {
        return {
            input1Style: {
                width: "80%",
                marginBottom: "0.3rem",
            },
            inputStyle: {
                background: "transparent",
                borderBottom: "1px solid #ccc",
                // textAlign: "center"
            },
            iconColor: "#444",
            iconClearColor: {
                color: "#ccc"
            },
            btnStyle: {
                width: "80%",
                marginTop: "0.2rem"
            },
            companyId: "",
            account: "",
            password: ""
        }
    },
    methods: {
        login() {
            this.$router.push("/orderList");
        }
    },
    components: {
        Input1,
        Btn1
    }
}
</script>
<style lang="scss" scoped>
.login-box {
    width: 100%;
    height: 100%;
    background: #667399;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;

    .title-box {
        display: flex;
        align-items: center;
        color: #e0e0e0;
        transform: translateY(-0.3rem);

        .iconfont {
            font-size: 0.4rem;
            margin-right: 0.3rem;
            font-weight: bold;
        }

        .title {
            font-size: 0.5rem;
        }
    }
    .form-box {
        width: 6rem;
        height: 6rem;
        // background: #f0f0f0;
        background: rgba(255, 255, 255, 0.85);
        // border: 2px solid #444;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        flex-flow: column nowrap;
        align-items: center;


        // .middle-line {
        //     width: 100%;
        //     height: 100%;
        //     border: 3px solid #fff;
        //     border-radius: 5px;
        // }

        // .inside-line {
        //     width: 100%;
        //     height: 100%;
        //     border: 2px solid #444;
        //     border-radius: 5px;
        // }
    }
}
</style>


