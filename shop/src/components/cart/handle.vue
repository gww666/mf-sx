<template>
    <div class="handle-box" :style="mStyle">
        <span class="reduce" v-show="goodsCount" @click="reduceGoods">-</span>
        <span class="goods-count" v-show="goodsCount">{{goodsCount}}</span>
        <span class="add" @click="addGoods">+</span>
    </div>
</template>
<script>
export default {
    props: {
        mStyle: {
            type: Object,
            default: () => ({})
        },
        goods: {
            type: Object,
            default: () => ({})
        }
        // addGoods: {
        //     type: Function,
        //     default: () => {}
        // },
        // reduceGoods: {
        //     type: Function,
        //     default: () => {}
        // }
    },
    data() {
        return {
            goodsCount: this.goods.count
        }
    },
    computed: {
        // goodsCount() {

        // }
    },
    methods: {
        addGoods() {
            this.$store.commit("gw/addGoods", this.goods);
            this.goodsCount += 1;
            this.$emit("add");
        },
        reduceGoods() {
            this.$store.commit("gw/reduceGoods", this.goods);
            this.goodsCount -= 1;
            this.$emit("reduce");
        }
    }
}
</script>
<style lang="scss" scoped>
.handle-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .reduce {
        box-sizing: border-box;
        width: 0.5rem;
        height: 0.5rem;
        border: 1px solid #ff4d4d;
        border-radius: 50%;
        background: #fff;
        color: #ff4d4d;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .add {
        box-sizing: border-box;
        width: 0.52rem;
        height: 0.52rem;
        border-radius: 50%;
        background: #ff4d4d;
        color: #fff;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .goods-count {
        color: #999;
        font-size: 0.3rem;
        width: 0.5rem;
        text-align: center;
        
    }
}
</style>


