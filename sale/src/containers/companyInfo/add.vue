<template>
    <div class="info-add-box">
        <m-header title="录入商户信息"></m-header>
        <mt-field label="商户名称" placeholder="请输入商户名称" v-model="name"></mt-field>
        <mt-field label="商户地址" placeholder="请输入商户地址" v-model="address"></mt-field>
        <mt-field label="联系电话" placeholder="请输入联系电话" v-model="phone"></mt-field>
        <mt-radio
            align="right"
            title="付款方式"
            v-model="payType"
            :options="['每月', '每季度', '每年']">
        </mt-radio>
        <div  class="add-table-no">
            <div class="btn">
                <span class="label">添加桌号</span>
                <span class="iconfont icon-addgroup" @click="addTableNo"></span>
            </div>
            <!-- 展示桌号类别组 -->
            <div class="table-no-item" v-for="(item, index) in tableNo" :key="'table-no-item-' + index">
                <span>{{item.peopleNum}}人桌</span>
                <span>{{item.tableNum}}张</span>
            </div>
        </div>

        <btn @click="submit" style="width: 92%;margin-top: 1rem;margin-left: 4%;"></btn>
        <!-- <mt-button @click.native="addTableNo">添加桌号</mt-button> -->

        <!-- <modal v-model="visible"></modal> -->
        <modal v-model="visible" title="添加桌号" @confirm="confirm">
            <div class="input-box">
                <span class="label" style="margin-right: 0.5rem;">
                    <input type="text" v-model="peopleNum"/>人桌
                </span>
                <span class="label"><input type="text" v-model="tableNum"/>张</span>
            </div>
        </modal>
    </div>
</template>
<script>
import { Field, Radio} from 'mint-ui';
import Header from "../../components/header";
import TableNoModal from "../../components/modal/slot";
import Btn from "../../components/button/btn1";
// import TableNoModal from "../../components/modal/test";
export default {
    data() {
        return {
            name: "",
            address: "",
            phone: "",
            payType: "",
            visible: false,
            peopleNum: "",
            tableNum: "",
            tableNo: []
        }
    },
    methods: {
        addTableNo() {
            this.visible = true;
        },
        confirm() {
            if (this.tableNum && this.peopleNum) {
                this.tableNo.push({
                    peopleNum: this.peopleNum,
                    tableNum: this.tableNum
                });
            }
            this.peopleNum = "";
            this.tableNum = "";
        },
        submit() {
            console.log("submit");
        }
    },
    components: {
        "mt-field": Field,
        "mt-radio": Radio,
        "m-header": Header,
        modal: TableNoModal,
        // "mt-button": Button
        Btn
    },
    watch: {
        visible(newVal) {
            console.log("visible", newVal);
        }
    }
}
</script>
<style lang="scss" scoped>
.info-add-box {
    width: 100%;
    height: 100%;
    // display: flex;
    // flex-flow: column nowrap;
    // align-items: center;

    .input-box {
        display: flex;
        padding: 0.3rem;
        justify-content: center;

        input {
            width: 0.5rem;
            border: 1px solid #e0e0e0;
            outline: none;
            margin-right: 0.1rem;
        }
        // .label {
        //     margin-right: 0.3rem;
        // }
    }

    .add-table-no {
        padding: 10px 20px 0 10px;
        .btn {
            font-size: 16px;
            display: flex;
            justify-content: space-between;

            .label {
                width: 105px;
            }
            .iconfont {
                font-size: 0.4rem;
                color: #1db3f7;
            }
        }
        .table-no-item {
            color: #999;
            font-size: 0.3rem;
            display: flex;
            justify-content: space-between;
            margin-top: 0.2rem;
        }
    }
}
</style>
