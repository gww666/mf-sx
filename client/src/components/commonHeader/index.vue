<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Input, Button, Icon } from "ant-design-vue";
Vue.use(Icon);
Vue.use(Input);
Vue.use(Button);
@Component
export default class commonHeader extends Vue {
    showSignOutBtn = false;
    get userInfo() {
        return this.$store.state.qxz.userInfo;
    }
    showSignOut() {
        this.showSignOutBtn = true;
    }
    hideSignOut() {
        this.showSignOutBtn = false;
    }
    // 退出登录
    signOut() {
        this.hideSignOut();
        this.$store.dispatch("qxz/updateUserInfo", {});
        localStorage.setItem("sessionId", "");
        this.$router.replace({name: "login"});
    }
	render() {
		return (
            <div class="common-header">
                <div class="user-infos" onClick={() => this.showSignOutBtn ? this.hideSignOut() : this.showSignOut()}>
                    <span>{this.userInfo.name}</span>
                    <Icon type="caret-down" />
                </div>
                {
                    this.showSignOutBtn
                    ?
                    <div class="sign-out-box">
                        <div class="arrow"></div>
                        <div class="sign-out-btn" onClick={this.signOut}>
                            <p class="sign-out-text">退出</p>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
		)
	}
}
</script>
<style lang="less" scoped>
    .common-header{
        width: 100%;
        height: 50px;
        background: #FFF;
        position: relative;
    }
    .user-infos{
        height: 100%;
        line-height: 50px;
        margin-right: 20px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
    }
    .sign-out-box{
        background: #FFF;
        width: 140px;
        border-radius: 4px;
        position: absolute;
        z-index: 3;
        right: 0;
        bottom: -46px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    }
    .arrow{
        width: 0;
        height: 0;
        border-width: 0 5px 10px;
        border-style: solid;
        border-color: transparent transparent #FFF;
        top: -10px;
        right: 20px;
        position: absolute;
        z-index: 3;
    }
    .sign-out-btn{
        height: 36px;
        line-height: 36px;
        cursor: pointer;
    }
    .sign-out-text{
        margin:0 0 0 10px;
    }
</style>