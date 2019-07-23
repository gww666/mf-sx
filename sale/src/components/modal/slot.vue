<template>
    <div class="modal-box" v-show="value">
        <div class="modal-slot-box">
            <div class="header">
                {{title}}
            </div>
            <div class="content">
                <slot></slot>
            </div>
            <div class="btn-box">
                <span class="cancel" @click="cancel">取消</span>
                <span class="confirm" @click="confirm">确定</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "标题"
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    methods: {
        cancel() {
            this.$emit("input", false);
        },
        confirm() {
            this.$emit("input", false);
            this.$emit("confirm");
        }
    }
}
</script>
<style lang="scss" scoped>
.modal-box {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    // display: flex;
    // justify-content: center;
    // align-content: center;
}
.modal-slot-box {
    width: 92%;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .header {
        padding: 0.3rem 0;
        text-align: center;
        font-size: 0.3rem;
    }
    .content {
        min-height: 0.3rem;

        font-size: 0.3rem;
    }
    .btn-box {
        width: 100%;
        display: flex;
        border-top: 1px solid #e0e0e0;
        height: 0.8rem;
        font-size: 0.3rem;

        span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
            box-sizing: border-box;
        }

        .cancel {
            border-right: 1px solid #e0e0e0;
        }
        .confirm {
            color: #1db3f7;
        }

    }
}
</style>

