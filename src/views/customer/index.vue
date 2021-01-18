<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busCustomerQuery" :model="busCustomerQuery" label-width="80px" class="demo-form-inline">
      <el-row>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="identity" >
              <el-input size="small" v-model="busCustomerQuery.identity" placeholder="请输入身份证号码"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户姓名" prop="custname">
              <el-input size="small" v-model="busCustomerQuery.custname" placeholder="请输入客户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户地址" prop="address">
              <el-input size="small" v-model="busCustomerQuery.address" placeholder="请输入客户地址" />
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户电话" prop="phone" >
            <el-input size="small" v-model="busCustomerQuery.phone" placeholder="请输入客户电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户职业" prop="career">
            <el-input size="small" v-model="busCustomerQuery.career" placeholder="请输入客户职业" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别">
            <el-radio v-model="busCustomerQuery.sex" label="1">男</el-radio>
            <el-radio v-model="busCustomerQuery.sex" label="0">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="getList()">查询</el-button>
          <el-button type="default" size="mini" @click="resetData()">清空</el-button>
        </el-col>
      </el-row>

    </el-form>

    <el-button type="primary" size="mini" @click="add()">添加</el-button>
    <el-button type="danger" size="mini" @click="removeBatch()">批量删除</el-button>

    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

<!--      <el-table-column label="序号" width="70" align="center">-->
<!--        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>-->
<!--      </el-table-column>-->


      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column prop="identity" label="身份证号" width="200"/>

<!--      <el-table-column label="图书封面">-->
<!--        <template slot-scope="scope">-->
<!--          <el-popover placement="top-start" title="" trigger="hover">-->
<!--            <img :src="scope.row.image" alt="" style="width: 150px;height: 200px">-->
<!--            <img slot="reference" :src="scope.row.image" style="width: 30px;height: 30px">-->
<!--          </el-popover>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column prop="custname" label="客户姓名"/>

      <el-table-column prop="address" label="客户地址"/>

      <el-table-column prop="career" label="客户职业"/>

      <el-table-column prop="phone" label="手机号码"/>

      <el-table-column label="性别" width="50">
        <template slot-scope="scope">
          {{ scope.row.sex === 0 ? '女' : '男'}}
        </template>
      </el-table-column>

      <el-table-column label="录入时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>



<!--      <el-table-column label="首页显示" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-switch-->
<!--            v-model="row.status"-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--            @change="change(row.status, row.id)"/></template>-->
<!--      </el-table-column>-->

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
<!--          <router-link :to="'/customer/edit/'+scope.row.id">-->
<!--            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>-->
<!--          </router-link>-->
          <el-button
            type="primary"
            size="mini"
            @click="edit(scope.row.identity)"
          >编辑</el-button>

          <el-button
            type="danger"
            size="mini"
            @click="removeDataById(scope.row.identity)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="identity">
              <el-input size="small" v-model="form.identity" placeholder="请输入身份证号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户职位" prop="career">
              <el-input size="small" v-model="form.career" placeholder="请输入客户职位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="custname">
              <el-input size="small" v-model="form.custname" placeholder="请输入客户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户地址" prop="address">
              <el-input size="small" v-model="form.address" placeholder="请输入客户地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input size="small" v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio v-model="form.sex" label="1">男</el-radio>
              <el-radio v-model="form.sex" label="0">女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 引入调用的相关api下的js文件
  import customer from '@/api/customer'

  export default {
    // 写核心代码
    data() {
      return {
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busCustomerQuery: {},
        title: '添加', // 添加或修改对话框标题
        form: {},
        dialogVisible: false,
        tableChecked: [], // 批量删除的数据
        title: "" // 对话框显示添加用户或修改用户
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.page = page
        customer.list(this.page, this.limit, this.busCustomerQuery)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetData() {
        // 将表单中的数据清空
        this.busCustomerQuery = {}
        this.form = {}
        // 查询所有
        this.getList()
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            customer.remove(id).then(response => {
              // 删除成功
              // 提示成功信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 重新刷新列表
              this.getList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      removeBatch() {
        var ids = this.tableChecked.map(item => item.identity)
        customer.removeBatch(ids).then(response => {
          // 删除成功
          // 提示成功信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新刷新列表
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSelectionChange(val) {
        this.tableChecked = val;
      },
      // 添加
      add() {
        this.title = '添加用户'
        this.dialogVisible = true
      },
      // 编辑
      edit(id) {
        this.title = '修改用户'
        // 弹出对话框
        this.dialogVisible = true
        // 根据用户身份证号查询用户信息
        customer.getById(id).then(response => {
          this.form = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false;
        this.resetData()
      },
      submitForm() {
        if (this.title == '添加用户' ) {
          customer.add(this.form).then(response => {
            // 提示成功信息
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 关闭对话框
            this.dialogVisible = false
            // 表单信息清空
            this.form = {}
            // 查询所有，更新数据
            this.getList()
          })
          .catch(error => {
            // 提示成功信息
            this.$message({
              type: 'danger',
              message: '添加失败!'
            })
            // 表单信息清空
            this.form = {}
            console.log(error)
          })
        } else {
          customer.edit(this.form).then(response => {
            // 提示成功信息
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 关闭对话框
            this.dialogVisible = false
            // 清空对话框数据
            this.form = {}
            // 查询所有，更新数据
            this.getList()
            })
            .catch(error => {
              // 提示失败信息
              this.$message({
                type: 'danger',
                message: '修改失败!'
              })
              // 表单信息清空
              this.form = {}
              console.log(error)
            })
        }
      }
    }
  }
</script>
