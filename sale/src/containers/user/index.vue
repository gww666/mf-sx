<template>
    <div class="user-box">
        <div class="info-box">
            <div class="tx">
                <img src="../../../public/images/tx.png" alt="">
            </div>
            <div class="info">
                <p class="name">
                    {{userInfo.name}}
                </p>
                <p class="mobile">
                    {{userInfo.phone}}
                </p>
            </div>
        </div>
        <!-- cell -->
        <cell icon="qianyue" iconColor="rgb(239, 173, 7)" text="签约" @click="qianyue"></cell>
        <cell icon="xingzhuang" iconColor="rgb(239, 173, 7)" text="我的客户" @click="customer"></cell>
        <cell icon="dd_active" iconColor="rgb(247, 144, 4)" text="我的订单" @click="detail"></cell>
        <cell icon="shouyi" iconColor="rgb(245, 58, 61)" text="我的收益" @click="settings"></cell>
        <cell icon="mingpian" iconColor="rgb(6, 95, 218)" text="我的名片" @click="detail"></cell>
        <cell icon="tuandui" iconColor="#9481ff" text="我的团队" @click="settings"></cell>
        <cell style="border-bottom: 1px solid #f1f1f1;" icon="shezhi1" iconColor="rgb(142, 139, 158)" text="设置" @click="settings"></cell>
    </div>
</template>
<script>
import Cell from "../../components/cell";
import Toast from "../../components/toast";
export default {
    data() {
        return {
            userInfo: {
                phone: "12345678901",
                id: "12132",
                name: "gay齐"
            }
        }
    },
    methods: {
        qianyue() {
            this.$router.push("/add");
        },
        detail() {
            //跳转到申请记录页面
            console.log("跳转到申请记录页面");
            
        },
        customer() {
            //跳转到客户界面
            this.$router.push("/customer");
        },
        settings() {
            //跳转到设置页面
            console.log("跳转到设置页面");
            this.$router.push("/settings");
        }
    },
    async created() {
        if (localStorage.getItem("userInfo")) {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
            // this.userInfo = {
            //     id: 1212,
            //     phone: 15779717277
            // };
        } else {
            //跳转到登录界面
            Toast("登录信息失效！");
            this.$router.replace("/login");
            // location.href = "./login.html";
        }
    },
    mounted() {

    },
    components: {
        Cell
    }
}
</script>
<style lang="scss" scoped>
.user-box {
    .off {
        // background: red;
        // width: 100%;
        // height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
        background: rgba(0, 0, 0, 0);
    }
    .info-box {
        height: 3rem;
        width: 100%;
        background-color: skyblue;
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
        background: url("../../../public/images/bg.png") no-repeat;
        background-size: 100% 100%;
        // justify-content: space-evenly;
        
        &>div {
            margin-left: 0.5rem;
        }

        .tx {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .info {
            font-size: 0.32rem;
            color: #e6e6e6;

            &>p:nth-of-type(2) {
                margin: 0.1rem 0;
            }

            .channel {
                max-width: 4.4rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
}
</style>

