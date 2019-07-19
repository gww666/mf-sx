<template>
    <div class="cell-box" @click="clickEvent" :style="mStyle">
        <span :class="['iconfont', 'icon-' + icon]" :style="{color: iconColor}"></span>
        <span class="text">{{text}}</span>
        <span class="iconfont icon-xiala-copy" v-if="hasRightArrow"></span>
    </div>
</template>
<script>
import Vue from "vue";
export default {
    props: {
        icon: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        },
        hasRightArrow: {
            type: Boolean,
            default: true
        },
        mStyle: {
            type: Object,
            default: () => ({})
        },
        iconColor: {
            type: String,
            default: "#000"
        }
    },
    methods: {
        clickEvent() {
            this.$emit("click");
        }
    }
}
</script>
<style lang="scss" scoped>
.cell-box {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.2rem;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    background: #fff;
    border-top: 1px solid #f1f1f1;

    &>.iconfont:nth-of-type(1) {
        font-size: 0.46rem;
    }
    .text {
        font-size: 0.3rem;
        color: #444;
        flex: 1;
        margin-left: 0.3rem;
    }
    &>.iconfont:nth-of-type(3) {
        font-size: 0.5rem;
        color: #999;
    }

}
</style>


