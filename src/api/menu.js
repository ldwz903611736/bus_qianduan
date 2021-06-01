import request from '@/utils/request'

export default {
  // 查询菜单列表
  list(MenuQuery) {
    return request({
      url: `/menu/list`,
      method: 'post',
      data: MenuQuery
    })
  },

  // 根据菜单id查询菜单
  getMenu(id) {
    return request({
      url: `/menu/${id}`,
      method: 'get'
    })
  },

  // 添加菜单
  add(SysMenu) {
    return request({
      url: `/menu`,
      method: 'post',
      data: SysMenu
    })
  },

  // 修改菜单
  update(SysMenu) {
    return request({
      url: '/menu',
      method: 'put',
      data: SysMenu
    })
  },

  // 查询菜单下拉树结构
  getTreeselect() {
    return request({
      url: `/menu/treeselect`,
      method: 'get'
    })
  },

  // 根据角色ID查询菜单下拉树结构
  roleMenuTreeselect(roleId) {
    return request({
      url: '/menu/roleMenuTreeselect/' + roleId,
      method: 'get'
    })
  },

  // // 获取当前用户的菜单
  // getCurrentUserMenu() {
  //   return request({
  //     url: 'menu/currentUser',
  //     method: 'get'
  //   })
  // },

  // 删除菜单
  removeById(id) {
    return request({
      url: `/menu/${id}`,
      method: 'delete'
    })
  },

  // 获取路由
  getRouters() {
    return request({
      url: 'menu/getRouters',
      method: 'get'
    })
  }
}
