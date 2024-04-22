import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import openNewPracticeDialogPlugin from "@/plugins/openNewPracticeDialogPlugin";
import reviewPracticeDialogPlugin from "@/plugins/reviewPracticeDialogPlugin";
import editPracticeDialogPlugin from "@/plugins/editPracticeDialogPlugin";
import deletePracticeDialogPlugin from "@/plugins/deletePracticeDialogPlugin";


Vue.config.productionTip = false

Vue.use(openNewPracticeDialogPlugin);
Vue.use(reviewPracticeDialogPlugin);
Vue.use(editPracticeDialogPlugin);
Vue.use(deletePracticeDialogPlugin);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
