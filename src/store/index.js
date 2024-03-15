import Vue from 'vue'
import Vuex from 'vuex'
import {AlertStore} from "@/store/Alert/AlertStore";
import IdentityRequest from "@/services/IdentityRequest";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {AlertStore},
    state: {
        user: {
            userId: null,
            email: '',
            emailConfirmed: false,
            phoneNumber: '',
            name: '1',
            surname: '',
            middleName: '',
            discriminator: '',
            groupId: 0,
            vkUserId: 0,
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
            state.user.groupId = user.data['groupId']
            state.user.vkUserId = user.data['vkUserId']
        },
        RESET_CURRENT_USER(state) {
            state.user = {
                userId: null,
                email: '',
                emailConfirmed: false,
                phoneNumber: '',
                name: '1',
                surname: '',
                middleName: '',
                discriminator: '',
                groupId: 0,
                vkUserId: 0,
            }
        }
    },
    actions: {
        async GET_CURRENT_USER({commit}, data) {
            try {
                commit('SET_CURRENT_USER', data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        },
        async LOGOUT({commit}, payload) {
            const user = new IdentityRequest()
            await user.postLogout({})
            commit('RESET_CURRENT_USER')
        }
    },
    getters: {
        userName: state => state.user ? `${state.user.name} ${state.user.surname}` : '',
        name: state => state.user.name
    }
})
