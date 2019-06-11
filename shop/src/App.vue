<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
	render() {
		return (
            <div class="project-container">
                <router-view class="router-view"></router-view>
            </div>
		)
    };
};
</script>

<style scoped>
.project-container {
    width: 100%;
    height: 100%;
}
.router-view{
    width: 100%;
    height: 100%;
}
</style>
