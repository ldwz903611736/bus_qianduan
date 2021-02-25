<template>
  <div class="app-container">
    <el-divider content-position="left"><span>查询条件</span></el-divider>
    <el-form :model="menuQuery" ref="menuQuery" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="menuQuery.name"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="menuQuery.status" placeholder="菜单状态" clearable size="small">
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
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      :data="menuList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件路径" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? "正常" : "停用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>

          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.type">
                <el-radio :label=-1>目录</el-radio>
                <el-radio :label=1>菜单</el-radio>
                <el-radio :label=0>按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 0" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type == 1">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 0" label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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

  import menu from '@/api/menu'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { handleTree } from '../../utils/bus'

  export default {
    components: { Treeselect },
      data() {
        return {
          menuList: [],
          menuQuery: {},
          // 菜单树选项
          menuOptions: [],
          statusOptions: [
            {
              value: 1,
              label: "可用"
            },
            {
              value: 0,
              label: "停用"
            }
          ],
          form: {},
          open: false,
          title: "",
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
        // 表单重置
        reset() {
          this.form = {}
        },
        getList() {
          menu.list(this.menuQuery).then(response => {
            this.menuList = handleTree(response.data, "id")
          })
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
          this.reset();
          this.getTreeselect();
          menu.getMenu(row.id).then(response => {
            this.form = response.data;
            this.open = true;
            this.title = "修改菜单";
          });
        },
        /** 菜单查询 */
        handleQuery() {
          menu.list(this.menuQuery).then(response => {
            this.menuList = handleTree(response.data, "id")
          })
        },
        /** 重置表单 */
        resetQuery() {
          this.menuQuery = {}
          this.getList()
        },
        /** 新增菜单 */
        handleAdd(row) {
          this.reset()
          this.getTreeselect()
          if (row != null && row.id) {
            this.form.parentId = row.id;
          } else {
            this.form.parentId = 0;
          }
          this.open = true
          this.title = "添加菜单"
        },
        /** 取消按钮 */
        cancel() {
          this.open = false
          this.reset()
        },
        /** 添加或修改提交按钮 */
        submitForm() {
          if (this.form.id != undefined) {
            // 修改操作
          } else {
            // 添加操作
            menu.add(this.form).then(response => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.open = false
              this.getList()
            })
          }
        },
        /** 转换菜单数据结构 */
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.id,
            label: node.name,
            children: node.children
          };
        },
        /** 查询菜单下拉树结构 */
        getTreeselect() {
            menu.list(this.menuQuery).then(response => {
            this.menuOptions = [];
            const menu = { id: 0, name: '主类目', children: [] };
            menu.children = handleTree(response.data, "id");
            this.menuOptions.push(menu);
            console.log(this.menuOptions)
          });
        }
      }
  }

</script>
