<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tag, Table, Modal, Select, Input, message, Button } from "ant-design-vue";
import { tableColumns } from "./datas";
import { getCategoryList, deleteCategory } from "./axios";
import { operateCategory } from "./operateCategory/axios";
import { formateDate } from "../../utils/formateDate";
Vue.use(Tag);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
const { Column } = Table;

@Component
export default class DishCategory extends Vue {
    time = 0;
    // 修改名称
    name = "";
    // 弹出框显示隐藏
    showModal= false;
    sortArr = [];
    // 列表数据
    categoryList = [];
    // 当前修改项
    changeNameRocord = {}
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    
    // 获取分类列表
    async queryCategoryList() {
        try {
            let res = await getCategoryList(this.userInfo.id);
            if (res.data.returnCode === 1) {
                this.categoryList = res.data.data.sort((a, b) => {
                    if (a.sort < b.sort) {
                        return -1;
                    }
                    if (a.sort > b.sort) {
                        return 1;
                    }
                    return 0;
                });
            } else {
                this.categoryList = [];
            };
        }catch(err) {
            console.log(err, "获取分类列表err");
        };
    };
    // 跳转新增
    goCreate() {
        this.$router.push({name: "operateCategory", query: {type: "create"}});
    };
    // 跳转编辑
    goEdit(record) {
        this.$router.push({name: "operateCategory", query: {params: JSON.stringify(record), type: "edit"}});
    };
    // 删除
    doDelete(record) {
        Modal.confirm({
            title: "提示",
            content: "确定删除这个分类么？",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                try {
                    let res = await deleteCategory(record.id);
                    if (res.data.returnCode === 1) {
                        message.success(res.data.message);
                        this.queryCategoryList();
                    } else {
                        message.error(res.data.message);
                        this.categoryList = [];
                    };
                }catch(err) {
                    console.log(err, "删除分类err");
                };
            },
            onCancel() {}
        });
    };
    // 修改分类名称
    showDialog(record) {
        this.name = record.name;
        this.showModal = true;
        this.changeNameRocord = record;
    }
    // 修改名称
    async doModifyName() {
        if (this.name) {
            // 修改名称
            let obj = {
                categoryId: this.changeNameRocord.id,
                name: this.name,
                sort: this.changeNameRocord.sort,
                state: this.changeNameRocord.state,
            };
            try {
                let res = await operateCategory(obj);
                if(res.data.returnCode === 1) {
                    for(let i = 0;i < this.categoryList.length;i++) {
                        if(this.changeNameRocord.id === this.categoryList[i].id) {
                            let newRecord = Object.assign(this.categoryList[i], obj);
                            this.categoryList.splice(i, 1, newRecord);
                            break;
                        }
                    }
                    this.showModal = false;
                } else {
                    message.error(res.data.message);
                }
            } catch (err) {
                console.log("修改排序err", err);
            };
        };
    }
    // 启用/停用
    async handleStatusChange(record) {
        let currentTime = new Date().getTime();
        if(currentTime - this.time < 301) {
            this.time = currentTime;
            return;
        };
        this.time = currentTime;
        // 修改状态
        let obj = {
            categoryId: record.id,
            name: record.name,
            sort: record.sort,
            state: record.state === 1 ? 2 : 1,
        };
        try {
            let res = await operateCategory(obj);
            if(res.data.returnCode === 1) {
                for(let i = 0;i < this.categoryList.length;i++) {
                    if(record.id === this.categoryList[i].id) {
                        let newRecord = Object.assign(this.categoryList[i], obj);
                        this.categoryList.splice(i, 1, newRecord);
                        break;
                    }
                }
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            console.log("修改状态err", err);
        };
    }
    // 更改排序
    async handleSortChange(val, record) {
        // 修改排序
        let obj = {
            categoryId: record.id,
            name: record.name,
            sort: val,
            state: record.state,
        };
        try {
            let res = await operateCategory(obj);
            if(res.data.returnCode === 1) {
                for(let i = 0;i < this.categoryList.length;i++) {
                    if(record.id === this.categoryList[i].id) {
                        let newRecord = Object.assign(this.categoryList[i], obj);
                        this.categoryList.splice(i, 1, newRecord);
                        break;
                    }
                }
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            console.log("修改排序err", err);
        };
    }
    // 列表渲染
    tableRenderFn(text, record, item) {
        switch (item.key) {
            case "createDate":
                text = formateDate(text);
                break;
            case "updateDate":
                text = formateDate(text);
                break;
        };
        let dom = <span>{text}</span>;
        // 操作按钮
        if (item.key === "name") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout" style="width: 130px;justify-content: flex-start">
                        <p class="btn modify-btn" onClick={() => this.showDialog(record, item)}>修改</p>
                        <p class="name" title={text}>{text}</p>
                    </div>
                </div>
            );
        } else if (item.key === "operation") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        <p class="btn delete-btn" onClick={() => this.doDelete(record)}>删除</p>
                    </div>
                </div>
            );
        } else if (item.key === "state") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        {
                            record.state === 2 ? <p class="btn delete-btn" style="width: 56px;" onClick={() => this.handleStatusChange(record)}>已下架</p> : ""
                        }
                        {
                            record.state === 1 ? <p class="btn edit-btn" style="width: 56px;" onClick={() => this.handleStatusChange(record)}>已上架</p> : ""
                        }
                    </div>
                </div>
            )
        } else if (item.key === "sort") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        <a-select onChange={value => this.handleSortChange(value, record)} defaultValue={text}>
                            {
                                this.sortArr.map((ele, index) => {
                                    return (
                                        <a-select-option value={index + 1}>{index + 1}</a-select-option>
                                    )
                                })
                            }
                        </a-select>
                    </div>
                </div>
            )
        };
        return dom;
    };
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p>商品分类</p>
                    <p class="createBtn">
                        <span onClick={this.goCreate}>添加分类</span>
                        <a-button style="margin-left: 10px;" size="small" type="primary" onClick={this.queryCategoryList}>刷新</a-button>
                    </p>
                </div>
                <Table 
                    rowKey={record => record.id} 
                    dataSource={this.categoryList}
                    locale={{emptyText: '暂无数据'}}
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
                                    customCell={(record) => {
                                        return {
                                            on: { // 事件
                                                click: () => {console.log(record)}
                                            }
                                        }
                                    }}
                                />
                            )
                        })
                    }
                    <Column
                        title="状态"
                        key="state"  
                        align="center"
                        customRender={(text, record, index) => this.tableRenderFn(text, record, {key: "state"})}
                    />
                    <Column
                        title="操作"
                        key="operation"  
                        align="center"
                        customRender={(text, record, index) => this.tableRenderFn(text, record, {key: "operation"})}
                    />
                </Table>
                <a-modal
                    title="修改分类名"
                    v-model={this.showModal}
                    onOk={this.doModifyName}
                    width="400px"
                    okText="确认"
                    cancelText="取消"
                >
                    <a-input v-model={this.name} style="width: 200px;" placeholder="请输入分类名称" />
                </a-modal>
            </div>
		);
    };
    mounted() {
        for(let i = 0;i < 100; i++) {
            this.sortArr.push(i);
        }
        this.queryCategoryList();
    };
}
</script>
<style lang="less" scoped>
    .category-page{
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
        color: #1890ff;
        cursor: pointer;
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
    .name{
        line-height: 22px;
        max-width: 80px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    p{
        margin: 0;
    }
</style>