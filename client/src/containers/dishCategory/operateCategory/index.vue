<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, message } from "ant-design-vue";
import { operateCategory } from "./axios";
Vue.use(Input);
Vue.use(Button);

@Component
export default class operateDish extends Vue {
    categoryInfo = {
        name: "",
        sort: ""
    };
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 点击确定
    async doSave() {
        if(this.userInfo.id) {
            let obj = {};
            // 新增
            obj = {
                companyId: this.userInfo.id,
                name: this.categoryInfo.name,
                sort: this.categoryInfo.sort
            };
            try {
                let res = await operateCategory(obj);
                if(res.data.returnCode === 1) {
                    message.success("新增分类成功");
                    this.$router.replace({name: "dishCategory"});
                };
            }catch(err) {
                console.log("新增/编辑分类err", err);
            };
        };
    };
    // 点击取消
    doCancel() {
        this.$router.go(-1);
    };
	render() {
		return (
            <div class="operate-dish">
                <div class="title-bar">
                    <p class="title">新增分类</p>
                    <div class="operate-area">
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 分类名称：</p>
                            <a-input v-model={this.categoryInfo.name} placeholder="请输入分类名称" />
                        </div>
                        <div class="lines">
                            <p><span class="required-symbol">*</span> 排序：</p>
                            <a-input v-model={this.categoryInfo.sort} placeholder="请输入1-100的值用以排序，数字越小代表越靠前" />
                        </div>
                        <div class="btns-box">
                            <a-button type="primary" onClick={this.doSave}>保存</a-button>
                            <a-button onClick={this.doCancel}>取消</a-button>
                        </div>
                    </div>
                </div>
            </div>
		);
    };
    mounted() {}
}
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
            width: 200px;
            height: 100%;
            line-height: 50px;
            padding-right: 20px;
            text-align: right;
            .required-symbol{
                color: #ff4544;
            }
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