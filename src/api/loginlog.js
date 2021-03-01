import request from '@/utils/request'

export default {
  getList(page, limit, loginLogQuery) {
    return request({
      url: `/loginlog/list/${page}/${limit}`,
      method: 'post',
      data: loginLogQuery
    })
  },

  removeBatch(ids) {
    return request({
      url: `/loginlog/removeBatch`,
      method: 'delete',
      data: ids
    })
  },

  clean() {
    return request({
      url: `/loginlog/clean`,
      method: 'delete'
    })
  },

  export(loginLogQuery) {
    return request({
      url: `/loginlog/clean`,
      method: 'post',
      data: loginLogQuery,
      responseType: 'blob'
    })
  }
}
