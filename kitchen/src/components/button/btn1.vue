<template>
    <div class="btn1-box" @click="click">{{text}}</div>
</template>
<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        }
    },
    methods: {
        click() {
            this.$emit("click");
        }
    }
}
</script>
<style lang="scss" scoped>
.btn1-box {
    background: #667399;
    height: 0.88rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.3rem;
    border-radius: 5px;
}
</style>


