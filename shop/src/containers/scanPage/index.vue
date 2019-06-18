<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getSettings, getOrder } from "./axios";

@Component
export default class Order extends Vue {
	// 获取系统设置
	async querySystemSettings(tableNum) {
		Promise.all([getSettings(), getOrder(tableNum)]).then(res => {
			let setting_res = res[0];
			let order_res = res[1];
			if (setting_res.data.returnCode === 1 && order_res.data.returnCode === 1) {
				let setting = setting_res.data.data[0];
				let order = order_res.data.data;
				this.$store.commit("qxz/updateTypes", setting);
				this.$store.commit("qxz/updateIdNo", {companyId: 1, tableNum});
				if (setting.processType === 1) {
                    this.$router.push({name: "orderPage"});
					console.log("先付款，有没有未完结的单都继续点");
				};
				if (setting.processType === 2 && Array.isArray(order)) {
					for(let i = 0; i < order.length; i++) {
						if(order[i].status === 1) {
							this.$router.push({name: "choicesPage"});
							break;
						};
					};
					console.log("后付款，且有未完结订单，跳转加菜结账选择页面");
				};
			};
		}).catch(err => {
			console.log("是否有未完结订单err:", err);
		});
    };
    doScan() {
        this.querySystemSettings(3);
    };
	render() {
		return (
			<div class="scan-container">
				<div class="scanBtn" onClick={this.doScan}>扫码去商品列表</div>
			</div>
		)
	};
	mounted() {
		
	};
};
</script>
<style lang="less" scoped>
	.scan-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
	}
    .scanBtn{
        width: 2rem;
        height: .6rem;
        border-radius: .3rem;
        line-height: .6rem;
        text-align: center;
        color: #FFF;
        background: #1890ff;
        margin: .4rem auto;
    }
</style>