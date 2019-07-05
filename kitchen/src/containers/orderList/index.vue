<template>
	<div class="order-list-box">
		<div class="header-box">
			<span class="iconfont icon-tubiaozhizuomoban_dianyuan"></span>
			<span class="iconfont icon-shezhi1"></span>
		</div>
		<div class="content-box">
			<order-item 
				v-for="(item, index) in orderList" 
				:key="'order-item-' + index" :order="item"
				:horizontal="horizontal"
				:itemStyle="itemStyle">
			</order-item>
		</div>
	</div>
</template>
<script>
import OrderItem from "./item";
import { formatDate } from "../../util";
import {rem2px} from "../../util";
export default {
	data() {
		return {
			// orderList: [
			// 	{
			// 		baseInfo: { orderNo: 1, tableNo: 3, note: "免香菜" },
			// 		goodsArray: [
			// 			{ title: "辣椒炒肉", count: 1, note: "免姜" },
			// 			{ title: "凉拌黄瓜", count: 1, note: "免香菜" }
			// 		]
			// 	},
			// 	{
			// 		baseInfo: { orderNo: 1, tableNo: 3, note: "免香菜" },
			// 		goodsArray: [
			// 			{ title: "辣椒炒肉", count: 1, note: "免姜" },
			// 			{ title: "凉拌黄瓜", count: 1, note: "免香菜" }
			// 		]
			// 	},
			// 	{
			// 		baseInfo: { orderNo: 1, tableNo: 3, note: "免香菜" },
			// 		goodsArray: [
			// 			{ title: "辣椒炒肉", count: 1, note: "免姜" },
			// 			{ title: "凉拌黄瓜", count: 1, note: "免香菜" }
			// 		]
			// 	},
			// 	{
			// 		baseInfo: { orderNo: 1, tableNo: 3, note: "免香菜" },
			// 		goodsArray: [
			// 			{ title: "辣椒炒肉", count: 1, note: "免姜" },
			// 			{ title: "凉拌黄瓜", count: 1, note: "免香菜" }
			// 		]
			// 	},
			// 	{
			// 		baseInfo: { orderNo: 1, tableNo: 3, note: "免香菜" },
			// 		goodsArray: [
			// 			{ title: "辣椒炒肉", count: 1, note: "免姜" },
			// 			{ title: "凉拌黄瓜", count: 1, note: "免香菜" }
			// 		]
			// 	}
			// ],
			horizontal: false,
			itemStyle: {
                width: "",
                height: ""
			},
			dishBoxItemCount: 1
		};
	},
	computed: {
		orderList() {
			console.log("list", this.$store.getters.getOrderList);

			return this.$store.getters.getOrderList.map(item => {
				return {
					baseInfo: {
						...item.baseInfo,
						time: formatDate(item.baseInfo.createDate)
					},
					goodsArray: item.goodsArray,
					showArray: item.goodsArray.slice(0, this.dishBoxItemCount)
				};
			});
		},
		settings() {
            return this.$store.state.settings;
        },
	},
	methods: {
		getOrderList() {
			this.$store.dispatch("getOrderList", { companyId: 1 });
		},
		resetStyle(first = false) {
			let width = document.documentElement.offsetWidth;
			// console.log("width", width);
			if (width >= 640) {
				// console.log("width", width);
				//只有大于这个临界值，才会认为是横屏模式
				this.horizontal = true;
				const { itemCount } = this.settings;
				switch (itemCount) {
					case 4:
						this.itemStyle = {
							width: "49%",
							height: "48%"
						};
						break;
					case 9:
						this.itemStyle = {
							width: "33.33%",
							height: "50%"
						};
						break;
				}
				let time = first ? 20 : 0;
				setTimeout(() => {
					//计算一个菜单能放置几道菜
					//获取dish-box的高度
					let dishBox = document.querySelector(".dish-box");
					// console.log("dishBox", dishBox);

					let dishBoxHeight = window
						.getComputedStyle(dishBox, null)
						.height.slice(0, -2);
					// console.log("dishBoxHeight", dishBoxHeight);
					//获取一道菜的高度
					let dishItem = document.querySelector(".dish-item");
					// console.log("dishItem", dishItem);
					let dishItemHeight = window
						.getComputedStyle(dishItem, null)
						.height.slice(0, -2);
					// console.log("dishItemHeight", dishItemHeight);
					let count = Math.floor(dishBoxHeight / dishItemHeight);
					let marginBottom = rem2px(0.2);
					let padding = rem2px(0.2);
					// console.log("marginBottom", marginBottom);
					let realHeight = count * dishItemHeight + (count - 1) * marginBottom;
					// console.log("realHeight", realHeight);
					if ((dishItemHeight - padding * 2) < realHeight) {
						count -= 1;
					}
					this.dishBoxItemCount = count;
					// console.log("能展示的数量", count);
				}, time);
				
			} else {
				this.horizontal = false;
			}
		},
		resize() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.timer = setTimeout(() => {
				this.resetStyle();
			}, 500);
		},
		addListener() {
			this.removeListener();
			window.addEventListener("resize", this.resize, false);
		},
		removeListener() {
			window.removeEventListener("resize", this.resize, false);
		}
	},
	mounted() {
		this.getOrderList();
		this.addListener();
        // 设置样式
        this.resetStyle(true);
	},
	components: {
		OrderItem
	}
};
</script>

<style lang="scss" scoped>
.order-list-box {
	width: 100%;
	height: 100%;
	background: #f1f1f1;
	// background: #fff;
	padding: 0 0.3rem;
	display: flex;
	flex-flow: column nowrap;

	.header-box {
		height: 0.88rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.iconfont {
			display: block;
			color: #444;
			font-size: 0.4rem;
		}
		.icon-shezhi1 {
			font-size: 0.34rem;
			margin-left: 0.3rem;
		}
	}
	.content-box {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
}
</style>
