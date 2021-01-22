import request from '@/utils/request'

export default {
  // 查询菜单列表
  list(page, count, RoleQuery) {
    return request({
      url: `/role/list/${page}/${count}`,
      method: 'post',
      data: RoleQuery
    })
  },

  // 根据角色id查询角色
  getByRoleId(roleid) {
    return request({
      url: `/role/${roleid}`,
      method: 'get',
    })
  },

  // 添加角色
  addRole(SysRole) {
    return request({
      url: `/role`,
      method: 'post',
      data: SysRole
    })
  },

  // 更新角色
  updateRole(SysRole) {
    return request({
      url: `/role`,
      method: 'put',
      data: SysRole
    })
  },

  // 删除角色
  deleteRole(roleid) {
    return request({
      url: `/role/${roleid}`,
      method: 'delete'
    })
  },

  // 修改角色状态
  changeStatus(roleid, available) {
    const data = {
      roleid,
      available
    }
    return request({
      url: `/role/changeStatus`,
      method: 'put',
      data: data
    })
  },

  getRoleList() {
    return request({
      url: `/role/roleList`,
      method: 'get'
    })
  }
}
