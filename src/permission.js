import router, { test } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import Layout from '@/layout'
import menu from '@/api/menu'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

function in_array(str, arr, length) {
  for (var s = 0; s < length; s++) {
    if (str == arr[s]) {
      return true
    }
  }
  return false
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      menu.getRouters().then(response => {
        var getRoute = response.data
        console.log(getRoute)
        var len = router.options.routes.length
        for (var i = 0; i < len; i++) {
          if (in_array(router.options.routes[i].name, getRoute, getRoute.length)) {
            router.options.routes[i].hidden = false
          } else {
            router.options.routes[i].hidden = true
          }
          if (router.options.routes[i].children != null) {
            for (var j = 0; j < router.options.routes[i].children.length; j++) {
              if (in_array(router.options.routes[i].children[j].name, getRoute, getRoute.length)) {
                router.options.routes[i].children[j].hidden = false
              } else {
                router.options.routes[i].children[j].hidden = true
              }
            }
          }
        }
        next()
      })
      console.log(router.options.routes)
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
