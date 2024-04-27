import vuetify from '@/plugins/vuetify';
import LocalVue from 'vue';
import router from '@/router';
import reviewLectureDialog from "@/dialogs/reviewLectureDialog.vue";

export default {
    install(Vue) {
        Vue.prototype.$reviewLectureDialogPlugin = (data) => {
            return new Promise(((resolve) => {
                const on = {
                    destroy: undefined
                };
                const props = {data};
                const component = new LocalVue({
                    vuetify,
                    router,
                    render: (createElement) => createElement(reviewLectureDialog, {props, on}),
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