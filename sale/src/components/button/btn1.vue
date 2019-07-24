<template>
    <div @click="click" :style="mStyle" class="btn2">{{text}}</div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "确定"
        },
        mStyle: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {}
    },
    methods: {
        click() {
            this.$emit("click");
        }
    },
    

}
</script>
<style lang="scss" scoped>
.btn2 {
    width: 100%;
    height: 0.88rem;
    background: #1db3f7;
	border-radius: 5px;
    color: #fff;
    font-size: 0.32rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>

