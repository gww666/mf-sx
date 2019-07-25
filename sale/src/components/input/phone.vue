<template>
    <div class="phone-box" :style="mStyle">
        <span :class="['iconfont', 'icon-' + icon]"></span>
        <input :type="type" :placeholder="placeholder" @change="change" v-model="value" />
        <span class="iconfont icon-clear" @click="clear"></span>
    </div>
</template>
<script>
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
        icon: {
            type: String,
            default: "phone"
        },
        blur: {
            type: Function,
            default: () => {}
        },
        type: {
            type: String,
            default: "text"
        }
    },
    data() {
        return {
            value: ""
        }
    },
    methods: {
        change(e) {
            this.$emit("input", this.value);
        },
        clear() {
            this.value = "";
            this.$emit("input", this.value);
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
.phone-box {
    position: relative;
    width: 100%;

    .iconfont {
        position: absolute;
        left: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: 0.3rem;
    }
    .icon-clear {
        left: unset;
        right: 0.1rem;
        color: #e0e0e0;
    }
    input {
        display: block;
        box-sizing: border-box;
        padding: 0 0.8rem;
        outline: none;
        border: 0;
        border-bottom: 1px solid #e0e0e0;
        width: 100%;
        height: 0.9rem;
        font-size: 0.26rem;
        color: #444;
    }
}
</style>

