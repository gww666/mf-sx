<script>
import Vue from "vue";
import Component from "vue-class-component";

import { getCategoryList, getGoodsList } from "./axios";
import scrollTo from "scrollto-with-animation";
import cart from "../../components/cart";
import handle from "../../components/cart/handle";

@Component({
	cart,
	handle
})
export default class Order extends Vue {
	categoryList = [];
	goodsList = [];
	currentCategory = "";
	defaultPic = require("../../assets/images/noPic.jpg")
	// 获取分类列表
    async queryCategoryList() {
        try {
            let res = await getCategoryList(1);
            if (res.data.returnCode === 1) {
				if (res.data.data.length > 0) {
					this.categoryList = res.data.data.sort((a, b) => {
						if (a.sort < b.sort) {
							return -1;
						}
						if (a.sort > b.sort) {
							return 1;
						}
						return 0;
					});
					this.currentCategory = this.categoryList[0].id;
					this.queryGoodsList();
				} else {
					this.categoryList = [];
				};
            } else {
                this.categoryList = [];
            };
        }catch(err) {
            console.log(err, "获取分类列表err");
        };
	};
	// 获取分类下的商品
	async queryGoodsList() {
		try {
            let res = await getGoodsList(1, "all", 1, 100);
            if (res.data.returnCode === 1) {
                if(res.data.data.length > 0) {
					let goodsList = res.data.data;
					let Arr = [];
					// 排个序
					this.categoryList.forEach(item => {
						let arr = [];
						for (let i = 0;i < goodsList.length;i++) {
							if(goodsList[i].categoryId === item.id) {
								arr.push(goodsList[i]);
								goodsList.splice(i, 1);
								i--;
							};
						};
						item.startIndex = Arr.length;
						Arr = Arr.concat(arr);
					});
					this.goodsList = Arr;
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
	// 切换分类
	handleCategoryClick(item) {
		this.currentCategory = item.id;
		this.$refs.rightList.onscroll = null;
		let liHeight = document.querySelector(".goods-item").offsetHeight;
		scrollTo(
			this.$refs.rightList,
			'scrollTop',
			item.startIndex * liHeight, // target scrollY (0 means top of the page)
			500, // duration in ms
			'easeInOutCirc',
			() => {
				this.$refs.rightList.onscroll = e => {this.handleUlScroll(e)};
			}
		);
	};
	handleUlScroll(e) {
		let length = this.categoryList.length;
		let liHeight = document.querySelector(".goods-item").offsetHeight;
		for(let i = length - 1;i >= 0;i--) {
			console.log(this.categoryList[i].startIndex * liHeight, e.target.scrollTop)
			if(this.categoryList[i].startIndex * liHeight <= e.target.scrollTop) {
				this.currentCategory = this.categoryList[i].id;
				break;
			};
		};
	};
	render() {
		return (
			<div class="order-container">
				<div class="order-page">
					<div class="list-left">
						<ul>
							{
								this.categoryList.map(item => (
									<li class={this.currentCategory === item.id ? "choosen-class" : ""} onClick={() => this.handleCategoryClick(item)}>
										{item.name}
									</li>
								))
							}
						</ul>
					</div>
					<div class="list-right" ref="rightList">
						<ul>
							{
								this.goodsList.map(item => (
									<li class="goods-item">
										<img src={item.mainImg ? `http://120.78.221.14:2233${item.mainImg}` : this.defaultPic} class="main-img" />
										<div class="content">
											<div style="width: 100%;">
												<p class="title">{item.title}</p>
												<p class="sub-title">{item.subTitle}圣诞节开发了时间浪费</p>
											</div>
											<div style="position: relative;">
												<span class={"price"}>￥{item.salePrice ? item.salePrice : item.price}</span>
												{
													item.salePrice 
													?
													<span class="sale-price">￥{item.price}</span>
													:
													<span></span>
												}
												<handle goods={item} mStyle={{width: "1.6rem", position: "absolute", right: 0, bottom: "-0.14rem"}} />
											</div>
										</div>
									</li>
								))
							}
						</ul>
					</div>
				</div>
				<cart />
			</div>
		)
	};
	mounted() {
		this.queryCategoryList();
		this.$refs.rightList.onscroll = e => {this.handleUlScroll(e)};
	};
};
</script>
<style lang="less" scoped>
	.order-container{
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
	}
    .order-page{
		width: 100%;
		flex: 1;
		background: #F5F5F5;
		font-size: 0.26rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.list-left{
		width: 25%;
		height: 100%;
		ul{
			height: 100%;
			overflow-y: auto;
			li{
				width: 100%;
				height: 1rem;
				line-height: 1rem;
				padding: 0 .2rem;
				box-sizing: border-box;
			}
			.choosen-class{
				background: #e6e6e6;
			}
		}
	}
	.list-right{
		width: 75%;
		height: 100%;
		overflow-y: auto;
		transition: all 0.5s;
		ul{
			width: 100%;
		}
	}
	.main-img{
		width: 24%;
	}
	.goods-item{
		width: 100%;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.content{
		width: 76%;
		height: 100%;
		box-sizing: border-box;
		padding: .3rem .2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.title{
		width: 100%;
		font-size: .32rem;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.sub-title{
		width: 100%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		margin-top: .1rem;
		color: rgba(0, 0, 0, 0.65);
	}
	.price{
		display: inline-block;
		margin-right: .16rem;
		color: #FF4544;
	}
	.sale-price{
		color: rgba(0, 0, 0, 0.65);
		font-size: .14rem;
		text-decoration: line-through;
	}
</style>