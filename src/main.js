import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import openNewPracticeDialogPlugin from "@/plugins/openNewPracticeDialogPlugin";
import reviewPracticeDialogPlugin from "@/plugins/reviewPracticeDialogPlugin";
import deletePracticeDialogPlugin from "@/plugins/deletePracticeDialogPlugin";
import openNewStudentDialogPlugin from "@/plugins/openNewStudentDialogPlugin";
import openNewTeacherDialogPlugin from "@/plugins/openNewTeacherDialogPlugin";
import reviewLectureDialogPlugin from "@/plugins/reviewLectureDialogPlugin";
import openVKBotMessagePlugin from "@/plugins/openVKBotMessagePlugin";

Vue.config.productionTip = false

Vue.use(openNewPracticeDialogPlugin);
Vue.use(reviewPracticeDialogPlugin);
Vue.use(deletePracticeDialogPlugin);
Vue.use(openNewStudentDialogPlugin)
Vue.use(openNewTeacherDialogPlugin)
Vue.use(reviewLectureDialogPlugin)
Vue.use(openVKBotMessagePlugin)
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.prototype.validateLicense = () => {}
LicenseManager.prototype.isDisplayWatermark = () => {return false;}
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
