<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
	render() {
		return (
			<router-view></router-view>
		)
	}
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
