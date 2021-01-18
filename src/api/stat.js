import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

export default {
  // 客户地区统计
  getByCustomerRegion() {
    return request({
      url: `/stat/customerRegion`,
      method: 'get'
    })
  },

  // 客户地区性别统计
  getByCustomerRegionSex(region) {
    return request({
      url: `/stat/customerRegionSex/${region}`,
      method: 'get'
    })
  },

  // 业务员年度销售额
  getOpernameYearGrade(year) {
    return request({
      url: `/stat/opernameYearGrade/${year}`,
      method: 'get'
    })
  },

  // 公司年度月份销售额统计
  getCompanyYearGrade(year) {
    return request({
      url: `/stat/companyYearGrade/${year}`,
      method: 'get'
    })
  }


}
