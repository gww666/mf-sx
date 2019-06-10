<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, Select, InputNumber, message } from "ant-design-vue";
import { operateGoods, uploadImg } from "./axios";
import { getCategoryList, getGoodsInfoById } from "../axios";
import imageX from "image-sx";
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(InputNumber);

@Component({
    components: {
        imageX
    }
})
export default class DishCategory extends Vue {
    dishInfo = {
        categoryId: undefined,
        title: "",
        subTitle: "",
        state: 1,
        price: 0,
        salePrice: 0,
        stock: 0
    };
    imageList = [];
    // 分类列表列表
    categoryList = [];
    sortArr = [];
    timer = [];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
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
                }else {
                    this.categoryList = [];
                };
            } else {
                this.categoryList = [];
            };
        }catch(err) {
            console.log(err, "获取分类列表err");
        };
    };
    // 点击确定
    async doSave(srcStr) {
        if(this.userInfo.id) {
            let obj = Object.assign({companyId: this.userInfo.id}, this.dishInfo);
            obj.images = srcStr || "";
            try {
                let res = await operateGoods(obj);
                if(res.data.returnCode === 1) {
                    message.success(res.data.message);
                    this.$router.replace({name: "dishManagement"});
                } else {
                    message.error(res.data.message);
                };
            }catch(err) {
                console.log("新增/编辑商品err", err);
            };
        };
    };
    // 修改分类搜索条件
    changeCategory(val) {
        this.dishInfo.categoryId = val;
    };
    // 编辑回显
    async queryGoodsInfo (id) {
        try {
            let res = await getGoodsInfoById(id);
            if (res.data.returnCode === 1) {
                let data = res.data.data[0];
                for(let key in  this.dishInfo) {
                    this.dishInfo[key] = data[key];
                };
                this.dishInfo.goodsId = data.id;
            };
        } catch (err) {
            console.log("编辑回显err", err)
        }
    };
    // 点击取消
    doCancel() {
        this.$router.go(-1);
    };
    // 上传图片事件处理
    async handleFileChange(files) {
        console.log(files ,'envjldkfjkld');
        this.imageList = files;
    };
    doUpload() {
        let arr = [];
        this.imageList.forEach(ele => {
            arr.push(new Promise((reslove, reject) => {
                let formData = new FormData();
                formData.append("type", "image");
                formData.append("md5", ele.md5);
                formData.append("project", "mf");
                formData.append("file", ele);
                uploadImg(formData).then(res => {
                    reslove(res);
                });
            }));
        });
        Promise.all(arr).then(values => {
            let srcStr = "";
            values.forEach(item => {
               srcStr += `${item.data.data[0]},`;
            });
            srcStr = srcStr.substr(0, srcStr.length - 1);
            this.doSave(srcStr);
        });
        // try {
        //     let res = await uploadImg(formData);
        //     console.log(res, "ressssss")
        // }catch (err) {
        //     console.log("上传err: ", err);
        // };
    }
	render() {
		return (
            <div class="operate-dish">
                <div class="title-bar">
                    <p class="title">新增菜品</p>
                    <div class="operate-area">
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 所属分类：</p>
                            <a-select class="inputs" placeholder="请选择菜品所属分类" v-model={this.dishInfo.categoryId} onChange={val => this.changeCategory(val)} >
                                {
                                    this.categoryList.map((ele, index) => {
                                        return (
                                            <a-select-option value={ele.id}>{ele.name}</a-select-option>
                                        )
                                    })
                                }
                            </a-select>
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 标题：</p>
                            <a-input class="inputs" v-model={this.dishInfo.title} maxLength={20} placeholder="请输入菜品标题" />
                        </div>
                        <image-x onFileChange={this.handleFileChange} mode="preview"></image-x>
                        <div class="lines">
                            <p> 副标题：</p>
                            <a-input class="inputs" v-model={this.dishInfo.subTitle} maxLength={50} placeholder="请输入菜品副标题" />
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 状态：</p>
                            <a-select class="inputs" v-model={this.dishInfo.state}>
                                <a-select-option value={1}>上架</a-select-option>
                                <a-select-option value={0}>下架</a-select-option>
                            </a-select>
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 价格：</p>
                            <a-input-number class="inputs" min={0} v-model={this.dishInfo.price} placeholder="请输入菜品价格" />
                        </div>
                        <div class="lines">
                            <p> 特价：</p>
                            <a-input-number class="inputs" min={0} v-model={this.dishInfo.salePrice} placeholder="请输入菜品特价" />
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 库存：</p>
                            <a-input-number class="inputs" min={0} max={9999} v-model={this.dishInfo.stock} placeholder="请输入菜品库存" />
                        </div>
                        <div class="btns-box">
                            <a-button type="primary" onClick={this.doUpload}>保存</a-button>
                            <a-button onClick={this.doCancel}>取消</a-button>
                        </div>
                    </div>
                </div>
            </div>
		);
    };
    mounted() {
        for(let i = 0;i < 100; i++) {
            this.sortArr.push(i);
        };
        let query = this.$route.query || {};
        if (query.type === "edit") {
            this.pageType = "edit";
            this.queryGoodsInfo(query.id);
        } else {
            this.pageType = "create";
        };
        this.queryCategoryList();
    };
};
</script>
<style lang="less" scoped>
    .operate-dish{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
    }
    .title-bar{
        width: 100%;
        height: 50px;
    }
    .title{
        margin: 0;
        height: 100%;
        line-height: 50px;
    }
    .operate-area{
        width: 600px;
        margin-left: 180px;
    }
    .lines{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
            margin: 0;
            width: 100px;
            height: 100%;
            line-height: 50px;
            padding-right: 20px;
            text-align: right;
            .required-symbol{
                color: #ff4544;
            }
        }
        .inputs{
            flex: 1;
        }
    }
    .btns-box{
        width: 150px;
        margin: 40px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>