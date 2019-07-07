<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tag, Table, Modal, Select, Input, InputNumber, message, Button } from "ant-design-vue";
import { promotionsColumn, gamesColumn } from "./datas";
import {  } from "./axios";
import { formateDate } from "../../utils/formateDate";
Vue.use(Tag);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
Vue.use(InputNumber);
const { Column } = Table;

@Component
export default class Promotions extends Vue {
    promotionsList = [];
    gamesList = [];
    // 弹出框显隐控制
    visible = false;
    modalTitle = "新增优惠券";
    // 名称
    couponsName = "";
    // 折扣金额
    rebate = "";
    // 数量
    sum = 0;
    // 优惠券列表渲染
    proTableRenderFn() {

    };
    // 优惠券操作 
    operateCoupon() {
        console.log(this.couponsName, this.rebate, this.sum)
    };
    // 发放数量设置
    sumChange(count) {
        this.sum = parseInt(count);
        console.log(count,"cjklsdjlfk")
    };
    // 打开弹出窗
    showModal() {
        this.visible = true;
    };
	render() {
		return (
            <div class="promotion-page">
                <div class="title-bar">
                    <p>活动促销</p>
                    <p class="add-btn" onClick={() => {this.showModal()}}>添加优惠券</p>
                </div>
                <Table
                    rowKey={record => record.orderNo} 
                    dataSource={this.promotionsList}
                    pagination={false}
                    locale={{emptyText: '暂无数据'}}
                >
                    {
                        promotionsColumn.map((item, index) => {
                            return (
                                <Column
                                    title={item.title}
                                    dataIndex={item.dataIndex}
                                    align="center"
                                    customRender={(text, record) => this.proTableRenderFn(text, record, item)}
                                />
                            )
                        })
                    }
                    <Column
                        title="操作"
                        key="operation"
                        width={150}
                        align="center"
                        customRender={(text, record, index) => this.proTableRenderFn(text, record, {key: "operation"}, index)}
                    />
                </Table>
                <div style="height: 50px;"></div>
                <Table
                    rowKey={record => record.orderNo} 
                    dataSource={this.gamesList}
                    pagination={false}
                    locale={{emptyText: '暂无数据'}}
                >
                    {
                        gamesColumn.map((item, index) => {
                            return (
                                <Column
                                    title={item.title}
                                    dataIndex={item.dataIndex}
                                    align="center"
                                    customRender={(text, record) => this.proTableRenderFn(text, record, item)}
                                />
                            )
                        })
                    }
                </Table>
                <a-modal
                    title={this.modalTitle}
                    okText="确定"
                    cancelText="取消"
                    mask={true}
                    centered={true}
                    v-model={this.visible}
                    destroyOnClose={true}
                    width="40%"
                    bodyStyle={{height: "200px"}}
                    onOk={this.operateCoupon}
                >
                    <div style="width: 250px;margin: 0 auto;">
                        <div class="line">
                            <p class="item-title">优惠券名：</p>
                            <Input v-model={this.couponsName} placeholder="请输入优惠券名称" />
                        </div>
                        <div class="line">
                            <p class="item-title">折扣金额：</p>
                            <InputNumber min={0} av-model={this.rebate} placeholder="请输入折扣金额" style="width: 250px;" />
                        </div>
                        <div class="line">
                            <p class="item-title">发放数量：</p>
                            <InputNumber min={1} onChange={this.sumChange} v-model={this.sum} placeholder="请输入优惠券发放数量" style="width: 250px;" />
                        </div>
                        
                    </div>
                </a-modal>
            </div>
		);
    };
    mounted() {
        
    };
}
</script>
<style lang="less" scoped>
    .promotion-page{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
    }
    .title-bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .add-btn{
        color: #1890ff;
        cursor: pointer;
    }
    .line{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
            margin: 0;
        }
    }
    .item-title{
        width: 110px;
    }
</style>