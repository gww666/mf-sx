<script>
import Vue from "vue";
import Component from "vue-class-component";

import { getCategoryList, getGoodsList } from "./axios";
import scrollTo from "scrollto-with-animation";
import cart from "../../components/cart";
import handle from "../../components/cart/handle";
import { Toast } from "../../utils/toast";

@Component({
	cart,
	handle
})
export default class Order extends Vue {
	categoryList = [];
	goodsList = [];
	currentCategory = "";
	defaultPic = require("../../assets/images/noPic.jpg");
	get selectedGoodsList () {
		return this.$store.state.gw.goodsList;
	};
	// 企业id
	get companyId () {
		return this.$store.state.qxz.companyId;
	};
	// 加入菜品数
	getCount(item) {
		let count = 0;
		this.selectedGoodsList.forEach(ele => {
			if(ele.categoryId === item.id) {
				count++;
			};
		});
		return count;
	};
	// 获取分类列表
    async queryCategoryList() {
        try {
            let res = await getCategoryList(1);
            if (res.data.returnCode === 1) {
				if (res.data.data.length > 0) {
					this.categoryList = res.data.data.sort((a, b) => {
						return a.sort - b.sort;
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
            let res = await getGoodsList(this.companyId);
            if (res.data.returnCode === 1) {
                if(res.data.data.length > 0) {
					let goodsList = res.data.data;
					let Arr = [];
					// 分类的index
					let cateIndex = 0;
					// 排序
					this.categoryList.forEach(item => {
						item.isCategory = true;
						item.cateIndex = cateIndex;
						let arr = [item];
						for (let i = 0;i < goodsList.length;i++) {
							if(goodsList[i].categoryId === item.id) {
								arr.push(goodsList[i]);
								goodsList.splice(i, 1);
								i--;
							};
						};
						item.startIndex = Arr.length - cateIndex;
						Arr = Arr.concat(arr);
						cateIndex++;
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
		let catLiHeight = document.querySelector(".category-name").offsetHeight;
		scrollTo(
			this.$refs.rightList,
			'scrollTop',
			item.startIndex * liHeight + item.cateIndex * catLiHeight, // target scrollY (0 means top of the page)
			500, // duration in ms
			'easeInOutCirc',
			() => {
				this.$refs.rightList.onscroll = e => {this.handleUlScroll(e)};
			}
		);
	};
	// 跳转详情
	goDetail(item) {
		// Toast({
		// 	message: "你是真的操作成功了啊，小伙子！",
		// 	type: "normal",
		// 	duration: 1500
		// })
		// return
		this.$router.push({name: "detail", params: {info: item}});
	};
	handleUlScroll(e) {
		let length = this.categoryList.length;
		let catLiHeight = document.querySelector(".category-name").offsetHeight;
		let liHeight = document.querySelector(".goods-item").offsetHeight;
		for(let i = length - 1;i >= 0;i--) {
			let temp = this.categoryList[i];
			if(temp.startIndex * liHeight + temp.cateIndex * catLiHeight <= e.target.scrollTop) {
				this.currentCategory = temp.id;
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
										{
											this.getCount(item)
											?
											<p class="countIcon">{this.getCount(item)}</p>
											:
											<span></span>
										}
									</li>
								))
							}
						</ul>
					</div>
					<div class="list-right" ref="rightList">
						<ul>
							{
								this.goodsList.map(item => (
									item.isCategory
									?
									<li class="category-name">
										{item.name}
									</li>
									:
									<li class="goods-item">
										<div class="icon-can" onClick={() => this.goDetail(item)}>
											<img src={item.thumbnail ? `http://120.78.221.14:2233${item.thumbnail}` : this.defaultPic} class="main-img" />
										</div>
										<div class="content">
											<div style="width: 100%;" onClick={() => this.goDetail(item)}>
												<p class="title">{item.title}</p>
												<p class="sub-title">{item.subTitle}</p>
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
		width: 22%;
		height: 100%;
		ul{
			height: 100%;
			overflow-y: auto;
			background: #f2f2f2;
			li{
				width: 100%;
				min-height: 1rem;
				display: flex;
				align-items: center;
				padding: 0 .24rem;
				box-sizing: border-box;
				position: relative;
			}
			.choosen-class{
				background: #fff;
			}
		}
	}
	.countIcon{
		position: absolute;
		width: .3rem;
		height: .3rem;
		border-radius: .15rem;
		background: #FF4544;
		background: linear-gradient(to right, #FF4544, #FE9046);
		text-align: center;
		line-height: .3rem;
		font-size: .1rem;
		color: #FFF;
		right: .16rem;
		top: .16rem;
	}
	.list-right{
		width: 78%;
		height: 100%;
		overflow-y: auto;
		transition: all 0.5s;
		ul{
			width: 100%;
		}
	}
	.icon-can{
		width: 23%;
		height: 100%;
		margin-left: 2%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.main-img{
		max-width: 100%;
		max-height: 1.4rem;
	}
	.category-name{
		width: 100%;
		height: .7rem;
		line-height: .7rem;
		box-sizing: border-box;
		font-size: .26rem;
		font-weight: bold;
		padding: 0 2%;
		background: #FFF;
		box-sizing: border-box;
		// border-top: 1px solid #f2f2f2;
		// border-bottom: 1px solid #f2f2f2;
	}
	.goods-item{
		width: 100%;
		height: 1.8rem;
		background: #FFF;
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
		font-size: .28rem;
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
		font-size: .2rem;
		color: rgba(0, 0, 0, 0.65);
	}
	.price{
		display: inline-block;
		margin-right: .16rem;
		font-size: .26rem;
		color: #FF4544;
	}
	.sale-price{
		color: rgba(0, 0, 0, 0.65);
		font-size: .2rem;
		text-decoration: line-through;
	}
</style>