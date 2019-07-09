<template>
	<div class="order-list-box">
		<div class="header-box">
			<span class="iconfont icon-tubiaozhizuomoban_dianyuan"></span>
			<span class="iconfont icon-shezhi1" @click="gotoSettings"></span>
		</div>
		<div class="scroll-box" :style="horizontal ? scrollBoxStyle : {}">
			<div class="content-box" :style="horizontal ? contentBoxHorizontalStyle : contentBoxVerticalStyle">
				<div class="content-item-box" 
					:style="horizontal ? contentItemHorizontalStyle : {}"
					v-for="(arrItem, index1) in orderListSliceByCount"
					:key="'content-item-' + index1">
					<order-item 
						v-for="(item, index2) in arrItem" 
						:key="'order-item-' + index2" :order="item"
						:horizontal="horizontal"
						:itemStyle="itemStyleArray[index2]">
					</order-item>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import OrderItem from "./item";
import { formatDate } from "../../util";
import {rem2px} from "../../util";
import BScroll from "better-scroll";
export default {
	data() {
		return {
			horizontal: false,
			itemStyle: {
                width: "",
				height: "",
				marginRight: "",
				marginBottom: ""
			},
			itemStyleArray: [],
			contentStyle: {
				width: ""
			},
			scrollBoxStyle: {

			},
			// contentBoxHorizontalStyle: {
			// 	width: ""
			// },
			contentBoxHorizontalStyle1: {
				width: ""
			},
			contentBoxVerticalStyle: {
				flexFlow: "column nowrap",
				overflowY: "auto"
			},
			contentItemHorizontalStyle: {
				width: document.documentElement.offsetWidth + "px"
			},
			dishBoxItemCount: 1,//每个菜单能展示的菜的数量
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
		orderListSliceByCount() {
			let i = 0;
			let arr = [];
			let {itemCount} = this.settings;
			
			while (i <= this.orderList.length) {
				arr.push([...this.orderList.slice(i, i + itemCount)]);
				i += itemCount;
			}
			return arr;
		},
		settings() {
            return this.$store.state.settings;
		},
		screenCount() {
			return Math.ceil(this.orderList.length / this.settings.itemCount);
		},
		contentBoxHorizontalStyle: {
			get() {
				if (this.contentBoxHorizontalStyle1.width) {
					return this.contentBoxHorizontalStyle1;
				} else {
					let screenWidth = document.documentElement.offsetWidth;
					let totalWidth = screenWidth * this.screenCount;
					return {
						width: totalWidth + "px"
					}
				}
			},
			set(val) {
				this.contentBoxHorizontalStyle1 = val;			
			}
			
		}
	},
	methods: {
		getOrderList() {
			this.$store.dispatch("getOrderList", { companyId: 1 });
		},
		setItemStyle() {
			let width = document.documentElement.offsetWidth;
			const { itemCount } = this.settings;
			//每一排的最后一个没有marginRight
			//最后一排没有marginBottom
			//计算右间距和下间距
			let contentItemBox = document.querySelector(".content-item-box");
			if (!contentItemBox) return;
			//获取其宽和高
			let contentItemBoxH = window
				.getComputedStyle(contentItemBox, null)
				.width.slice(0, -2);
			// 开始计算右边距和上边距
			let orderItemMarginRight = "";
			let orderItemMarginBottom = "";
			let orderItemW = 0;
			let orderItemH = 0;
			let arr = [];
			switch (itemCount) {
				case 4:
					//需要计算右边距
					orderItemW = width * 0.49;
					orderItemH = contentItemBoxH * 0.49;
					orderItemMarginRight = (width - orderItemW * 2) + "px";
					orderItemMarginBottom = (contentItemBoxH - orderItemH * 2) + "px";
					for (let i = 0; i < itemCount; i++) {
						let index = i + 1;
						if (index % 2 === 0 && index <= 2) {
							arr.push(this.itemStyle);
						} else if (index % 2 === 0 && index > 2) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom
							});
						} else if (index % 2 !== 0 && index <= 2) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom,
								marginRight: orderItemMarginRight
							});
						} else if (index % 2 !== 0 && index > 2) {
							arr.push({
								...this.itemStyle,
								marginRight: orderItemMarginRight
							});
						}
					}
					break;
				case 6:
					//需要计算右边距
					orderItemW = width * 0.328;
					orderItemH = contentItemBoxH * 0.49;
					orderItemMarginRight = (width - orderItemW * 3) / 2 + "px";
					orderItemMarginBottom = (contentItemBoxH - orderItemH * 2) + "px";
					for (let i = 0; i < itemCount; i++) {
						let index = i + 1;
						if (index % 3 === 0 && index <= 3) {
							arr.push(this.itemStyle);
						} else if (index % 3 === 0 && index > 3) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom
							});
						} else if (index % 3 !== 0 && index <= 3) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom,
								marginRight: orderItemMarginRight
							});
						} else if (index % 3 !== 0 && index > 3) {
							arr.push({
								...this.itemStyle,
								marginRight: orderItemMarginRight
							});
						}
					}
					break;
				case 9:
					//需要计算右边距和上边距
					orderItemW = width * 0.328;
					orderItemH = contentItemBoxH * 0.328;
					orderItemMarginRight = (width - orderItemW * 3) / 2 + "px";
					orderItemMarginBottom = (contentItemBoxH - orderItemH * 3) / 2 + "px";
					for (let i = 0; i < itemCount; i++) {
						let index = i + 1;
						if (index % 3 === 0 && index <= 6) {
							arr.push(this.itemStyle);
						} else if (index % 3 === 0 && index > 6) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom
							});
						} else if (index % 3 !== 0 && index <= 6) {
							arr.push({
								...this.itemStyle,
								marginBottom: orderItemMarginBottom,
								marginRight: orderItemMarginRight
							});
						} else if (index % 3 !== 0 && index > 6) {
							arr.push({
								...this.itemStyle,
								marginRight: orderItemMarginRight
							});
						}
					}
					break;
			}
			console.log("arr", arr);
			
			this.itemStyleArray = arr;
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
					case 6:
						this.itemStyle = {
							width: "32.8%",
							height: "48%"
						};
						break;
					case 9:
						this.itemStyle = {
							width: "32.8%",
							height: "32.8%"
						};
						break;
				}
				this.setItemStyle();
				let time = first ? 34 : 0;
				setTimeout(() => {
					
					//计算一个菜单能放置几道菜
					//获取dish-box的高度
					let dishBox = document.querySelector(".dish-box");
					// console.log("dishBox", dishBox);
					if (!dishBox) return;
					let dishBoxHeight = window
						.getComputedStyle(dishBox, null)
						.height.slice(0, -2);
					// console.log("dishBoxHeight", dishBoxHeight);
					//获取一道菜的高度
					let dishItem = document.querySelector(".dish-item");
					if (!dishItem) return;
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
					//计算样式
					let totalWidth = width * this.screenCount;
					this.contentBoxHorizontalStyle = {
						width: totalWidth + "px"
					}
					this.contentItemHorizontalStyle = {
						width: width + "px"
					}
					// console.log("能展示的数量", count);
					//初始化better-scroll
					setTimeout(() => {
						this.initBetterScroll();
					}, 17);
				}, time);
				
			} else {
				this.horizontal = false;
				//销毁better-scroll
				this.destroyBetterScroll();
				this.dishBoxItemCount = 100;
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
		},
		initBetterScroll() {
			this.scroll = new BScroll(".scroll-box", {
				scrollX: true,
				scrollY: false,
				snap: {
					stepX: document.documentElement.offsetWidth
				}
			});
		},
		//销毁better-scroll
		destroyBetterScroll() {
			if (this.scroll) {
				this.scroll.destroy();
				this.scroll = null;
			}
		},
		//去往设置页面
		gotoSettings() {
			this.$router.push("/settings");
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
	// padding: 0 0.3rem;
	display: flex;
	flex-flow: column nowrap;

	.header-box {
		padding: 0.1rem 0.3rem;
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
	.scroll-box {
		flex: 1;
		// overflow-y: hidden;
		// overflow-x: auto;
		overflow: hidden;

		.content-box {
			// flex: 1;
			display: flex;
			height: 100%;

			.content-item-box {
				// width: 100%;
				// height: 100%;
				display: flex;
				flex-wrap: wrap;
				// justify-content: space-between;
				align-content: flex-start;
			}
			
		}

	}
	
}
</style>
