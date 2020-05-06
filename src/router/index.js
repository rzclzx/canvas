import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: resolve => require(['@/pages/trade/index'], resolve)
    },
    {
      path: '/CookiePathTest',
      name: 'CookiePathTest',
      component: resolve => require(['@/pages/CookiePathTest/index'], resolve)
    },
    {
      path: '/canvas/:id',
      name: 'canvas',
      component: resolve => require(['@/pages/canvas/index'], resolve)
    }
  ]
})