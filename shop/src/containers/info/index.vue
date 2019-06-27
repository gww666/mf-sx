<template>
    <div class="info-box">
        <div class="header">下单状态</div>
        <div class="info">
            <span class="iconfont icon-success"></span>
            <span class="msg">厨房已接单</span>
        </div>
        <div class="handle-box">
            <span class="show-order" @click="showOrder">查看订单</span>
            <span class="mid"></span>
            <span class="add-goods" @click="addGoods">继续加菜</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        orderData() {
            return this.$store.state.qxz.unfinishedOrder;
        }
    },
    methods: {
        showOrder() {
            this.$router.push({name: "checkOrderDetail", params: {orderNo: this.orderData.orderNo, payment: this.orderData.payment}})
        },
        addGoods() {
            this.$router.replace({name: "orderPage"})
        }
    },
    created() {
        
    }
}
</script>
<style lang="scss" scoped>
.info-box {
    width: 100%;
    background: #FFF;
    .header {
        font-size: 0.4rem;
        color: #666;
        height: 0.88rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #e6e6e6;
    }
    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;

        .iconfont {
            color: #5fb905;
            font-size: 1.2rem;
        }
        .msg {
            margin-top: 0.4rem;
            font-size: 0.4rem;
            color: #666;
        }
    }

    .handle-box {
        margin-top: 1rem;
        display: flex;
        width: 100%;
        justify-content: center;

        .show-order, .add-goods {
            border-radius: 3px;
            color: #fff;
            display: block;
            font-size: 0.3rem;
            background: #ff9900;
            width: 2.3rem;
            height: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .mid {
            width: 0.4rem;
            height: 0.6rem;
            background: #fff;
        }

    }
}
</style>


