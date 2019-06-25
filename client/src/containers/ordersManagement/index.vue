<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tabs, Table, Modal, Select, InputNumber, message, Button, Pagination } from "ant-design-vue";
import formateDate from "../../utils/formateDate";
import { tableColumns, detailTableColumn } from "./datas";
import { getOrdersList, modifyTableNo, getRtOrdersList, modifyOrder } from "./axios";
Vue.use(Tabs);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(InputNumber);
Vue.use(Pagination);
const { Column } = Table;
const { TabPane } = Tabs;

@Component
export default class OrdersManagement extends Vue {
    visible = false;
    tableNoList = ["1", "2", "3", "4", "5", "6", "7"];
    // 修改的订单金额
    newSum = 0;
    modifingOrder = {};
    // 订单列表
    ordersList = [];
    // 实时订单列表
    rtOrder = [];
    // 详情列表
    detailIndex = 0;
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 获取订单列表
    async queryOrdersList() {
        if(!this.ordersList.length) {
            try {
                let res = await getOrdersList(this.userInfo.id);
                if(res.data.returnCode === 1) {
                    this.ordersList = res.data.data;
                }else {
                    message.warning("获取分类列表失败");
                };
            }catch (err) {
                console.log("获取分类列表err", err);
            };
        };
    };
    // 获取实时订单列表
    async queryRtOrdersList() {
        try {
            let res = await getRtOrdersList(this.userInfo.id);
            if(res.data.returnCode === 1) {
                let data = res.data.data;
                if(res.data.data.length) {
                    this.handleRtData(data[0]);
                }else {
                    this.rtOrder = [];
                }
            }else {
                message.warning("获取分类列表失败");
            };
        }catch (err) {
            console.log("获取分类列表err", err);
        };
    };
    // 列表渲染
    tableRenderFn(text, record, item) {
        switch (item.key) {
            case "paymentDate":
                text = text ? formateDate(text) : "";
                break;
            case "status":
                text = text === 1 ? "待支付" : "已完成";
                break;
        };
        let dom = <span>{text}</span>;
        // 操作按钮
        if (item.key === "operation") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        <p class="btn edit-btn" onClick={() => this.changeTableNo(Object.assign({}, record))}>换桌</p>
                    </div>
                </div>
            );
        };
        return dom;
    };
    // 实时列表渲染
    rtTableRenderFn(text, record, item, index) {
        // console.log(text, record, item, "tjiejljsdklfsd")
        switch (item.key) {
            case "paymentDate":
                text = text ? formateDate(text) : "";
                break;
            case "status":
                text = text === 1 ? "待支付" : "已完成";
                break;
        };
        let dom = <span>{text}</span>;
        // 操作按钮
        if (item.key === "operation") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout" style="width: 130px;">
                        <p class="btn edit-btn" onClick={() => this.changeTableNo(Object.assign({}, record))}>换桌</p>
                        <p class="btn edit-btn" onClick={() => this.changePayment(Object.assign({}, record))}>改价</p>
                        <p class="btn edit-btn" onClick={() => this.showOrderDetail(record, index)}>详情</p>
                    </div>
                </div>
            );
        };
        return dom;
    };
    // 实时列表详情列表渲染
    rtTableDetailRenderFn(text, record, item, index) {
        let dom = <span>{text}</span>;
        // 数量
        if (item.key === "count") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout" style="width: 40px;justify-content: space-between;">
                        <p>{text}</p>
                        <p class="pop-btn btn-min" onClick={() => this.minusGoodsCount(record, index)}>-</p>
                    </div>
                </div>
            );
        };
        // 操作按钮
        if (item.key === "operation") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        <p class="btn edit-btn" onClick={() => this.changeGoods(record, index)}>换菜</p>
                    </div>
                </div>
            );
        };
        return dom;
    };
    // 切换页码
    handelPageChange(pageNum) {
        this.pageNum = pageNum;
        this.queryGoodsList();
    };
    // 切换tab
    handleTabChange(index) {
        if(index == 2) {
            this.queryOrdersList();
        }
    };
    // 获取实时订单
    getRTOrder() {
        let socket = io("http://120.78.221.14:2233");
        socket.on("connect", () => {
            //连接成功后或重连后，告诉服务端
            socket.emit("join", this.userInfo.id);
        });
        socket.on("orderChange", data => {
            console.log("order changing .......")
            if(data) {
                this.handleRtData(JSON.parse(data));
            } else {
                this.rtOrder = [];
            }
        });
    };
    // 实时订单数据处理
    handleRtData(data) {
        if(data) {
            let orders = data;
            let Arr = [];
            for(let key in orders) {
                let obj = {
                    orderNo: key,
                    ...orders[key].baseInfo,
                    orderList: []
                };
                orders[key].goodsArray.forEach(item => {
                    let orderObj = {
                        ...item.baseInfo,
                        goods: []
                    };
                    for(let gKey in item.goods) {
                        let gObj = {
                            id: gKey,
                            ...item.goods[gKey]
                        }
                        orderObj.goods.push(gObj);
                    }
                    obj.orderList.push(orderObj);
                });
                Arr.push(obj);
            };
            this.rtOrder = Arr;
        }
    };
    // 展示详情
    showOrderDetail(record, index) {
        this.modifingOrder = record;
        this.detailIndex = index;
        this.visible = true;
    };
    // 换菜
    changeGoods(record, index) {
        
    }
    // 换桌
    changeTableNo(record) {
        this.modifingOrder = record;
        Modal.confirm({
            title: "请选择桌号",
            content: (
                <a-select class="table-no" defaultValue={record.tableNo} onChange={val => record.tableNo = val}>
                    {
                        this.tableNoList.map(item => {
                            return (
                                <a-select-option value={item}>{item}</a-select-option>
                            )
                        })
                    }
                </a-select>
            ),
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                console.log(record, "record")
                this.doModifyOrder(record, null, "tableNo")
            },
            onCancel() {}
        });
    };
    // 修改订单金额
    changePayment(record) {
        console.log(record)
        this.modifingOrder = record;
        let oldSum = record.payment;
        Modal.confirm({
            title: "请输入新的金额",
            content: (
                <InputNumber style="width: 250px;" defaultValue={Number(record.payment)} onChange={sum => record.payment = sum} />
            ),
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                if(oldSum === record.payment) {
                    message.warning("金额未改动");
                    return;
                }
                this.doModifyOrder(record, null, "payment")
            },
            onCancel() {}
        });
    };
    // 减少菜品数量
    minusGoodsCount(record, index) {
        Modal.confirm({
            title: "提示",
            content: "确定减少菜品数量么，数量为0将会从订单中删除这个菜品",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                this.doModifyOrder(record, index, "reduce")
            },
            onCancel() {}
        });
    }
    // 修改实时订单
    async doModifyOrder(record, index, type) {
        let param = {
            companyId: this.userInfo.id,
            orderNo: this.modifingOrder.orderNo,
        };
        switch(type){
            case "reduce":
                param.goods = {
                    goodsId: record.id,
                    type: "reduce",
                    index: index,
                    count: record.count > 0 ? record.count - 1 : 0
                };
                break;
            case "tableNo":
                param.tableNo = record.tableNo;
                break;
            case "payment":
                param.payment = record.payment;
                break;
        };
        let res = await modifyOrder(param);
        if(res.data.returnCode === 1) {
            message.success("操作成功！");
        } else {
            message.error(res.data.message);
        };
    };
	render() {
		return (
            <div class="category-page">
                <a-tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab="实时订单" key="1" style="height: 100%;">
                        <Table
                            rowKey={record => record.orderNo} 
                            dataSource={this.rtOrder}
                            pagination={false}
                            style="flex: 1;overflow-y:auto;"
                        >
                            {
                                tableColumns.map((item, index) => {
                                    return (
                                        <Column
                                            title={item.title}
                                            dataIndex={item.dataIndex}
                                            align="center"
                                            customRender={(text, record) => this.rtTableRenderFn(text, record, item)}
                                        />
                                    )
                                })
                            }
                            <Column
                                title="操作"
                                key="operation"
                                width={150}
                                align="center"
                                customRender={(text, record, index) => this.rtTableRenderFn(text, record, {key: "operation"}, index)}
                            />
                        </Table>
                    </TabPane>
                    <TabPane tab="订单管理" key="2" style="height: 100%;" forceRender>
                        <Table
                            rowKey={record => record.id} 
                            dataSource={this.ordersList}
                            pagination={false}
                            style="flex: 1;overflow-y:auto;"
                        >
                            {
                                tableColumns.map(item => {
                                    return (
                                        <Column
                                            title={item.title}
                                            dataIndex={item.dataIndex}
                                            align="center"
                                            customRender={(text, record, index) => this.tableRenderFn(text, record, item)}
                                        />
                                    )
                                })
                            }
                            <Column
                                title="操作"
                                key="operation"
                                width={100}
                                align="center"
                                customRender={(text, record, index) => this.tableRenderFn(text, record, {key: "operation"})}
                            />
                        </Table>
                        <div class="pagination-box">
                            <a-pagination defaultCurrent={1} total={this.total} onChange={this.handelPageChange} />
                        </div>
                    </TabPane>
                </a-tabs>
                <a-modal
                    title="订单详情"
                    v-model={this.visible}
                    width="80%"
                    bodyStyle={{height: "500px", overflowY: "scroll"}}
                >
                        {
                            this.rtOrder.length && this.rtOrder[this.detailIndex].orderList.map((ele, index) => {
                                return (
                                    <div>
                                        {
                                            index === 0 ? <p></p> : <p class="table-title">第{index}次加菜</p>
                                        }
                                        <Table
                                            rowKey={record => record.id} 
                                            dataSource={ele.goods}
                                            pagination={false}
                                            style="flex: 1;overflow-y:auto;"
                                        >
                                            {
                                                detailTableColumn.map((item, ind) => {
                                                    return (
                                                        <Column
                                                            title={item.title}
                                                            dataIndex={item.dataIndex}
                                                            align="center"
                                                            width={item.width}
                                                            customRender={(text, record) => this.rtTableDetailRenderFn(text, record, item, index)}
                                                        />
                                                    )
                                                })
                                            }
                                            <Column
                                                title="操作"
                                                key="operation"
                                                width={100}
                                                align="center"
                                                customRender={(text, record, index) => this.rtTableDetailRenderFn(text, record, {key: "operation"})}
                                            />
                                        </Table>
                                    </div>
                                )
                            })
                        }
                </a-modal>
            </div>
		);
    };
    mounted() {
        this.getRTOrder();
        this.queryRtOrdersList();
    };
}
</script>
<style lang="less" scoped>
    .category-page{
        width: 100%;
        flex: 1;
        background: #F5F5F5;
    }
    .btns-field{
        width: 100%;
        height: 100%;
    }
    .btns-layout{
        margin: 0 auto;
        width: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn{
            margin: 0 5px;
            width: 40px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 3px;
            cursor: pointer;
        }
        .ant-select{
            width: 90px;
        }
    }
    .edit-btn{
        color: #1890ff;
        border: 1px solid #1890ff;
    }
    p{
        margin: 0;
    }
    .table-no{ 
        margin: 10px auto;
        width: 200px;
    }
    .pagination-box{
        margin:10px auto;
        text-align: center;
    }
    .table-title{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e8e8e8;
    }
    .pop-btn{
        font-size: 16px;
        width: 20px;
        height: 20px;
        line-height: 16px;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
    }
    .btn-add{
        color: #1890ff;
        border: 1px solid #1890ff;
    }
    .btn-min{
        color: #ff4544;
        border: 1px solid #ff4544;
    }
</style>