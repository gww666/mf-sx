<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Table, Modal, Select, Input, message, Button, Pagination } from "ant-design-vue";
import formateDate from "../../utils/formateDate";
import { tableColumns } from "./datas";
import { getOrdersList, modifyTableNo } from "./axios";
// import io from "socket.io-client";
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
Vue.use(Pagination);
const { Column } = Table;

@Component
export default class OrdersManagement extends Vue {
    ordersList = [];
    tableNoList = ["1", "2", "3", "4", "5", "6", "7"];
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
    // 切换页码
    handelPageChange(pageNum) {
        this.pageNum = pageNum;
        this.queryGoodsList();
    };
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p>订单管理</p>
                </div>
                <Table 
                    rowKey={record => record.id} 
                    dataSource={this.ordersList}
                    pagination={false}
                    class="table"
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
                <div style="margin:10px auto;">
                    <a-pagination defaultCurrent={1} total={this.total} onChange={this.handelPageChange} />
                </div>
            </div>
		);
    };
    mounted() {
        this.queryOrdersList();
        socket.on("connect", () => {
            console.log("connect");
            if (info) {
                $(".id").innerHTML = info.nickname;
                socket.emit("create id", info);
            };
        });
    };
}
</script>
<style lang="less" scoped>
    .category-page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
    .table {
        flex: 1;
        overflow-y: scroll;
    }
    .table-no{
        margin: 10px auto;
        width: 200px;
    }
</style>