<template>
    <div class="header-component-box">
        <span @click="back" class="iconfont icon-xiala-copy" v-if="hasLeftArrow"></span>
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
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
.header-component-box {
    font-size: 0.4rem;
    color: white;
    // font-weight: bold;
    height: 0.88rem;
    width: 100%;
    background-color: #1db3f7;
    text-align: center;
    line-height: 0.88rem;
    position: relative;

    .iconfont {
        position: absolute;
        left: 0.2rem;
        top: 50%;
        transform: translateY(-50%) rotate(180deg);
        color: #fff;
        font-size: 0.6rem;
    }
}
</style>

