<template>
    <div class="order-list-box">
        <div class="header-box">
            <span class="iconfont icon-tubiaozhizuomoban_dianyuan"></span>
            <span class="iconfont icon-shezhi1"></span>
        </div>
        <div class="content-box">
            <order-item 
                v-for="(item, index) in orderList2" 
                :key="'order-item-' + index"
                :order="item">
            </order-item>
        </div>
    </div>
</template>
<script>
import OrderItem from "./item";
import {formatDate} from "../../util";
export default {
    data() {
        return {
            orderList: [
                {
                    baseInfo: {orderNo: 1, tableNo: 3, note: "免香菜"},
                    goodsArray: [
                        {title: "辣椒炒肉", count: 1, note: "免姜"},
                        {title: "凉拌黄瓜", count: 1, note: "免香菜"}
                    ]
                },
                {
                    baseInfo: {orderNo: 1, tableNo: 3, note: "免香菜"},
                    goodsArray: [
                        {title: "辣椒炒肉", count: 1, note: "免姜"},
                        {title: "凉拌黄瓜", count: 1, note: "免香菜"}
                    ]
                },
                {
                    baseInfo: {orderNo: 1, tableNo: 3, note: "免香菜"},
                    goodsArray: [
                        {title: "辣椒炒肉", count: 1, note: "免姜"},
                        {title: "凉拌黄瓜", count: 1, note: "免香菜"}
                    ]
                },
                {
                    baseInfo: {orderNo: 1, tableNo: 3, note: "免香菜"},
                    goodsArray: [
                        {title: "辣椒炒肉", count: 1, note: "免姜"},
                        {title: "凉拌黄瓜", count: 1, note: "免香菜"}
                    ]
                },
                {
                    baseInfo: {orderNo: 1, tableNo: 3, note: "免香菜"},
                    goodsArray: [
                        {title: "辣椒炒肉", count: 1, note: "免姜"},
                        {title: "凉拌黄瓜", count: 1, note: "免香菜"}
                    ]
                },
            ]
        }
    },
    computed: {
        orderList2() {
            console.log("list", this.$store.getters.getOrderList);
            
            return this.$store.getters.getOrderList.map(item => {
                return {
                    baseInfo: {
                        ...item.baseInfo,
                        time: formatDate(item.baseInfo.createDate)
                    },
                    goodsArray: item.goodsArray
                }
            });
        }
    },
    methods: {
        getOrderList() {
            this.$store.dispatch("getOrderList", {companyId: 1});
        }
    },
    mounted() {
        this.getOrderList();
    },
    components: {
        OrderItem
    }
}
</script>

<style lang="scss" scoped>
.order-list-box {
    width: 100%;
    height: 100%;
    background: #f1f1f1;
    // background: #fff;
    padding: 0 0.3rem;
    display: flex;
    flex-flow: column nowrap;

    .header-box {
        height: 0.88rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .iconfont {
            display: block;
            color: #444;
            font-size: 0.4rem;
        }
        .icon-shezhi1 {
            font-size: 0.34rem;
            margin-left: 0.3rem;
        }

    }
    .content-box {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}
</style>
