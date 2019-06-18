<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getSettings, getOrder } from "./axios";

@Component
export default class Order extends Vue {
	// 获取系统设置
	async querySystemSettings(tableNo) {
		let hour = new Date().getHours();
		let requestArr = [];
		if(0 <= hour && hour <= 17) {
			requestArr = [getSettings(), getOrder(tableNo, new Date()), getOrder(tableNo, new Date().getTime() - 24 * 60 * 60 * 1000)];
		} else {
			requestArr = [getSettings(), getOrder(tableNo, new Date())]
		};
		Promise.all(requestArr).then(res => {
			this.handleDatas(res, tableNo);
		}).catch(err => {
			console.log("是否有未完结订单err:", err);
		});
	};
	handleDatas(res, tableNo) {
		let setting_res = res[0];
		let order_res = res[1];
		let order_res2 = res[2];
		if (setting_res.data.returnCode === 1 && order_res.data.returnCode === 1) {
			let setting = setting_res.data.data[0];
			let order = order_res.data.data;
			if(order_res2 && order_res2.data.returnCode === 1) {
				let order2 = order_res2.data.data;
				order = order.concat(order2);
			};
			this.$store.commit("qxz/updateTypes", setting);
			this.$store.commit("qxz/updateIdNo", {companyId: 1, tableNo});
			if (setting.processType === 1) {
				// 先付款，有没有未完结的单都继续点
				this.$router.push({name: "orderPage"});
			};
			if (setting.processType === 2 && Array.isArray(order)) {
				for(let i = 0; i < order.length; i++) {
					if(order[i].status === 1) {
						// 更新未完结订单信息到store
						this.$store.commit("qxz/updateUnfinishedOrder", order[i]);
						// 后付款，且有未完结订单，跳转加菜、查看已有订单选择页面
						this.$router.push({name: "choicesPage"});
						return;
					};
				};
				this.$store.commit("qxz/updateUnfinishedOrder", {});
				this.$router.push({name: "orderPage"});
			};
		};
	}
    doScan() {
        this.querySystemSettings(3);
    };
	render() {
		return (
			<div class="scan-container">
				<div class="scanBtn" onClick={this.doScan}>扫码</div>
			</div>
		)
	};
	mounted() {
		let { companyId, tableNo } = this.$route.query;
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