<template>
    <input type="text" :placeholder="placeholder" 
        class="base-input-text" :style="mStyle" v-model="val" 
        @blur="blur" />
</template>
<script>
import "../../util/font-size";
export default {
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        mStyle: {
            type: Object,
            default: () => {}
        },
        value: {
            type: Function,
            default: () => {}
        },
        blur: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            val: ""
        }
    },
    watch: {
        val(newVal) {
            this.value(newVal);
        }
    }  
}
</script>
<style lang="scss" scoped>
    .base-input-text {
        width: 92%;
        height: 0.88rem;
        flex-shrink: 0;
        border-radius: 0.44rem;
        padding: 0 0.43rem;
        color: #333;
        font-size: 0.32rem;
        border: 0;
        outline: none;
        box-sizing: border-box;
    }
</style>

