<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Select, Input, message, Button } from "ant-design-vue";
import { getSettings, saveSettings } from "./axios";
Vue.use(Select);
Vue.use(Input);

@Component
export default class SystemSettings extends Vue {
    processType = "";
    noticeType = "";
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    async querySettings () {
        try {
            let res = await getSettings(this.userInfo.id);
            if(res.data.returnCode === 1) {
                let data = res.data.data[0];
                this.processType = data.processType;
                this.noticeType = data.noticeType;
            } else {
                message.error("查询系统设置失败");
            };
        } catch (err) {
            console.log("查询系统设置err", err);
        };
    };
    // 保存
    async doSave () {
        let param = {
            companyId: this.userInfo.id,
            processType: this.processType,
            noticeType: this.noticeType
        };
        try {
            let res = await saveSettings(param);
            if(res.data.returnCode === 1) {
                message.success("设置成功");
            } else {
                message.error("设置失败");
            };
        } catch (err) {
            console.log("保存系统设置err", err);
        };
    };
	render() {
		return (
            <div class="settings-page">
                <div class="title-bar">
                    <p>系统设置</p>
                </div>
                <div class="lines">
                    <p class="label">付款方式：</p>
                    <a-select class="filters" value={this.processType} onChange={val => this.processType = val}>
                        <a-select-option value={1}>餐前付款</a-select-option>
                        <a-select-option value={2}>餐后付款</a-select-option>
                    </a-select> 
                </div>
                <div class="lines">
                    <p class="label">厨房接单方式：</p>
                    <a-select class="filters" value={this.noticeType} onChange={val => this.noticeType = val}>
                        <a-select-option value={1}>软件(ipad、手机等设备上使用)</a-select-option>
                        <a-select-option value={2}>小票打印机</a-select-option>
                    </a-select>
                </div>
                <div class="lines">
                    <a-button style="margin:20px auto;" type="primary" onClick={this.doSave}>保存</a-button>
                </div>
            </div>
		);
    };
    mounted() {
        this.querySettings();
    };
}
</script>

<style lang="less" scoped>
    .settings-page{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
        p{margin: 0}
    }
    .title-bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .filters{
        width:  200px;
    }
    .lines{
        width: 600px;
        height: 50px;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
    .label{
        width: 105px;
        text-align: right;
    }
</style>