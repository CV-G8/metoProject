import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '/',
    name: 'gis',
    component: () => import('../views/gisPage.vue')
  },
  {
    path: '/numModel',
    name: 'numModel',
    component: () => import('../views/numModelPage.vue')
  },
]

const router = new VueRouter({
  mode:"hash", //'history',
  base: process.env.BASE_URL,
  routes
})

export default router
