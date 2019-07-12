<script>
import Vue from "vue";
import Component from "vue-class-component";
import { Modal } from "ant-design-vue";
import echarts from 'echarts';
Vue.use(Modal);

@Component
export default class DishCategory extends Vue {
    switchFlag = true;
    chart1Option = {
        color: ['#3398DB'],
        title: {
            text: "营业额曲线"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['最高营业额','最低营业额']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: true},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            data: ['7-01', '7-02', '7-03', '7-04', '7-05', '7-06', '7-07'],
            // axisTick: {
            //     alignWithLabel: true
            // }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '￥{value}'
            }
        },
        series: [
            {
                name: '营业额',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }
        ]
    };
    chart2Option = {
        color: ['#3398DB'],
        title: {
            text: "菜品销量对比"
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['最高销量','最低销量']
        },
        xAxis : [
            {
                type : 'category',
                data : ['炒鸡蛋', '炒番茄', '水煮肉', '水煮鱼', '柴火鸡', '大龙虾', '小龙虾', '鸡腿', '鸭腿', '猪脚饭', '炒鸡蛋', '炒番茄', '水煮肉', '水煮鱼', '柴火鸡', '大龙虾', '小龙虾', '鸡腿', '鸭腿', '猪脚饭'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : {
            type : 'value',
            axisLabel: {
                formatter: '{value} 份'
            }
        },
        series : [
            {
                name: '销售份数',
                type: 'bar',
                barWidth: '60%',
                data: [34, 52, 200, 334, 390, 330, 220, 45, 78, 36, 34, 52, 200, 334, 390, 330, 220, 45, 78, 36],
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //         {type: 'min', name: '最小值'}
                //     ]
                // }
            }
        ]
    };
    drawCharts() {
        let myChart1 = echarts.init(this.$refs.myChart1);
        let myChart2 = echarts.init(this.$refs.myChart2);
        window.addEventListener("resize", () => {
            myChart1.resize();
            myChart2.resize();
        });
        myChart1.setOption(this.chart1Option);
        myChart2.setOption(this.chart2Option);
    };
    switchChart() {
        this.switchFlag = !this.switchFlag;
        if(this.switchFlag) {
            this.$refs.myChart2.style.display = "block";
            this.$refs.dataTable.style.display = "none";
        } else {
            this.$refs.myChart2.style.display = "none";
            this.$refs.dataTable.style.display = "block";
        }
    };
	render() {
		return (
            <div class="category-page">
                <div class="title-bar">
                    <p class="createBtn">
                        <p class="addBtn"></p>
                    </p>
                </div>
                <div ref="myChart1" class="charts"></div>
                <div class="toolBox" onClick={this.switchChart}>
                    详情
                </div>
                <div ref="myChart2" class="charts"></div>
                <div ref="dataTable" class="charts" style="display: none;">
                    
                </div>
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
    .charts{
        width: 100%;
        height: 390px;
    }
</style>