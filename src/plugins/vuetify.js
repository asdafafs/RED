import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import rusLocale from '/node_modules/vuetify/es5/locale/ru.js'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {rusLocale,},
        current: 'ru'
    }
});
