<template>
    <div class="customer-box">
        <m-header title="客户列表"></m-header>
        <div class="content">
            <item v-for="(item, index) in list" 
                :key="'customer-item-' + index" />
        </div>
    </div>
</template>
<script>
import Item from "./item";
import Header from "../../components/header";
export default {
    data() {
        return {
            list: []
        }
    },
    methods: {
        async getList() {
            let userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                let data = await this.$store.dispatch("getCompanyInfoList", {saleId: userInfo.id});
                if (data) {
                    this.list = data;
                }
            }
        }
    },
    components: {
        Item,
        "m-header": Header
    },
    mounted() {
        this.getList();
    }
}
</script>
<style lang="scss" scoped>
.customer-box {
    display: flex;
    flex-flow: column nowrap;

    .content {
        flex: 1;
        overflow-y: auto;
    }
}
</style>


