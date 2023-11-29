import Vue from 'vue'
import VueRouter from 'vue-router'
import InstructorView from "@/views/InstructorView.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationView.vue";
import DaylyView from "@/views/DaylyView.vue";
import MonthView from "@/views/MonthView.vue";
import StudentPlanView from "@/views/StudentPlanView.vue";
import WeeklyView from "@/views/WeeklyView.vue";
import scheduleView from "@/views/scheduleView.vue";
import MainCalendar from "@/views/MainCalendar.vue";
import ProgressBar from "@/views/ProgressBar.vue";
import TestTest from "@/views/TestTest.vue";
import PhoneAuthorization from "@/views/PhoneAuthorization.vue";
import RecoveryPassword from "@/views/RecoveryPassword.vue";
import MailAuthorization from "@/views/MailAuthorization.vue";
import VkAuthorization from "@/views/VkAuthorization.vue";
import Registration from "@/views/Registration.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: AuthorizationView,
    children: [
    ]
  },
{
    path:'/mail',
    name: 'mail',
    component: MailAuthorization
  },
  {
    path: '/vkAuthorization',
    name: 'vk',
    component: VkAuthorization
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/recoveryPassWord',
    name: 'recPass',
    component: RecoveryPassword
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
    path: "/testPlan",
    name: 'plan',
    component: StudentPlanView,
    children:[
        {
          path: "mainCal",
          name: 'main',
          component: MainCalendar,
          children:[
              {
                path: "testDay",
                name: 'day',
                component: DaylyView,
              },
            {
              path: "testWeek",
              name: 'week',
              component: WeeklyView,
            },
            {
              path: "testMonth",
              name: 'month',
              component: MonthView,
            },
          ]
        },
      {
        path: 'progress',
        name: 'progress',
        component: ProgressBar,
      }
    ]
  },
  {
    path: "/schedule",
    name: 'schedule',
    component: scheduleView,
    children: [
        {
        path: "testMonth",
        name: 'month',
        component: MonthView,
      },
    ]
  },
  {
    path: "/test",
    component: TestTest
  },
  {
    path: '/phone',
    component: PhoneAuthorization
  },
  {
    path: '/recovery',
    component: RecoveryPassword
  }

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
