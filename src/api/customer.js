import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

export default {
  // 客户列表
  list(page, count, busCustomerQuery) {
    return request({
      url: `/customer/list/${page}/${count}`,
      method: 'post',
      data: busCustomerQuery
    })
  },

  // 根据ID查询客户信息
  getById(identity) {
    return request({
      url: `/customer/${identity}`,
      method: 'get'
    })
  },

  // 获取地区信息
  getRegions() {
    return request({
      url: `/customer/region/list`,
      method: 'get'
    })
  },

  // 添加客户
  add(busCustomer) {
    return request({
      url: `/customer`,
      method: 'post',
      data: busCustomer
    })
  },

  // 修改客户
  edit(busCustomer) {
    return request({
      url: `/customer`,
      method: 'put',
      data: busCustomer
    })
  },

  // 删除客户
  remove(identity) {
    return request({
      url: `/customer/${identity}`,
      method: 'delete'
    })
  },

  // 批量删除客户
  removeBatch(ids) {
    return request({
      url: `/customer/removeBatch`,
      method: 'delete',
      data: ids
    })
  },

  // 根据出租单号查询客户信息
  getByRentId(rentid) {
    return request({
      url: `/customer/rent/${rentid}`,
      method: 'get'
    })
  }
}
