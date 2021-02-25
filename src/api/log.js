import request from '@/utils/request'

export default {
  getList(page, limit, operLogQuery) {
    return request({
      url: `/log/list/${page}/${limit}`,
      method: 'post',
      data: operLogQuery
    })
  },

  removeBatch(ids) {
    return request({
      url: `/log/removeBatch`,
      method: 'delete',
      data: ids
    })
  },

  clean() {
    return request({
      url: `/log/clean`,
      method: 'delete'
    })
  },

  export(sysOperLogQuery) {
    return request({
      url: `/log/clean`,
      method: 'post',
      data: sysOperLogQuery,
      responseType: 'blob'
    })
  }
}
