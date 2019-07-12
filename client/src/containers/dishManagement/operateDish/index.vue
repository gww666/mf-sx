<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, Select, InputNumber, Radio, message } from "ant-design-vue";
import { operateGoods, uploadImg } from "./axios";
import { getCategoryList, getGoodsInfoById } from "../axios";
import imageX, { compress } from "image-sx";
Vue.use(Input);
Vue.use(Radio);
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
        images: "",
        state: 1,
        price: 0,
        salePrice: 0,
        stock: 0,
        thumbnail: ""
    };
    imageList = [];
    previousImgs = [];
    goodsIcon = [];
    // 分类列表列表
    categoryList = [];
    sortArr = [];
    timer = [];
    // 
    applyPublicTag = 0;
    applyPrivateTag = 0;
    // 新增tag中的文字
    newTag = "";
    // 添加的tag
    addonTags = [];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 获取分类列表
    async queryCategoryList() {
        if (this.$route.query.categoryList) {
            this.categoryList = JSON.parse(this.$route.query.categoryList);
        } else {
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
    };
    // 点击确定
    async doSave(srcStr, thumbnail) {
        if(this.userInfo.id) {
            let obj = Object.assign({companyId: this.userInfo.id}, this.dishInfo);
            if (srcStr) {
                obj.images = srcStr;
            };
            
            if(this.addonTags.length && this.applyPrivateTag) {
                obj.tag = "";
                this.addonTags.forEach(item => {
                    obj.tag += `${item},`
                });
                obj.tag = obj.tag.substr(0, obj.tag.length - 1);
            }
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
    async queryGoodsInfo (data) {
        for(let key in  this.dishInfo) {
            this.dishInfo[key] = data[key];
        };
        if (data.images.length) {
            let imgs = data.images.split(",");
            for (let i = 0; i < imgs.length; i++) {
                imgs[i] = `${api.base}${imgs[i]}`;
            };
            this.previousImgs = imgs;
        };
        if(data.tag) {
            this.applyPrivateTag = 1;
            this.addonTags = data.tag.split(",")
        }
        this.dishInfo.goodsId = data.id;
    };
    // 点击取消
    doCancel() {
        this.$router.go(-1);
    };
    // 上传图片事件处理
    async handleFileChange(files) {
        this.imageList = files;
    };
    // 缩略图
    handleFileChange2(files, fromPic) {
        this.goodsIcon = files;
    };
    createPromise(ele) {
        return new Promise((reslove, reject) => {
            let formData = new FormData();
            formData.append("type", "image");
            formData.append("md5", ele.md5);
            formData.append("project", "mf");
            formData.append("file", ele);
            uploadImg(formData).then(res => {
                reslove(res);
            });
        });
    };
    async compressIcon(image) {
        if (image.size > 50 * 1024) {
            let comp = new compress(image, {
                quality: 0.4,
                maxWidth: 150,
                maxHeight: 150
            });
            let originBlob = await comp.compress();
            return new Promise((reslove, reject) => {
                let formData = new FormData();
                formData.append("type", "image");
                formData.append("md5", originBlob.md5);
                formData.append("project", "mf");
                formData.append("file", originBlob);
                uploadImg(formData).then(res => {
                    reslove(res);
                });
            });
        } else {
            console.log("----------------------------------------")
        }
    };
    async doUpload() {
        if (this.imageList.length || this.previousImgs.length || this.goodsIcon.length) {
            let arr = [];
            // 上传了缩略图
            if (this.goodsIcon.length) {
                try {
                    let res = await this.compressIcon(this.goodsIcon[0]);
                    if(res) {
                        if (res.data.returnCode === 1) {
                            this.dishInfo.thumbnail = res.data.data[0];
                        };
                    }else {
                        let res = await this.createPromise(this.goodsIcon[0]);
                        this.dishInfo.thumbnail = res.data.data[0];
                    };
                } catch (err) {
                    console.log("缩略图上传err", err);
                };
            };
            // 没有缩略图
            if (!this.dishInfo.thumbnail) {
                try {
                    let res = await this.compressIcon(this.imageList[0]);
                    if(res) {
                        if (res.data.returnCode === 1) {
                            this.dishInfo.thumbnail = res.data.data[0];
                        };
                    }else {
                        let res = await this.createPromise(this.imageList[0]);
                        this.dishInfo.thumbnail = res.data.data[0];
                    };
                } catch (err) {
                    console.log("缩略图上传err", err);
                };
            };
            this.imageList.forEach(ele => {
                arr.push(this.createPromise(ele));
            });
            Promise.all(arr).then(values => {
                let srcStr = "";
                // 拼接图片字符串
                this.previousImgs.forEach(item => {
                    srcStr += `${item.split(api.base)[1]},`;
                });
                values.forEach(item => {
                    srcStr += `${item.data.data[0]},`;
                });
                srcStr = srcStr.substr(0, srcStr.length - 1);
                this.doSave(srcStr);
            });
        } else {
            this.doSave();
        };
    };
    publicRadioChange(val) {
        this.applyPublicTag = val.target.value;
    };
    privateRadioChange(val) {
        this.applyPrivateTag = val.target.value;
    };
    // 增加标签
    addTag() {
        let sameTag = false;
        this.addonTags.forEach(item => {
            if(item === this.newTag) {
                message.warning("已有相同标签");
                sameTag = true;
            }
        });
        if(sameTag || !this.newTag) return;
        this.addonTags.push(this.newTag);
        this.newTag = "";
    };
    // 删除标签
    deleteTag(tag) {
        for(let i = 0;i < this.addonTags.length;i++) {
            if(this.addonTags[i] === tag) {
                this.addonTags.splice(i, 1);
                break;
            }
        }
    };
    // 是否有备注radio
    radioChange() {
        console.log("radio changed")
    }
	render() {
		return (
            <div class="operate-dish">
                <div class="title-bar">
                    <p class="title">{this.pageType === "create" ? "新增菜品" : "编辑菜品"}</p>
                    <div class="operate-area">
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 所属分类：</p>
                            <a-select class="inputs" placeholder="请选择菜品所属分类" v-model={this.dishInfo.categoryId} onChange={val => this.changeCategory(val)} >
                                {
                                    this.categoryList.map((ele, index) => {
                                        return (
                                            <a-select-option value={ele.id}>{ele.name}</a-select-option>
                                        );
                                    })
                                }
                            </a-select>
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 标题：</p>
                            <a-input class="inputs" v-model={this.dishInfo.title} maxLength={20} placeholder="请输入菜品标题" />
                        </div>
                        <div class="lines images">
                            <p> 图片：</p>
                            <image-x onFileChange={this.handleFileChange} imgUrls={this.previousImgs} mode="preview"></image-x>
                        </div>
                        <div class="lines images">
                            <p> 缩略图：</p>
                            <image-x onFileChange={this.handleFileChange2} maxCount={1} imgUrls={this.dishInfo.thumbnail ? [`${api.base + this.dishInfo.thumbnail}`] : []} mode="preview"></image-x>
                        </div>
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
                        <div class="lines">
                            <p> 备注标签：</p>
                            <div style="display: flex;">
                                <div class="lines">
                                    <p style="width: 140px;text-align: center;">是否应用通用标签</p>
                                    <Radio.Group onChange={value => {this.publicRadioChange(value)}} value={this.applyPublicTag}>
                                        <Radio value={0}>否</Radio>
                                        <Radio value={1}>是</Radio>
                                    </Radio.Group>
                                </div>
                                <div class="lines">
                                    <p style="width: 140px;text-align: center;">是否应用私有标签</p>
                                    <Radio.Group onChange={value=> {this.privateRadioChange(value)}} value={this.applyPrivateTag}>
                                        <Radio value={0}>否</Radio>
                                        <Radio value={1}>是</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                        {
                            this.applyPrivateTag
                            ?
                            <div class="saved-tags">
                                {
                                    this.addonTags.length?
                                    this.addonTags.map(ele => {
                                        return (
                                            <div class="tags" title={ele}>
                                                <div class="tag-delete" onClick={() => {this.deleteTag(ele)}}>×</div>
                                                {ele}
                                            </div>
                                        )
                                    })
                                    :
                                    <div class="tag-tip">请添加标签</div>
                                }
                            </div>
                            :
                            <div></div>
                        }
                        {
                            this.applyPrivateTag
                            ?
                            <div class="create-tag">
                                <Input v-model={this.newTag} placeholder="请输入要新增的公共标签，建议2~4个字" style="width: 250px;" />
                                <Button type="primary" onClick={this.addTag}>添加</Button>
                            </div>
                            :
                            <div></div>
                        }
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
            let params = JSON.parse(this.$route.query.params);
            this.queryGoodsInfo(params);
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
        overflow-y: auto;
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
    .images{
        height: 110px;
        justify-content: flex-start;
        p{
            line-height: 100px;
        }
    }
    .btns-box{
        width: 150px;
        margin: 40px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .saved-tags{
        width: 100%;
        overflow: auto;
        .tags{
            float: left;
            min-width: 100px;
            max-width: 200px;
            min-height: 40px;
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
        .tag-tip{
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 40px;
            color: #757575;
        }
    }
    .create-tag{
        width: 360px;
        margin: 10px auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>