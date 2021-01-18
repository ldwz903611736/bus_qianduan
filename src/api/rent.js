import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

export default {


  // 出租车辆
  rent(rentDTO) {
    return request({
      url: `/rent`,
      method: 'post',
      data: rentDTO
    })
  },

  // 出租单列表
  list(page, count, busRentQuery) {
    return request({
      url: `/rent/list/${page}/${count}`,
      method: 'post',
      data: busRentQuery
    })
  },

  // 根据ID查询车辆信息
  getById(rentid) {
    return request({
      url: `/rent/${rentid}`,
      method: 'get'
    })
  },

  // 修改出租单
  edit(busRent) {
    return request({
      url: `/rent`,
      method: 'put',
      data: busRent
    })
  },

  // 删除出租单
  remove(rentid) {
    return request({
      url: `/rent/${rentid}`,
      method: 'delete'
    })
  },

  // 查看具有销售记录的年份
  getYears() {
    return request({
      url: `/rent/year/list`,
      method: 'get'
    })
  }

}
