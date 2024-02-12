import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationViews/MainView.vue";
import DayView from "@/views/SchedulersVIews/DayView.vue";
import MonthView from "@/views/SchedulersVIews/MonthView.vue";
import StudentPlanView from "@/views/SchedulersVIews/StudentPlanView.vue";
import WeeklyView from "@/views/SchedulersVIews/WeekView.vue";
import scheduleView from "@/views/SchedulersVIews/ScheduleView.vue";
import MainCalendar from "@/views/SchedulersVIews/MainCalendar.vue";
import ProgressBar from "@/views/ProgressBar.vue";
import RecoveryPassword from "@/views/AuthorizationViews/RecoveryPassword.vue";
import MailAuthorization from "@/views/AuthorizationViews/MailAuthorization.vue";
import VkAuthorization from "@/views/AuthorizationViews/SelectAuthorization.vue";
import PostLoginPage from "@/views/AuthorizationViews/PostLoginPage.vue";
import ConfirmEmail from "@/views/AuthorizationViews/ConfirmEmail.vue";
import ForgetPassword from "@/views/AuthorizationViews/ForgetPassword.vue";
import StudentsPanel from "@/views/AdminPanels/StudentsPanel.vue";
import TeachersPanel from "@/views/AdminPanels/TeachersPanel.vue";
import MainPanel from "@/views/AdminPanels/MainPanel.vue";
import TestTest from "@/views/SchedulersVIews/TestTest.vue";
import MonthViewSchedule from "@/views/SchedulersVIews/MonthViewSchedule.vue";
import GroupPanel from "@/views/AdminPanels/GroupPanel.vue";
import ScheduleClasses from "@/views/SignUpClasses/ScheduleClasses.vue";
import ClassesView from "@/views/SignUpClasses/ClassesView.vue";
import Test from "@/views/Test";
import InstructorsPlanTemplate from "@/views/AdminPanels/InstructorsPlanTemplate.vue";


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
        path: '/recoveryPassWord',
        name: 'recPass',
        component: RecoveryPassword,
    },
    {
        path: '/post-login',
        name: 'post-login',
        component: PostLoginPage,
    },
    {
        path: '/confirm-email',
        name: 'confirm-email',
        component: ConfirmEmail,
    },
    {
        path: '/forget-password',
        name: 'forget-password',
        component: ForgetPassword,
    },
    {
        path: '/admin',
        name: 'admin',
        component: MainPanel,
        children: [
            {
                path: 'students',
                name: 'admin-students',
                component: StudentsPanel
            },
            {
                path: 'teachers',
                name: 'admin-teachers',
                component: TeachersPanel,
                children: []
            },
            {
                path: 'groups',
                name: 'admin-groups',
                component: GroupPanel,
            },
            {
                path: 'template/:name/:surname/:middleName',
                name: 'plan-template',
                component: InstructorsPlanTemplate,
                props: true,
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
                name: 'plan-main',
                component: MainCalendar,
                children: [
                    {
                        path: "testDay",
                        name: 'plan-main-day',
                        component: DayView,
                    },
                    {
                        path: "testWeek",
                        name: 'plan-main-week',
                        component: WeeklyView,
                    },
                    {
                        path: "testMonth",
                        name: 'plan-main-month',
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
                path: "lessons",
                name: 'schedule-lessons',
                component: MonthViewSchedule,
            },
        ]
    },
    {
        path: "/singUpClasses",
        name: 'singUpClasses',
        component: ScheduleClasses,
        children: [
            {
                path: "schedule-lessons",
                name: 'singUpClasses-month',
                component: ClassesView,

            },
        ]
    },
    {
        path: "/test",
        name: "test",
        component: TestTest
    },
    {
        path: '/test-kal',
        name: 'test-kal',
        component: Test
    },


]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
