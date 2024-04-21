import vuetify from '@/plugins/vuetify';
import LocalVue from 'vue';
import router from '@/router';
import openNewPracticeDialog from '../dialogs/openNewPracticeDialog.vue'
export default {
    install(Vue) {
        Vue.prototype.$openNewPracticeDialogPlugin = () => {
            return new Promise(((resolve) => {
                const on = {
                    destroy: undefined
                };
                const props = {};
                const component = new LocalVue({
                    vuetify,
                    router,
                    render: (createElement) => createElement(openNewPracticeDialog, {props, on}),
                });
                on.destroy = (isCancel) => {
                    isCancel ? resolve(isCancel) : resolve();
                    document.getElementById('app').removeChild(component.$el);
                    component.$destroy();
                };
                component.$mount();
                document.getElementById('app').appendChild(component.$el);
            }));
        };
    },
};