<template>
    <div class="settings-box">
        <m-header title="设置"></m-header>
        <div class="content-box">
            <mt-radio
                style="display: flex;align-items: center;"
                title="每屏菜单数"
                v-model="itemCount"
                :options="['4', '6', '9']">
            </mt-radio>
        </div>
    </div>
</template>
<script>
import { Radio } from 'mint-ui';
import Header from "../../components/header";
export default {
    data() {
        return {
            // itemCount: "4"
        }
    },
    computed: {
        itemCount: {
            get() {
                return this.$store.state.settings.itemCount + "";
            },
            set(val) {
                this.$store.commit("setItemCount",  Number(val));
            }
        }
    },
    watch: {
        
    },
    components: {
        "mt-radio": Radio,
        'm-header': Header
    }
}
</script>
<style lang="scss" scoped>
.settings-box {
    display: flex;
    flex-flow: column nowrap;

    .content-box {
        flex: 1;
        overflow-y: auto;
    }
}
</style>

