<template>
  <div class="app-container">
    <el-table
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >

      <el-table-column prop="checkid" label="检查单号" align="center" width="200"/>

      <el-table-column prop="rentid" label="出租单号" align="center" width="220"/>

      <el-table-column prop="problem" label="存在问题" align="center" width="120"/>

      <el-table-column prop="checkdesc" label="问题描述" align="center" width="200" :show-overflow-tooltip="true"/>

      <el-table-column prop="paymoney" align="center" label="赔付金额"/>

      <el-table-column prop="opername" align="center" label="操作员" width="95px"/>

      <el-table-column label="检查时间" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.checkdate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="录入时间" align="center" width="170">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="支付状态" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.pay === true ? '已支付' : '待支付'}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.pay === true"
            @click="pay(scope.row.checkid)"
          >支付</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  // 引入调用的相关api下的js文件
  import check from '@/api/check'

  export default {
    // 写核心代码
    data() {
      return {
        loading: true,
        list: null, // 查询结果
        form: {},
        multiple: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.loading = true
        this.page = page
        check.getMy()
          .then(response => {
            this.list = response.data
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
      },
      pay(checkid) {
        check.pay(checkid).then(response => {
          this.$message({
            type: 'success',
            message: '支付成功！'
          })
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      },
      resetData() {
        this.form = {}
        // 查询所有
        this.getList()
      },
      // 取消按钮
      cancel() {
        this.resetData()
      }
    }
  }
</script>
