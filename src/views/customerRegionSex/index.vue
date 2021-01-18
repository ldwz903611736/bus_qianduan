<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="value" placeholder="请选择地区" size="small">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          :disabled="btnDisabled"
          type="primary"
          icon="el-icon-search"
          @click="showChart()">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
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
        value: '',
        btnDisabled: false,
        chart: null,
        options: [],
        data: [
          { name: '1', value: '1' },
          { name: '0', value: '2' }
        ]
      }
    },
    created() {
      this.getRegions()
    },
    methods: {
      getRegions() {
        customer.getRegions().then(response => {
          this.options = response.data
        })
      },
      showChart() {
        stat.getByCustomerRegionSex(this.value).then(response => {
          this.data = response.data
          for (var i = 0; i <　this.data.length; i++) {
            if (this.data[i].name == '1') {
              this.data[i].name = '男'
            } else {
              this.data[i].name = '女'
            }
          }
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
            text: '汽车出租系统客户地区性别统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['男', '女']
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
