<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tabs, Table, Modal, Select, Input, message, Button, Pagination } from "ant-design-vue";
import formateDate from "../../utils/formateDate";
import { tableColumns, detailTableColumn } from "./datas";
import { getOrdersList, modifyTableNo } from "./axios";
<<<<<<< HEAD
Vue.use(Tabs);
=======
// import io from "socket.io-client";
>>>>>>> ffbd3c66004757d059b6ca568daef94b66d072bd
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
Vue.use(Pagination);
const { Column } = Table;
const { TabPane } = Tabs;

@Component
export default class OrdersManagement extends Vue {
    visible = false;
    tableNoList = ["1", "2", "3", "4", "5", "6", "7"];
    // 订单列表
    ordersList = [];
    // 实时订单列表
    rtOrder = [];
    // 详情列表
    detailList = [];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 获取订单列表
    async queryOrdersList() {
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
    // 换桌
    changeTableNo(record) {
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
                try {
                    let res = await modifyTableNo(record);
                    if(res.data.returnCode === 1) {
                        message.success("换桌成功");
                        this.queryOrdersList();
                    }else {
                        message.warning("换桌失败");
                    };
                }catch(err) {
                    console.log(err, "删除分类err");
                };
            },
            onCancel() {}
        });
    };
    // 实时列表渲染
    rtTableRenderFn(text, record, item) {
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
                        <p class="btn edit-btn" onClick={() => this.showOrderDetail(Object.assign({}, record))}>详情</p>
                    </div>
                </div>
            );
        };
        return dom;
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
    // 展示详情
    showOrderDetail(record) {
        console.log(record, 'record');
        this.detailList = record.orderList || [];
        this.visible = true;
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
        this.rtOrder = [{
            orderNo: "121315467843526",
            payment: 15.60,
            tableNo: 2,
            createDate: "2019-06-22 17:53:50",
            updateDate: "2019-06-22 17:53:50",
            orderList: [
                {
                    createDate: "2019-06-22 18:20:08",
                    updateDate: "2019-06-22 18:20:08",
                    goods: [
                        {count: 1, price: 15.00, title: "炒鸡蛋"},
                        {count: 1, price: 15.00, title: "炒鸭蛋"},
                        {count: 1, price: 15.00, title: "炒鹅蛋"},
                    ]
                },
                {
                    createDate: "2019-06-22 18:20:08",
                    updateDate: "2019-06-22 18:20:08",
                    goods: [
                        {count: 1, price: 15.00, title: "炒鸡蛋"},
                        {count: 1, price: 15.00, title: "炒鸭蛋"},
                        {count: 1, price: 15.00, title: "炒鹅蛋"},
                    ]
                },
                {
                    createDate: "2019-06-22 18:20:08",
                    updateDate: "2019-06-22 18:20:08",
                    goods: [
                        {count: 1, price: 15.00, title: "炒鸡蛋"},
                        {count: 1, price: 15.00, title: "炒鸭蛋"},
                        {count: 1, price: 15.00, title: "炒鹅蛋"},
                    ]
                }
            ]
        }];
    };
    // 弹窗确定按钮
    handleOk() {

    };
	render() {
		return (
            <div class="category-page">
                <a-tabs defaultActiveKey="1" onChange={this.handleTabChange} class="tabs-container">
                    <TabPane tab="实时订单" key="1" style="height: 100%;">
                        <Table
                            rowKey={record => record.id} 
                            dataSource={this.rtOrder}
                            pagination={false}
                            style="flex: 1;overflow-y:auto;"
                        >
                            {
                                tableColumns.map(item => {
                                    return (
                                        <Column
                                            title={item.title}
                                            dataIndex={item.dataIndex}
                                            key={item.key}
                                            align="center"
                                            customRender={(text, record, index) => this.rtTableRenderFn(text, record, item)}
                                        />
                                    )
                                })
                            }
                            <Column
                                title="操作"
                                key="operation"
                                width={150}
                                align="center"
                                customRender={(text, record, index) => this.rtTableRenderFn(text, record, {key: "operation"})}
                            />
                        </Table>
                        <div class="pagination-box">
                            <a-pagination defaultCurrent={1} total={this.total} onChange={this.handelPageChange} />
                        </div>
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
                                            key={item.key}
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
                    onOk={this.handleOk}
                    width="80%"
                    style="height: 80%;"
                >
                        {
                            this.detailList.map((ele, index) => {
                                return (
                                    <div>
                                        {
                                            index === 0 ? <p class="table-title"></p> : <p class="table-title">第{index}次加菜</p>
                                        }
                                        <Table
                                            rowKey={record => record.id} 
                                            dataSource={ele.goods}
                                            pagination={false}
                                            style="flex: 1;overflow-y:auto;"
                                        >
                                            {
                                                detailTableColumn.map(item => {
                                                    return (
                                                        <Column
                                                            title={item.title}
                                                            dataIndex={item.dataIndex}
                                                            key={item.key}
                                                            align="center"
                                                            customRender={(text, record, index) => this.rtTableRenderFn(text, record, item)}
                                                        />
                                                    )
                                                })
                                            }
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
        // socket.on("connect", () => {
        //     console.log("connect");
        //     if (info) {
        //         $(".id").innerHTML = info.nickname;
        //         socket.emit("create id", info);
        //     };
        // });
    };
}
</script>
<style lang="less" scoped>
    .category-page{
        width: 100%;
        flex: 1;
        background: #F5F5F5;
    }
    .title-bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    .createBtn{
        width: 115px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #1890ff;
        cursor: pointer;
    }
    .searcher{
        width: 205px;
    }
    .edit-btn{
        color: #1890ff;
        border: 1px solid #1890ff;
    }
    .delete-btn{
        color: #ff4544;
        border: 1px solid #ff4544;
    }
    .modify-btn{
        background: #1890ff;
        color: #FFF;
        margin-right: 10px;
    }
    p{
        margin: 0;
    }
    .table-no{
        margin: 10px auto;
        width: 200px;
    }
    .tabs-container{
        height: 100%;
        overflow-y: auto;
    }
    .pagination-box{
        margin:10px auto;
        text-align: center;
    }
</style>