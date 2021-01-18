<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form ref="busCarQuery" :model="busCarQuery" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="车牌号" prop="carnumber" >
            <el-input size="small" v-model="busCarQuery.carnumber" placeholder="请输入车牌号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆类型" prop="cartype">
            <el-input size="small" v-model="busCarQuery.cartype" placeholder="请输入车辆类型" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆颜色" prop="color">
            <el-input size="small" v-model="busCarQuery.color" placeholder="请输入车辆颜色" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="车辆描述" prop="description" >
            <el-input size="small" v-model="busCarQuery.description" placeholder="请输入车辆描述"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="是否出租">
            <el-radio v-model="busCarQuery.isrenting" label="1">已出租</el-radio>
            <el-radio v-model="busCarQuery.isrenting" label="0">未出租</el-radio>
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

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column prop="carnumber" label="车牌号"/>

      <el-table-column prop="cartype" label="车辆类型"/>

      <el-table-column prop="color" label="车辆颜色"/>

      <el-table-column prop="price" label="车辆价格"/>

      <el-table-column prop="rentprice" label="出租价格"/>

      <el-table-column prop="deposit" label="出租押金"/>

      <el-table-column label="出租状态" width="50">
        <template slot-scope="scope">
          {{ scope.row.isrenting === 1 ? '在租' : '未租'}}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="车辆描述"/>

      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="scope.row.carimg" alt="" style="width: 200px;height: 150px">
            <img slot="reference" :src="scope.row.carimg" style="width: 30px;height: 30px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="录入时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="edit(scope.row.carnumber)"
          >编辑</el-button>

          <el-button
            type="danger"
            size="mini"
            @click="removeDataById(scope.row.carnumber)"
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
            <el-form-item label="车牌号" prop="identity">
              <el-input size="small" v-model="form.carnumber" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="career">
              <el-input size="small" v-model="form.cartype" placeholder="请输入车辆类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆颜色" prop="custname">
              <el-input size="small" v-model="form.color" placeholder="请输入车辆颜色" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆价格" prop="address">
              <el-input size="small" v-model="form.price" placeholder="请输入车辆价格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出租价格" prop="phone">
              <el-input size="small" v-model="form.rentprice" placeholder="请输入出租价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出租押金" prop="phone">
              <el-input size="small" v-model="form.deposit" placeholder="请输入出租押金" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆描述" prop="phone">
              <el-input size="small" v-model="form.description" placeholder="请输入车辆描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="图片上传" prop="carimg">
            <el-upload
              class="avatar-uploader"
              :action="'http://localhost:9999/car/uploadImg/' + form.carnumber"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              >
              <img v-if="form.carimg" :src="form.carimg" class="avatar" v-loading="loading">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
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
  import car from '@/api/car'

  export default {
    // 写核心代码
    data() {
      return {
        list: null, // 查询结果
        page: 1, // 当前页
        limit: 5, // 每页记录数
        total: 0, // 总记录数
        busCarQuery: {},
        form: {},
        dialogVisible: false,
        tableChecked: [], // 批量删除的数据
        title: '', // 对话框显示添加用户或修改用户
        imageUrl: '' // 图片地址
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.page = page
        car.list(this.page, this.limit, this.busCarQuery)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
            console.log(this.list)
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetData() {
        // 将表单中的数据清空
        this.busCarQuery = {}
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
            car.remove(id).then(response => {
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
        var ids = this.tableChecked.map(item => item.carnumber)
        car.removeBatch(ids).then(response => {
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
        this.title = '添加车辆'
        this.dialogVisible = true
      },
      // 编辑
      edit(id) {
        this.title = '修改车辆'
        // 弹出对话框
        this.dialogVisible = true
        // 根据用户身份证号查询用户信息
        car.getById(id).then(response => {
          this.form = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.dialogVisible = false;
        this.resetData()
      },
      submitForm() {
        if (this.title == '添加车辆' ) {
          car.add(this.form).then(response => {
            // 提示成功信息
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 关闭对话框
            this.dialogVisible = false
            // 表单信息清空
            this.resetData()
          })
            .catch(error => {
              // 提示成功信息
              this.$message({
                type: 'danger',
                message: '添加失败!'
              })
              // 表单信息清空
              this.resetData()
              console.log(error)
            })
        } else {
          car.edit(this.form).then(response => {
            // 提示成功信息
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 关闭对话框
            this.dialogVisible = false
            // 表单信息清空
            this.resetData()
          })
            .catch(error => {
              // 提示失败信息
              this.$message({
                type: 'danger',
                message: '修改失败!'
              })
              // 表单信息清空
              this.resetData()
              console.log(error)
            })
        }
      },
      handleAvatarSuccess(res, file) {
        this.form.carimg = res.data;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
