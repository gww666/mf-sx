<script>
import Vue from "vue";
import Component from "vue-class-component";
import { getSettings, getOrder } from "./axios";

@Component
export default class Order extends Vue {
	showPage = false;
	get unfinishedOrder() {
		return this.$store.state.qxz.unfinishedOrder;
	};
	// 回到菜单去加菜
    goOrderPage() {
        this.$router.push({name: "orderPage"});
	};
	// 查看已有订单
    goCheckOrders() {
		this.$router.push({name: "checkOrderDetail", params: {orderNo: this.unfinishedOrder.orderNo, payment: this.unfinishedOrder.payment}});
	};
	// 获取系统设置
	async querySystemSettings(companyId, tableNo) {
		let hour = new Date().getHours();
		let requestArr = [];
		if(0 <= hour && hour <= 3) {
			requestArr = [getSettings(), getOrder(companyId, tableNo, new Date()), getOrder(companyId, tableNo, new Date().getTime() - 24 * 60 * 60 * 1000)];
		} else {
			requestArr = [getSettings(), getOrder(companyId, tableNo, new Date())];
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
			if (setting.processType === 1) {
				// 先付款，有没有未完结的单都继续点
				this.$router.replace({name: "orderPage"});
			};
			if (setting.processType === 2 && Array.isArray(order)) {
				for(let i = 0; i < order.length; i++) {
					if(order[i].status === 1) {
						// 把未完结的单存到vuex中
						this.$store.commit("qxz/updateUnfinishedOrder", order[i]);
						this.showPage = true;
						// 后付款，且有未完结订单，跳转加菜、查看已有订单选择页面
						// this.$router.push({name: "choicesPage", params: {orderNo: order[i].orderNo, payment: order[i].payment}});
						return;
					};
				};
				this.$router.replace({name: "orderPage"});
			};
		};
	};
	// <p>您有尚未支付的订单，您可以选择继续点餐</p>
	render() {
		return (
			this.showPage
			?
			<div class="choices-container">
				<div class="choices" onClick={this.goOrderPage}>我要加菜</div>
				<div class="choices" onClick={this.goCheckOrders}>查看已有订单</div>
			</div>
			:
			<div></div>
		)
	};
	created() {
		let { companyId, tableNo } = this.$route.query;
		this.$store.commit("qxz/updateIdNo", {companyId, tableNo});
		this.querySystemSettings(companyId, tableNo);
	};
};
</script>
<style lang="less" scoped>
	.choices-container{
        font-size: .16rem;
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
		// align-items: center;
		justify-content: space-between;
	}
    .choices{
        width: 2rem;
        height: .68rem;
        border-radius: .34rem;
		line-height: .71rem;
		font-size: .24rem;
		font-weight: bold;
        text-align: center;
        color: #FFF;
        background: #1890ff;
        margin: 5rem auto;
    }
</style>