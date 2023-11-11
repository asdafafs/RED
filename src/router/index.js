import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import StudentView from "@/views/StudentView.vue";
import InstructorView from "@/views/InstructorView.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import HomeView from "@/views/HomeView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: HomeView
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView
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
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
