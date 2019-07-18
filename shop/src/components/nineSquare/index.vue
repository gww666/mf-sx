<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Toast } from "../../utils/toast";

@Component
export default class nineSquare extends Vue {
    received = false;
    squares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    };
    // 翻牌
    handleCardClick(index) {
        if(this.received) {
            let card = document.querySelectorAll(".cards")[index];
            let cardFront = card.querySelector(".card-front");
            let cardBack = card.querySelector(".card-back");
            cardFront.setAttribute("style", "transform: rotateY(180deg);");
            cardBack.setAttribute("style", "transform: rotateY(0deg);");
            this.received = false;
            this.$emit("received");
            setTimeout(() => {
                this.close();
            }, 1500);
        } else {
            Toast("您已领取过优惠券，无法重复领取。");
        }
    };
    // 关闭
    close() {
        this.$emit("close");
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
                                    <div class="card-front">点击抽奖</div>
                                    <div class="card-back">吔屎啦</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div class="close-btn" onClick={this.close}>
                    ×
                </div>
            </div>
		);
    };
    mounted() {
        this.received = true;
    };
};
</script>
<style lang="less" scoped>
    .shadow{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        left: 0;
        top: 0;
    }
    .tip{
        margin: 2.2rem auto 0;
        text-align: center;
        font-size: 0.32rem;
        color: #FFF;
    }
    .squares{
        width: 300px;
        height: 300px;
        margin: 0.4rem auto;
    }
    .cards{
        float: left;
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        text-align: center;
        line-height: 100px;
    }
    .card-front{
        font-size: 0.28rem;
        color: #FFF;
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: rgb(236, 169, 195);
        transform-origin: center;
        backface-visibility: hidden;
        top: 0;
        left: 0;
        transform-style: preserve-3d;
        transform: rotateY(0deg);
        transition: all 1s;
    }
    .card-back{
        font-size: 0.14rem;
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: #FFF;
        transform-origin: center;
        backface-visibility: hidden;
        top: 0;
        left: 0;
        transform-style: preserve-3d;
        transform: rotateY(180deg);
        transition: all 1s;
    }
    .close-btn{
        width: 1rem;
        height: 1rem;
        margin: 0 auto;
        font-size: 0.8rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        border-radius: 0.5rem;
    }
</style>