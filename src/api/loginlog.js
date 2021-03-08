import request from '@/utils/request'

export default {
  getList(page, limit, loginLogQuery) {
    return request({
      url: `/loginLog/list/${page}/${limit}`,
      method: 'post',
      data: loginLogQuery
    })
  },

  removeBatch(ids) {
    return request({
      url: `/loginLog/removeBatch`,
      method: 'delete',
      data: ids
    })
  },

  clean() {
    return request({
      url: `/loginLog/clean`,
      method: 'delete'
    })
  },

  export(loginLogQuery) {
    return request({
      url: `/loginLog/clean`,
      method: 'post',
      data: loginLogQuery,
      responseType: 'blob'
    })
  }
}
