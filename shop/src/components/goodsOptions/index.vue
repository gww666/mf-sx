<template>
    <div class="options-shadow" v-if="visible">
        <div class="options-box" >
            <p class="title">{{title}}</p>
            <div class="opertion-bar">
                <p></p><p>加入购物车</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        
    },
    data() {
        return {
            visible: false,
            goodsInfo: {}
        }
    },
    computed: {
        
    },
    methods: {
        open(goodsInfo) {
            this.visible = true;
            this.goodsInfo = goodsInfo;
        },
        close() {
            this.visible = false;
        },
        confirm() {
            this.$emit("doSelect", this.goodsInfo);
        }
    },
    components: {
        
    }
    
}
</script>
<style lang="scss" scoped>
    .options-shadow{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        background: rgba($color: #000000, $alpha: .2)
    }
    .options-box {
        width: 100%;
        height: 8rem;
        border-radius: .4rem .4rem 0 0;
        background: #FFF;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .opertion-bar{
        width: 100%;
        height: 0.88rem;

    }
</style>

