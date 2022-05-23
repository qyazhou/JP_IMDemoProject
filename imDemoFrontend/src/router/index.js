import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Main from '@/views/Main'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    }
  ]
})


// 挂载路由导航守卫,控制访问权限
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页，直接放行，next
  const tokenStr = window.localStorage.getItem('token')
  if (to.path === '/login') {
    return next()
  }
  // 用户不是访问登录页，获取浏览器sessionStroage中的token
  // 存在的的话，放行，
  // 不存在的话，跳转至登录页
  
  if (!tokenStr) {
    // 不存在
    // return next('/login')
    return next()
  } else {
    // 存在
    return next()
  }
})

export default router