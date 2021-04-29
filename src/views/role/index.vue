<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form :model="roleQuery" ref="roleQuery" :inline="true">
      <el-form-item label="角色名称" prop="rolename">
        <el-input
          v-model="roleQuery.rolename"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="available">
        <el-select
          v-model="roleQuery.available"
          placeholder="角色状态"
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="exportExcel"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="roleList" v-loading="loading">
      <el-table-column label="角色编号" align="center" prop="roleid"/>
      <el-table-column label="角色名称" align="center" prop="rolename"/>
      <el-table-column label="角色描述" align="center" prop="roledesc"/>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            :active-value=1
            :inactive-value=0
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pull-right"
                   :current-page="page"
                   :page-size="count"
                   :total="total"
                   background
                   layout="prev, pager, next"
                   @current-change="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.available">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.roledesc" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import role from '@/api/role'
  import menu from '../../api/menu'
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        loading: true,
        page: 1,
        count: 5,
        total: 0,
        open: false,
        roleList: [],
        // 选中数组
        ids: [],
        // 菜单列表
        menuOptions: [],
        menuExpand: false,
        menuNodeAll: false,
        roleQuery: {},
        form: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        value: '100',
        statusOptions: [
          {
            value: 1,
            label: '正常'
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
      /** 查询操作 */
      getList(page = 1) {
        this.loading = true
        this.page = page
        role.list(this.page, this.count, this.roleQuery).then(response => {
          this.total = response.data.total
          this.roleList = response.data.rows
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        role.list(this.page, this.count, this.roleQuery).then(response => {
          this.roleList = response.data.rows
        })
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.roleQuery = {}
        this.getList()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        menu.getTreeselect().then(response => {
          this.menuOptions = response.data
        })
        this.open = true
        this.title = '添加角色'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const roleId = row.roleid || this.ids
        const roleMenu = this.getRoleMenuTreeselect(roleId)
        role.getByRoleId(roleId).then(response => {
          this.form = response.data
          this.open = true
          this.$nextTick(() => {
            roleMenu.then(res => {
              this.$refs.menu.setCheckedKeys(res.data.checkedKeys)
            })
          })
          this.title = '修改角色'
        })
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.available === 1 ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.rolename + '"角色吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return role.changeStatus(row.roleid, row.available)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }).catch(function() {
          row.available = row.available === 1 ? 0 : 1
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const roleIds = row.roleid || this.ids
        this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return role.deleteRole(roleIds)
        }).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.roleid != undefined) {
          this.form.menuIds = this.getMenuAllCheckedKeys()
          role.updateRole(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.open = false
            this.getList()
          })
        } else {
          this.form.menuIds = this.getMenuAllCheckedKeys()
          role.addRole(this.form).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.open = false
            this.getList()
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'menu') {
          let treeList = this.menuOptions
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
          }
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'menu') {
          this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'menu') {
          this.form.menuCheckStrictly = value ? true : false
        }
      },
      // 所有菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys()
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
        return checkedKeys
      },
      /** 根据角色ID查询菜单树结构 */
      getRoleMenuTreeselect(roleId) {
        return menu.roleMenuTreeselect(roleId).then(response => {
          this.menuOptions = response.data.menus
          return response
        })
      },
      // 表单重置
      reset() {
        this.form = {}
      },
      exportExcel() {
        this.$confirm('是否确认导出所有操作角色数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            headers: {
              'Authorization': getToken()
            },
            url: `http://localhost:9999/role/export`,
            method: 'post',
            data: this.roleQuery,
            responseType: 'blob'
          }).then(response => {
            if (response.data.code >= 3001) {
              this.$message({
                type: 'danger',
                message: response.data.message
              })
            } else {
              const link = document.createElement('a')
              let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)

              link.setAttribute('download', '角色' + '.xlsx')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          })
        })
      }
    }
  }
</script>
