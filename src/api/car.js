import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

export default {
  // 车辆列表
  list(page, count, busCarQuery) {
    return request({
      url: `/car/list/${page}/${count}`,
      method: 'post',
      data: busCarQuery
    })
  },

  // 根据ID查询车辆信息
  getById(carnumber) {
    return request({
      url: `/car/${carnumber}`,
      method: 'get'
    })
  },

  // 查询所有未出租的车辆
  getNotRent(page, count) {
    return request({
      url: `/car/notRent/${page}/${count}`,
      method: 'get'
    })
  },

  // 添加车辆
  add(busCar) {
    return request({
      url: `/car`,
      method: 'post',
      data: busCar
    })
  },

  // 修改车辆
  edit(busCar) {
    return request({
      url: `/car`,
      method: 'put',
      data: busCar
    })
  },

  // 删除车辆
  remove(carnumber) {
    return request({
      url: `/car/${carnumber}`,
      method: 'delete'
    })
  },

  // 批量删除车辆
  removeBatch(ids) {
    return request({
      url: `/car/removeBatch`,
      method: 'delete',
      data: ids
    })
  },

  // 根据出租单号查询车辆信息
  getByRentId(rentid) {
    return request({
      url: `/car/rent/${rentid}`,
      method: 'get'
    })
  }
}
