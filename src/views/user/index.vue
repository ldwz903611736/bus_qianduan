<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form :model="userQuery" ref="userQuery" :inline="true">
      <el-form-item label="用户名称" prop="loginname">
        <el-input
          v-model="userQuery.loginname"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="userQuery.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="available">
        <el-select
          v-model="userQuery.available"
          placeholder="用户状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList"  @selection-change="handleSelectionChange">
      <el-table-column label="用户名称" align="center" prop="loginname"/>
      <el-table-column label="用户昵称" align="center" prop="realname"/>
      <el-table-column label="用户地址" align="center" prop="address" />
      <el-table-column label="用户职位" align="center" prop="position"/>
      <el-table-column label="手机号码" align="center" prop="phone" width="120" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            :active-value=1
            :inactive-value=0
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:user:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.userId !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:user:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="['system:user:resetPwd']"
          >重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="loginname">
              <el-input v-model="form.realname" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="identity">
              <el-input v-model="form.identity" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userid == undefined" label="用户名称" prop="loginname">
              <el-input v-model="form.loginname" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userid == undefined" label="用户密码" prop="pwd">
              <el-input v-model="form.pwd" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.available">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-input v-model="form.position" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import user from '@/api/user'
  import role from '@/api/role'

  export default {
    data() {
      return {
        page: 1,
        count: 5,
        userQuery: {},
        open: false,
        form: {},
        title: "",
        roleOptions: [],
        statusOptions: [
          {
            value: 1,
            label: '正常'
          },
          {
            value: 0,
            label: '停用'
          }
        ],
        userList: [],
        sexOptions: [
          {
            value: 0,
            label: '女'
          },
          {
            value: 1,
            label: '男'
          }
        ],
        statusOptions: [
          {
            value: 1,
            label: '可用'
          },
          {
            value: 0,
            label: '停用'
          }
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询用户 */
      getList() {
        user.list(this.page, this.count, this.userQuery).then(response => {
          this.userList = response.data.rows
        })
      },
      /** 重置 */
      reset() {
        this.form = {}
      },
      /** 新增按钮操作 */
      handleAdd() {
        role.getRoleList().then(response => {
          this.roleOptions = response.data
        })
        this.reset();
        this.open = true;
        this.title = "添加用户";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const userId = row.userid || this.ids;
        role.getRoleList().then(response => {
          this.roleOptions = response.data
        })
        user.getInfoById(userId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改用户";
          this.form.password = "";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.userid != undefined) {
          user.updateUser(this.form).then(response => {
            this.$message({
              type: "success",
              message: "修改成功"
            })
            this.open = false;
            this.getList();
          });
        } else {
          user.add(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.open = false;
            this.getList();
          });
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.userQuery = {}
        this.handleQuery();
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const userIds = row.userid || this.ids;
        this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return user.deleteById(userIds);
        }).then(() => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功"
          })
        })
      },
      /** 重置密码按钮操作 */
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.loginname + '"的新密码', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          user.resetUserPwd(row.userid, value).then(response => {
            this.$message({
              type: "success",
              message: "修改成功，新密码是:" + value
            })
          });
        }).catch(() => {});
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.available === 1 ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.loginname + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return user.changeUserStatus(row.userid, row.available);
        }).then(() => {
          this.$message({
            type: "success",
            message: text + "成功"
          })
        }).catch(function() {
          row.available = row.available === 1 ? 0 : 1;
        });
      },
    }
  }
</script>
