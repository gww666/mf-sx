<script>
import Vue from "vue";
import Component from "vue-class-component";

import leftSideList from "./components/leftSideList";
import commonHeader from "./components/commonHeader";
@Component({
    components: {
        leftSideList,
        commonHeader
    }
})
export default class App extends Vue {
    get isLoginPage() {
        return this.$route.name === "login";
    };
	render() {
		return (
            <div class="project-container">
                {
                    this.isLoginPage ? <div></div> : <left-side-list />
                }
                <div class="right-side" ref="rightSide">
                    {
                        this.isLoginPage ? <div></div> : <common-header />
                    }
                    <router-view class="router-view" ref="routerView"></router-view>
                </div>
            </div>
		)
    };
    setHeight() {
        let rightSide = this.$refs.rightSide;
        rightSide.style.height = document.documentElement.offsetHeight + "px";
    };
    mounted() {
        this.setHeight();
    };
};
</script>

<style scoped>
.project-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}
.right-side{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.router-view{
    flex: 1;
    padding: 0 20px;
}
</style>
