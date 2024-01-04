import Vue from 'vue'
import Vuex from 'vuex'
import {AlertStore} from "@/store/Alert/AlertStore";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {AlertStore},
    state: {
        user: {
            userId: 1,
            email: '',
            emailConfirmed: false,
            phoneNumber: '',
            name: '1',
            surname: '',
            middleName: '',
            discriminator: ''
        }
    },
    mutations: {
        SET_CURRENT_USER(state, user) {
            state.user.name = user.data['name']
            state.user.userId = user.data['id']
            state.user.email = user.data['email']
            state.user.phoneNumber = user.data['phoneNumber']
            state.user.surname = user.data['surname']
            state.user.middleName = user.data['middleName']
            state.user.discriminator = user.data['discriminator']
        }
    },
    actions: {
        async GET_CURRENT_USER({commit}, data) {
            try {
                commit('SET_CURRENT_USER', data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    },
    getters: {
        userName: state => state.user ? `${state.user.name} ${state.user.surname}` : '',
        name: state => state.user.name
    }
})
