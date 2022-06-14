import { createRouter, createWebHashHistory } from 'vue-router'
import config from '../config.js'
const Login = () => import('../pages/Login')
const Chat = () => import('../pages/Chat')
const Contacts = () => import('../pages/Contacts')
const Groups = () => import('../pages/Groups')

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/groups',
    name: 'groups',
    component: Groups,
    meta: {
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})
export default router;

// Meta Handling
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem(config.TOKEN_KEY) == null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath }
      })
    }else{
      next()
    }
  }
});