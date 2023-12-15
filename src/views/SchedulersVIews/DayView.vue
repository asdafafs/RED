<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet tile height="54" class="d-flex justify-center">
          <v-btn icon class="ma-0  align-self-center" @click="prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="test" class="text-h6 align-self-center">{{ dateDay }}</v-toolbar-title>
          <v-btn icon class="ma-0  align-self-center" @click="next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet>
          <v-calendar
              v-model="focus"
              style="overflow: hidden;"
              ref="cal"
              type="day"
              event-overlap-mode="stack"
              :events="events"
              color="white"
              event-color="white"
              mode="stack"
              class="day-calendar"
          >
            <template v-slot:event="data">
              <div class="day-event">
                <div class="day">
                  {{ data.event.startTime }}
                </div>
                <div class="logo">
                  <car-logo v-if="data.event.type === 'practice'"/>
                  <lecture-logo v-if="data.event.type === 'lecture'"/>
                </div>
                <div class="custom-info">
                  {{ data.event.name }}
                  <div v-if="data.event.teacher" class="teacher text-wrap">
                    Преподаватель: {{ data.event.teacher }}
                  </div>
                </div>
              </div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LectureLogo from "@/components/logos/LectureLogo.vue";
import CarLogo from "@/components/logos/CarLogo.vue";
import moment from "moment";

export default {
  name: "ExampleDay.vue",
  components: {LectureLogo, CarLogo},
  data: () => ({
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
    focus: '',
    test: false,
    dateDay: moment().locale('ru').format('Do MMMM'),
    currentDate: moment(),
    classesSelectorsToRemove: [
      '.v-calendar-daily__interval-text',
      '.v-calendar-daily__interval',
      '.v-calendar-daily_head-day-label',
      '.v-calendar-daily_head-weekday',
      '.v-calendar-daily__day-interval',
      '.v-calendar-daily__intervals-body',
      '.v-calendar-daily_head-day'
    ],
    value: '2023-11-13',
    mode: 'stack',
  }),

  mounted() {
    this.classesSelectorsToRemove.forEach(item => {
      this.$refs.cal.$el.querySelectorAll(item).forEach(item => {
        item.remove();
      })
    })
    this.test = true
    this.$refs.cal.checkChange()
  },

  methods: {
    updateRange() {
    },

    prev() {
      this.$refs.cal.prev(1);
      this.currentDate = this.currentDate.clone().subtract(1, 'day');
      this.updateDateRange()
    },

    next() {
      this.$refs.cal.next(1);
      this.currentDate = this.currentDate.clone().add(1, 'day');
      this.updateDateRange()
    },

    updateDateRange() {
      this.dateDay = this.currentDate.clone().locale('ru').format('Do MMMM');
    }
  },
}
</script>

<style lang="scss">
.day-event {
  display: flex;
  height: 100%;
  background-color: #E9E9E8;
  border-radius: 12px;
  align-items: center;
  padding: 15px;

  .day {
    color: #000000;
    font-size: 40px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
  }

  .custom-info {
    font-size: 20px;
    color: #000000;
    padding-left: 8px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
    display: flex;
    flex-direction: column;

    .teacher {
      font-family: Roboto, sans-serif;
      font-weight: normal;
      font-size: 12px;
    }

  }

  .logo {
    padding-left: 22px;
  }
}

.day-calendar {
  :only-child {
    .theme--light.v-calendar-daily .v-calendar-daily__day-interval {
      border-top: #e0e0e0 0;
    }

    .theme--light.v-calendar-daily {
      border-top: none;
    }
  }

  border-top: none;
}

.v-calendar-daily__scroll-area {
  overflow-y: hidden;
}

.theme--light.v-calendar-daily .v-calendar-daily__day-interval {
  border-top: #e0e0e0 0;
}
</style>