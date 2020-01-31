import Vue from 'vue'
import Router from 'vue-router'
import LogPage from './views/LogPage.vue'
import Home from './views/Home.vue'
import Signin from './views/Signin.vue'
import Reports from './views/Reports.vue'
import Logout from './views/Logout.vue'
import Protocols from './views/Protocols.vue'
import Trains from './views/Trains.vue'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/trains',
      name: 'trains',
      component: Trains
    },  
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/logpage',
      name: 'logpage',
      component: LogPage
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/protocols',
      name: 'protocols',
      component: Protocols
    },    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting    // this generates a separate chunk (about.[hash].js) for this route   // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
  , mode: 'history'
})
