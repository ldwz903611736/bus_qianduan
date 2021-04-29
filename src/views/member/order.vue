<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busOrderQuery" :model="busOrderQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="5">
          <el-form-item label="车牌号" prop="carnumber">
            <el-input size="small" v-model="busOrderQuery.carnumber" placeholder="请输入车牌号"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
            <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      v-loading="loading"
    >


      <el-table-column prop="orderid" align="center" label="车牌号"/>

      <el-table-column prop="cartype" align="center" label="车辆类型"/>

      <el-table-column prop="color" align="center" label="车辆颜色"/>

      <el-table-column prop="price" align="center" label="车辆价格"/>

      <el-table-column label="借出日期" align="center" width="145">
        <template slot-scope="scope">
          {{ scope.row.begindate }}
        </template>
      </el-table-column>

      <el-table-column label="归还日期" align="center" width="145">
        <template slot-scope="scope">
          {{ scope.row.returndate }}
        </template>
      </el-table-column>

      <el-table-column label="支付时间" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.paytime != null ? scope.row.paytime.replace('T', ' ') : '未支付' }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="支付状态" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === true ? '已支付' : '待支付'}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.status === true"
            @click="pay(scope.row.orderid)"
          >去支付
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pull-right"
                   :current-page="page"
                   :page-size="limit"
                   :total="total"
                   background
                   layout="prev, pager, next"
                   @current-change="getList"
    />
  </div>
</template>

<script>
  // 引入调用的相关api下的js文件
  import order from '@/api/order'

  export default {
    // 写核心代码
    data() {
      return {
        loading: true,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busOrderQuery: {},
        dialogVisible: false,
        form: {},
        title: '', // 对话框显示添加用户或修改用户
        showImg: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.loading = true
        this.page = page
        order.getByMember(this.page, this.limit, this.busOrderQuery)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
            this.loading = false
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetData() {
        // 将表单中的数据清空
        this.busOrderQuery = {}
        this.form = {}
        // 查询所有
        this.getList()
      },
      pay(orderid) {
        order.pay(orderid).then(response => {
          // 出租成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '支付成功!'
          })
          // 重新刷新列表
          this.getList()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '支付失败!'
          })
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false
        this.resetData()
      }
    }
  }
</script>
