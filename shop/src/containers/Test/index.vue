<template>
    <div class="test-box">
        <div class="main"></div>
        <cart></cart>
    </div>
</template>
<script>
import Cart from "../../components/cart";
export default {
    components: {
        Cart
    }
}
</script>
<style lang="scss" scoped>
.test-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;

    .main {
        flex: 1;
    }
}
</style>


