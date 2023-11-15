import Vue from 'vue'
import VueRouter from 'vue-router'
import InstructorView from "@/views/InstructorView.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationView.vue";
// eslint-disable-next-line no-unused-vars
import TestDaylyView from "@/views/TestDaylyView.vue";
import TestMonthView from "@/views/TestMonthView.vue";
import StudentPlanView from "@/views/StudentPlanView.vue";
import TestWeeklyView from "@/views/TestWeeklyView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: AuthorizationView,
  },
  {
    path: '/instructor',
    name: 'instructor',
    component: InstructorView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFoundView,
  },
  {
    path: "/test",
    name: 'test',
    component: TestMonthView,
  },
  {
    path: "/testPlan",
    name: 'plan',
    component: StudentPlanView,
  },
  {
    path: "/testWeek",
    name: 'week',
    component: TestWeeklyView,
  }

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
