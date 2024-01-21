import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import rusLocale from 'vuetify/src/locale/ru.ts'
import testLocale from 'vuetify/src/locale/it.ts'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {rusLocale, testLocale},
        current: rusLocale,
    }
});
