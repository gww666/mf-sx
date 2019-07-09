<template>
    <div class="header-component-box">
        <span @click="back" class="iconfont icon-xiala" v-if="hasLeftArrow"></span>
        <span class="text">{{title}}</span>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        hasLeftArrow: {
            type: Boolean,
            default: true
        },
        back: {
            type: Function,
            default: () => {
                window.history.go(-1);
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.header-component-box {
    position: relative;
    font-size: 0.4rem;
    color: #666;
    height: 0.88rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;

    .iconfont {
        position: absolute;
        left: 0.2rem;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        // color: #fff;
        font-size: 0.5rem;
    }
}
</style>
