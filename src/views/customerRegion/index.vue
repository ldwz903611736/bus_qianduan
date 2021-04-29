<template>
  <div class="app-container">
    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%"/>
    </div>
  </div>
</template>

<script>
  import stat from '@/api/stat'
  import customer from '@/api/customer'
  import echarts from 'echarts'

  export default {
    data() {
      return {
        chart: null,
        title: '',
        data: [],
        regionData: []
      }
    },
    mounted() {
      this.showChart()
    },
    methods: {
      showChart() {
        customer.getRegions().then(response => {
          this.regionData = response.data
        })
        stat.getByCustomerRegion().then(response => {
          this.data = response.data
          this.setChart()
        })
      },
      // 设置图标参数
      setChart() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById('chart'))
        console.log(this.chart)

        // 指定图表的配置项和数据
        const option = {
          title: {
            text: '汽车出租系统客户地区统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.regionData
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

        this.chart.setOption(option)
      }
    }
  }
</script>
