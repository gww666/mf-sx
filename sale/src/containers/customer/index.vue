<template>
    <div class="customer-box">
        <m-header title="客户列表"></m-header>
        <div class="content">
            <item v-for="(item, index) in getList" 
                :key="'customer-item-' + index" 
                :info="item"/>
        </div>
    </div>
</template>
<script>
import Item from "./item";
import Header from "../../components/header";
import {formatDate} from "../../util";
export default {
    data() {
        return {
            list: []
        }
    },
    computed: {
        getList() {
            //按照创建顺序进行降序
            this.list.sort((m, n) => m.createDate > n.createDate);
            return this.list.map(item => {
                let state = "";
                if (item.state === 1) {
                    state = "正常";
                } else if (item.state === 2) {
                    state = "套餐过期";
                } else if (item.state === 4) {
                    state = "待付款";
                }
                return {
                    ...item,
                    state,
                    date: formatDate(item.createDate)
                }
            });
        }
    },
    methods: {
        async getListEvent() {
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
        this.getListEvent();
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


