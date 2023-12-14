import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationViews/MainView.vue";
import DayView from "@/views/SchedulersVIews/DayView.vue";
import MonthView from "@/views/SchedulersVIews/MonthView.vue";
import StudentPlanView from "@/views/SchedulersVIews/StudentPlanView.vue";
import WeeklyView from "@/views/SchedulersVIews/WeekView.vue";
import scheduleView from "@/views/SchedulersVIews/scheduleView.vue";
import MainCalendar from "@/views/SchedulersVIews/MainCalendar.vue";
import ProgressBar from "@/views/ProgressBar.vue";
import RecoveryPassword from "@/views/AuthorizationViews/RecoveryPassword.vue";
import MailAuthorization from "@/views/AuthorizationViews/MailAuthorization.vue";
import VkAuthorization from "@/views/AuthorizationViews/SelectAuthorization.vue";
import Registration from "@/views/AuthorizationViews/Registration.vue";
import PostLoginPage from "@/views/AuthorizationViews/PostLoginPage.vue";
import CoursesList from "@/views/CoursesList.vue";
import ConfirmEmail from "@/views/AuthorizationViews/ConfirmEmail.vue";
import ForgetPassword from "@/views/AuthorizationViews/ForgetPassword.vue";
import StudentsPanel from "@/views/AdminPanels/StudentsPanel.vue";
import TeachersPanel from "@/views/AdminPanels/TeachersPanel.vue";
import MainPanel from "@/views/AdminPanels/MainPanel.vue";


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'main',
        component: AuthorizationView,
        children: []
    },
    {
        path: '/mail',
        name: 'mail',
        component: MailAuthorization,
    },
    {
        path: '/vkAuthorization',
        name: 'vk',
        component: VkAuthorization,
    },
    {
        path: '/registration',
        name: 'registration',
        component: Registration,
    },
    {
        path: '/recoveryPassWord',
        name: 'recPass',
        component: RecoveryPassword,
        children: []
    },
    {
        path: '/post-login',
        name: 'post-login',
        component: PostLoginPage,
    },
    {
        path: '/confirm-email',
        name: 'ConfirmEmail',
        component: ConfirmEmail,
        // meta: {
        //     layout: 'System'
        // }
    },
    {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: ForgetPassword,
    },
    {
        path: '/admin',
        name: 'admin',
        component: MainPanel,
        children: [
            {
                path: 'students',
                name: 'students',
                component: StudentsPanel
            },
            {
                path: 'teachers',
                name: 'teachers',
                component: TeachersPanel
            },
        ]
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
        children: [
            {
                path: "mainCal",
                name: 'main',
                component: MainCalendar,
                children: [
                    {
                        path: "testDay",
                        name: 'day',
                        component: DayView,
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
        path: "/courses",
        name: 'courses',
        component: CoursesList,
    },

]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
