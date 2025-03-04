import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFoundView from "@/views/NotFoundView.vue";
import AuthorizationView from "@/views/AuthorizationViews/MainView.vue";
import StudentPlanView from "@/views/SchedulersVIews/StudentPlanView.vue";
import scheduleView from "@/views/SchedulersVIews/ScheduleView.vue";
import ProgressBar from "@/views/SchedulersVIews/ProgressBar.vue";
import RecoveryPassword from "@/views/AuthorizationViews/RecoveryPassword.vue";
import MailAuthorization from "@/views/AuthorizationViews/MailAuthorization.vue";
import PostLoginPage from "@/views/AuthorizationViews/PostLoginPage.vue";
import ConfirmEmail from "@/views/AuthorizationViews/ConfirmEmail.vue";
import ForgetPassword from "@/views/AuthorizationViews/ForgetPassword.vue";
import StudentsPanel from "@/views/AdminPanels/StudentsPanel.vue";
import TeachersPanel from "@/views/AdminPanels/TeachersPanel.vue";
import MainPanel from "@/views/AdminPanels/MainPanel.vue";
import MonthViewSchedule from "@/views/SchedulersVIews/MonthViewSchedule.vue";
import GroupPanel from "@/views/AdminPanels/GroupPanel.vue";
import ScheduleClasses from "@/views/SignUpClasses/ScheduleClasses.vue";
import ClassesView from "@/views/SignUpClasses/ClassesView.vue";
import InstructorsPlanTemplate from "@/views/AdminPanels/InstructorsPlanTemplate.vue";
import Item from "@/views/AdminPanels/GroupTemplate.vue";
import AcceptPassword from "@/views/AuthorizationViews/AcceptPassword.vue";
import PostAuthorizationVkPage from "@/views/AuthorizationViews/PostAuthorizationVkPage.vue";
import AnalyticsPanel from "@/views/AdminPanels/AnalyticsPanel.vue";


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'main',
        component: AuthorizationView,
    },
    {
        path: '/mail',
        name: 'mail',
        component: MailAuthorization,
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
        path: '/post-vkLogin',
        name: 'post-vk-login',
        component: PostAuthorizationVkPage,
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
        path: '/accept-password',
        name: 'accept-password',
        component: AcceptPassword
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
            },
            {
                path: 'groups',
                name: 'admin-groups',
                component: GroupPanel,
            },
            {
                path: 'analytics',
                name: 'admin-analytics',
                component:AnalyticsPanel,
            },
            {
                path: 'groupItem/:selectedGroupID',
                name: 'groupItem',
                component: Item,
                props: true,
            },
            {
                path: 'template/:selectedUserID',
                name: 'plan-template',
                component: InstructorsPlanTemplate,
                props: true,
            },

        ]
    },
    {
        path: "/testPlan",
        name: 'plan',
        component: StudentPlanView,
        children: [
            {
                path: 'progressBar/:currentStudentID',
                name: 'progressBar',
                component: ProgressBar,
                props: true,
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
        path: '*',
        name: 'notFound',
        component: NotFoundView,
    },

]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
