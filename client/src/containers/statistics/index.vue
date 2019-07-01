<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Tag, Table, Modal, Select, Input, message, Button, Pagination } from "ant-design-vue";
import echarts from 'echarts'
Vue.use(Tag);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Input);
Vue.use(Pagination);
const { Column } = Table;

@Component
export default class DishCategory extends Vue {
    chart1Option = {
        backgroundColor: '#2c343c',

        title: {
            text: '热门菜品销量对比（月）',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[
                    {value:335, name:'水煮肉片'},
                    {value:310, name:'辣椒炒肉'},
                    {value:274, name:'火腿炒蛋'},
                    {value:235, name:'饭炒饭'},
                    {value:400, name:'炒辣条'},
                    {value:182, name:'炒花生'},
                    {value:302, name:'水煮鱼'},
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    }
    drawCharts() {
        let myChart1 = echarts.init(this.$refs.myChart1);
        // let myChart2 = echarts.init(this.$refs.myChart2);
        window.addEventListener("resize", () => {
            myChart1.resize();
            // myChart2.resize();
        });
        myChart1.setOption(this.chart1Option);
    }
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p>数据统计</p>
                    <p class="createBtn">
                        <p class="addBtn"></p>
                    </p>
                </div>
                <div ref="myChart1" style="width: 350px;height: 350px;"></div>
            </div>
		);
    };
    mounted() {
        this.drawCharts();
    };
}
</script>
<style lang="less" scoped>
    .category-page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #F5F5F5;
    }
    .title-bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>