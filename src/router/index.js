import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'check',
    component: () => import('../views/check/Login/Login'),
  },
  {
    path: '/',
    name: 'check',
    component: () => import('../views/check/Layout.vue'),
    children: [
      {
        path: '/sales',
        name: 'sales',
        component: () => import('../views/check/Sales/index.vue'),
      },
      {
        path: '/shipment',
        name: 'shipment',
        component: () => import('../views/check/Sales/Shipment.vue'),
      },
      {
        path: '/salesDetail',
        name: 'salesDetail',
        component: () => import('../views/check/Sales/SalesDetail.vue'),
      },
      {
        path: '/salesLog',
        name: 'salesLog',
        component: () => import('../views/check/Sales/SalesLog.vue'),
      },
      {
        path: '/restore',
        name: 'restore',
        component: () => import('../views/check/Restore/index.vue'),
      },
      {
        path: '/restoreLog',
        name: 'restoreLog',
        component: () => import('../views/check/Restore/restoreLog.vue'),
      },
      {
        path: '/cancelRestoreLog',
        name: 'cancelRestoreLog',
        component: () => import('../views/check/Restore/cancelRestoreLog.vue'),
      },
      {
        path: '/cancelRestore',
        name: 'cancelRestore',
        component: () => import('../views/check/Restore/cancelRestore.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'scale',
    component: () => import('../views/scale/layout.vue'),
    children: [
      {
        path: '/slogin',
        name: 'scaleLogin',
        component: () => import('../views/scale/login.vue'),
      },
      {
        path: '/scale',
        name: 'scaleMain',
        component: () => import('../views/scale/index.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  let verify = false;
  const token = sessionStorage.getItem('token')
  if(token === '200'){
    verify = true
  }
  //第一步:用Token判斷
  if (verify) {
    console.log(1)
    next()
  } else  {
    //第二步:判斷要去的頁面是不是check
    //不是check
    if (to.name !== 'check') {
      console.log(2)
      next('/')
      //是check
    } else {
      console.log(3)
      next()
    }
  }
  // const user = sessionStorage.getItem('username')
  // const token = sessionStorage.getItem('token')
  // console.log(user)
  // console.log(token)
  // if (to.path !== '/') {
  //   // router會跑兩次，第一次是因為從網址進來會跑一次，第二次到forgetPwd頁面時還會再跑一次
  //   // 第一次網址進來的時候如果有query.token先存進sessionStorage
  //   if (to.query.token) { //第二次進來就不會有to.query.token
  //     sessionStorage.setItem('queryToken', to.query.token)
  //     sessionStorage.setItem('resetPwdToken', to.query.token)
  //   } else {
  //     if (user !== null && token !== null) { //如果有登入後就不能再去/forgetPwd，網址有帶token還是可以進
  //       next()
  //     } else if (sessionStorage.getItem('queryToken')) { //判斷如果有queryToken就去/forgetPwd
  //       sessionStorage.removeItem('queryToken') //清除sessionStorage，防止去其他頁面時再跑到這裡
  //       next()
  //     } else {
  //       next({name: '/'})
  //     }
  //   }
  // } else if (to.path === '/' && token !== null) {
  //   next({ name: '/' })
  // } else {
  //   next()
  // }
})

export default router
