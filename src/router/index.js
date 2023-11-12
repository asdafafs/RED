import Vue from 'vue'
import VueRouter from 'vue-router'
import InstructorView from "@/views/InstructorView.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationView.vue";
import MainStudent from "@/views/MainStudent.vue";
import AndroidMain from "@/views/AndroidMain.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: AuthorizationView
  },
  {
    path: '/student',
    name: 'student',
    component: MainStudent
  },
  {
    path: '/instructor',
    name: 'instructor',
    component: InstructorView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFoundView
  },
  {
    path: '/android',
    name: 'android',
    component: AndroidMain
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
