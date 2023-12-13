import Vue from 'vue'
import Vuex from 'vuex'
import IdentityRequest from "@/services/IdentityRequest";
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userId: 1,
        VkUserId: 1,
        email: '',
        emailConfirmed: false,
        phoneNumber: '',
        name: '',
        surname: '',
        middleName: '',
    },
    mutations: {
        SET_CURRENT_USER(state, user) {
            state.user = user;
        }
    },
    actions: {
        async GET_CURRENT_USER({ commit }) {
            try {
                const response = new IdentityRequest()
                const user =  await response.getIdentity().data;
                commit('SET_CURRENT_USER', user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    },
    getters: {
        userName: state => state.user ? `${state.user.name} ${state.user.surname}` : '',
    }
})
