import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [
        {
        name: 'Лекция',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '11:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Вождение',
        start: new Date(2023, 10, 15, 3, 0),
        end: new Date(2023, 10, 15, 5, 0),
        startTime: '14:00',
        type: 'practice',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Лекция',
        start: new Date(2023, 10, 11, 3, 0),
        end: new Date(2023, 10, 11, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
                {
        name: 'Вождение',
        start: new Date(2023, 10, 23, 3, 0),
        end: new Date(2023, 10, 23, 5, 0),
        startTime: '14:00',
        type: 'practice',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Лекция',
        start: new Date(2023, 10, 24, 3, 0),
        end: new Date(2023, 10, 24, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      }
      ],
  },
  getters: {
  },
  mutations: {
    updateEvents(state, newEvents) {
    state.events = newEvents;
  },
  },
  actions: {
  },
  modules: {
  }
})
