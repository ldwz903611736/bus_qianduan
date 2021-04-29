<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busFaultQuery" :model="busFaultQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="5">
          <el-form-item label="车牌号" prop="carnumber" >
            <el-input size="small" v-model="busFaultQuery.carnumber" placeholder="请输入车牌号"/>
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

      <el-table-column prop="id" align="center" label="编号"/>

      <el-table-column prop="type" align="center" label="故障类型"/>

      <el-table-column prop="description" align="center" label="故障描述"/>

      <el-table-column label="是否影响驾驶" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.influence ? '是' : '否'}}
        </template>
      </el-table-column>

      <el-table-column label="是否需要替换" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.replacement ? '是' : '否'}}
        </template>
      </el-table-column>

      <el-table-column prop="identity" align="center" label="客户身份证号"/>

      <el-table-column prop="customername" align="center" label="客户姓名"/>

      <el-table-column prop="carnumber" align="center" label="车牌号"/>

      <el-table-column prop="findtime" align="center" label="故障发现日期"/>

      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="remarks" align="center" label="备注"/>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            :disabled="scope.row.handle"
            @click="handle(scope.row.id)"
          >去处理</el-button>
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
  import fault from '@/api/fault'

  export default {
    // 写核心代码
    data() {
      return {
        loading: true,
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busFaultQuery: {},
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
        fault.list(this.page, this.limit, this.busFaultQuery)
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
        this.busFaultQuery = {}
        this.form = {}
        // 查询所有
        this.getList()
      },
      handle(id) {
        fault.handleFault(id).then(response => {
          // 出租成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '处理成功!'
          })
          // 重新刷新列表
          this.getList()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '处理失败!'
          })
          console.log(error)
        })
      },
    }
  }
</script>
