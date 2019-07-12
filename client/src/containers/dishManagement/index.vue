<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tag, Table, Modal, Select, Input, message, Button, Pagination } from "ant-design-vue";
import { tableColumns } from "./datas";
import { getCategoryList, queryGoodsList, deleteGoods, searchGoods, getGoodsInfoById, getPublicTags, savePublicTags } from "./axios";
import { operateGoods } from "./operateDish/axios";
import { formateDate } from "../../utils/formateDate";
Vue.use(Tag);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
Vue.use(Pagination);
const { Column } = Table;

@Component
export default class DishCategory extends Vue {
    time = 0;
    timer = null;
    // 搜索联想列表
    similarItemList = [];
    // 搜索条件
    keyword = "";
    sortArr = [];
    // 分类列表列表
    categoryList = [];
    currentCategory = "";
    // 列表数据
    goodsList = [];
    pageNum = 1;
    pageSize = 10;
    total = 0;
    newTag = "";
    // 备注信息
    tagInfo = {};
    previousPublicTags = [];
    publicTags = [];
    // 设置通用备注
    memoModal = false;
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 获取通用备注
    async queryPublicTags() {
        try {
            let res = await getPublicTags(this.userInfo.id);
            if (res.data.returnCode === 1) {
                let data = res.data.data[0];
                if(data) {
                    this.tagInfo = res.data.data[0];
                    this.publicTags = res.data.data[0].tag.split(",");
                    this.previousPublicTags = res.data.data[0].tag.split(",");
                }
            }
        }catch (err) {
            console.log(err, "获取通用备注err");
        }
    };
    // 更新通用备注
    async updatePublicTags() {
        try {
            if(!this.publicTags.length) {
                message.warning("请添加备注");
                return;
            }
            let params = {
                companyId: this.userInfo.id,
                tag: ""
            }
            if(this.tagInfo.id) {
                params.id = this.tagInfo.id;
            }
            this.publicTags.forEach(item => {
                params.tag += `${item},`
            });
            params.tag = params.tag.substr(0, params.tag.length - 1);

            let res = await savePublicTags(params);
            if (res.data.returnCode === 1) {
                this.queryPublicTags();
                this.memoModal = false;
            }
        }catch (err) {
            console.log(err, "更新通用备注err");
        }
    };
    // 获取分类列表
    async queryCategoryList() {
        try {
            let res = await getCategoryList(this.userInfo.id);
            if (res.data.returnCode === 1) {
                if(res.data.data.length > 0) {
                    this.categoryList = res.data.data.sort((a, b) => {
                        if (a.sort < b.sort) {
                            return -1;
                        }
                        if (a.sort > b.sort) {
                            return 1;
                        }
                        return 0;
                    });
                    this.categoryList.unshift({
                        name: "全部分类",
                        id: "all"
                    });
                    this.currentCategory = this.categoryList[0].id;
                    // 获取商品列表
                    this.queryGoodsList();
                }else {
                    this.categoryList = [];
                };
            } else {
                this.categoryList = [];
            };
        }catch (err) {
            console.log(err, "获取分类列表err");
        };
    };
    // 获取商品列表
    async queryGoodsList() {
        try {
            let res = await queryGoodsList(this.userInfo.id, this.currentCategory, this.pageNum, this.pageSize);
            if (res.data.returnCode === 1) {
                if(res.data.data.length > 0) {
                    this.goodsList = res.data.data.sort((a, b) => {
                        if (a.sort < b.sort) {
                            return -1;
                        };
                        if (a.sort > b.sort) {
                            return 1;
                        };
                        return 0;
                    });
                    this.total = res.data.total;
                } else {
                    this.goodsList = [];
                };
            } else {
                this.goodsList = [];
            };
        }catch(err) {
            console.log(err, "获取分类列表err");
        };
    };
    // 修改分类搜索条件
    changeCategory(val) {
        this.currentCategory = val;
        this.queryGoodsList();
    };
    // 搜索
    async doSearch() {
        if (!this.keyword) {
            message.warning("请输入查询内容");
            return;
        };
        try {
            let res = await getGoodsInfoById(this.keyword);
            if (res.data.returnCode === 1) {
                if(res.data.data.length > 0) {
                    this.goodsList = res.data.data;
                } else {
                    this.goodsList = [];
                };
            } else {
                this.goodsList = [];
            };
        }catch(err) {
            console.log(err, "搜索err");
        };
    };
    // 搜索相似内容
    handleSearch (clue) {
        if(this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        };
        this.timer = setTimeout(async () => {
            try {
                let res = await searchGoods(clue);
                if (res.data.returnCode === 1) {
                    if(res.data.data.length > 0) {
                        this.similarItemList = res.data.data;
                    } else {
                        this.similarItemList = [];
                    };
                } else {
                    this.similarItemList = [];
                };
            }catch(err) {
                console.log(err, "获取相似内容列表err");
            };
        }, 300);
    };
    // 选中相似内容
    handleChange (clue) {
        this.keyword = clue;
    };
    // 跳转新增
    goCreate() {
        this.$router.push({name: "operateDish", query: {categoryList: JSON.stringify(this.categoryList), type: "create"}});
    };
    // 跳转编辑
    goEdit(record) {
        this.$router.push({name: "operateDish", query: {params: JSON.stringify(record), categoryList: JSON.stringify(this.categoryList), type: "edit"}});
    };
    // 删除
    doDelete(record) {
        Modal.confirm({
            title: "提示",
            content: "确定删除这个菜品么？",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                try {
                    let res = await deleteGoods(record.id);
                    if (res.data.returnCode === 1) {
                        message.success(res.data.message);
                        this.queryGoodsList();
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
    // 启用/停用
    async handleStatusChange(record) {
        let currentTime = new Date().getTime();
        if(currentTime - this.time < 301) {
            this.time = currentTime;
            return;
        };
        this.time = currentTime;
        
        // 修改状态
        let obj = Object.assign({}, record);
        delete obj.createDate;
        delete obj.updateDate;
        obj.state === 1 ? obj.state = 0 : obj.state = 1;

        try {
            let res = await operateGoods(obj);
            if(res.data.returnCode === 1) {
                for(let i = 0;i < this.goodsList.length;i++) {
                    if(record.id === this.goodsList[i].id) {
                        let newRecord = Object.assign(this.goodsList[i], obj);
                        this.goodsList.splice(i, 1, newRecord);
                        break;
                    };
                };
            } else {
                message.error(res.data.message);
            };
        } catch (err) {
            console.log("修改状态err", err);
        };
    };
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
        if (item.key === "operation") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        <p class="btn edit-btn" onClick={() => this.goEdit(record)}>编辑</p>
                        <p class="btn delete-btn" onClick={() => this.doDelete(record)}>删除</p>
                    </div>
                </div>
            );
        } else if (item.key === "state") {
            dom = (
                <div class="btns-field">
                    <div class="btns-layout">
                        {
                            record.state === 0 ? <p class="btn delete-btn" style="width: 56px;" onClick={() => this.handleStatusChange(record)}>已下架</p> : ""
                        }
                        {
                            record.state === 1 ? <p class="btn edit-btn" style="width: 56px;" onClick={() => this.handleStatusChange(record)}>已上架</p> : ""
                        }
                    </div>
                </div>
            );
        } else if (item.key === "mainImg") {
            dom = text ?　(
                <img src={`${api.base}${text}`} style="width: 50px;" />
            ) : "";
        };
        return dom;
    };
    // 切换页码
    handelPageChange(pageNum) {
        this.pageNum = pageNum;
        this.queryGoodsList();
    };
    // 设置通用配置
    memoSetting() {
        this.publicTags = this.previousPublicTags;
        this.memoModal = true;
    };
    // 新增公共标签
    addTag() {
        let sameTag = false;
        this.publicTags.forEach(item => {
            if(item === this.newTag) {
                message.warning("已有相同标签");
                sameTag = true;
            }
        });
        if(sameTag || !this.newTag) return;
        this.publicTags.push(this.newTag);
        this.newTag = "";
    };
    // 删除公共标签
    deleteTag(tag) {
        for(let i = 0;i < this.publicTags.length;i++) {
            if(this.publicTags[i] === tag) {
                this.publicTags.splice(i, 1);
                break;
            }
        }
    };
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p>菜品管理</p>
                </div>
                <div class="title-bar">
                    <a-select class="filters" value={this.currentCategory} onChange={val => this.changeCategory(val)}>
                        {
                            this.categoryList.map((ele, index) => {
                                return (
                                    <a-select-option value={ele.id}>{ele.name}</a-select-option>
                                )
                            })
                        }
                    </a-select>
                    <p class="createBtn searcher">
                        <a-select
                            size="small"
                            showSearch
                            placeholder="请输入关键字查询"
                            style="width: 150px;"
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={clue => this.handleSearch(clue)}
                            onChange={clue => this.handleChange(clue)}
                            notFoundContent={null}
                        >
                            {
                                this.similarItemList.map(item => {
                                    return (
                                        <a-select-option value={item.id}>{item.title}</a-select-option>
                                    );
                                })
                            }
                        </a-select>
                        <a-button size="small" type="primary" onClick={this.doSearch}>搜索</a-button>
                        <p class="addBtn" onClick={this.goCreate}>添加菜品</p>
                        <p class="addBtn" style="width: 96px;" onClick={this.memoSetting}>配置通用备注</p>
                    </p>
                </div>
                <Table 
                    rowKey={record => record.id} 
                    dataSource={this.goodsList}
                    pagination={false}
                    locale={{emptyText: '暂无数据'}}
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
                        width={100}
                        customRender={(text, record, index) => this.tableRenderFn(text, record, {key: "state"})}
                    />
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
                <a-modal
                    title="配置通用备注"
                    centered={true}
                    v-model={this.memoModal}
                    width="60%"
                    bodyStyle={{height: "350px", overflowY: "scroll"}}
                >
                    <div class="tags-content">
                        <div class="saved-tags">
                            {
                                this.publicTags.map(ele => {
                                    return (
                                        <div class="tags" title={ele}>
                                            <div class="tag-delete" onClick={() => {this.deleteTag(ele)}}>×</div>
                                            {ele}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div class="create-tag">
                            <Input v-model={this.newTag} placeholder="请输入要新增的公共标签，建议2~4个字" style="width: 280px;" />
                            <Button type="primary" onClick={this.addTag}>添加</Button>
                        </div>
                    </div>
                    <div slot="footer" style="text-align:center;">
                        <Button type="primary" class="ant-btn ant-btn-default" onClick={() => {this.updatePublicTags()}}><span>保 存</span></Button>
                        <Button type="default" class="ant-btn ant-btn-default" onClick={() => {this.memoModal = false;}}><span>取 消</span></Button>
                    </div>
                </a-modal>
            </div>
		);
    };
    mounted() {
        for(let i = 0;i < 100; i++) {
            this.sortArr.push(i);
        };
        if(this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        };
        this.queryCategoryList();
        this.queryPublicTags();
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
        width: 380px;
    }
    .edit-btn{
        color: #1890ff;
        border: 1px solid #1890ff;
    }
    .delete-btn{
        color: #ff4544;
        border: 1px solid #ff4544;
    }
    .addBtn{
        width: 60px;
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

    .filters{
        width: 100px;
    }
    .table {
        flex: 1;
        overflow-y: scroll;
    }
    .saved-tags{
        width: 100%;
        height: 200px;
        overflow: auto;
        .tags{
            float: left;
            min-width: 100px;
            max-width: 200px;
            height: 40px;
            padding: 8px 10px;
            margin: 5px 5px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #d9d9d9;
            position: relative;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            .tag-delete{
                font-size: 16px;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 12px;
                border-radius: 8px;
                position: absolute;
                right: 4px;
                top: 2px;
                border: 1px solid #ff4544;
                color: #ff4544;
                cursor: pointer;
            }
        }
    }
    .create-tag{
        width: 360px;
        margin: 30px auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>