<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class nineSquare extends Vue {
    squares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    handleCardClick(index) {
        let card = document.querySelectorAll(".cards")[index];
        card.setAttribute("style", "transform: rotateY(180deg)");
    };
	render() {
		return (
            <div class="shadow">
                <p class="tip">点击任意卡片抽取奖品</p>
                <div class="squares">
                    {
                        this.squares.map((ele, index) => {
                            return (
                                <div class="cards" onClick={() => this.handleCardClick(index)}>
                                    <div class="card-content"></div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
		);
    };
    mounted() {
        
    };
};
</script>
<style lang="less" scoped>
    .shadow{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.15);
        position: absolute;
        left: 0;
        top: 0;
    }
    .tip{
        margin: 2.2rem auto 0;
        text-align: center;
        font-size: 0.32rem;
    }
    .squares{
        width: 300px;
        height: 300px;
        margin: 0.2rem auto;
    }
    .cards{
        float: left;
        width: 100px;
        height: 100px;
        background: pink;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        text-align: center;
        line-height:100px;
        /*上面是基础样式，根据需求修改，下面的代码实现3d翻转效果*/
        transform-style: preserve-3d;
        transition: all 1s;
    }
    .card-content{
        // content: '';
        position: absolute;
        width: 100px;
        height: 100px;
        /*牌背面的图片*/
        background: url("../../assets/logo.png");
        border-radius: 5px;
        transform-origin: left;
        /*将after伪类折叠到box的背面，作为牌的反面*/
        top: 0;
        left: 100px;
        transform: rotateY(180deg);
    }
</style>