import Vue from 'vue'
import VueRouter from 'vue-router'
import InstructorView from "@/views/InstructorView.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationView.vue";
import TestDaylyView from "@/views/TestDaylyView.vue";
import TestMonthView from "@/views/TestMonthView.vue";
import StudentPlanView from "@/views/StudentPlanView.vue";
import TestWeeklyView from "@/views/TestWeeklyView.vue";
import scheduleView from "@/views/scheduleView.vue";
import MainCalendar from "@/views/MainCalendar.vue";
import ProgressBar from "@/views/ProgressBar.vue";


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
                component: TestDaylyView,
              },
            {
              path: "testWeek",
              name: 'week',
              component: TestWeeklyView,
            },
            {
              path: "testMonth",
              name: 'month',
              component: TestMonthView,
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
        component: TestMonthView,
      },
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
