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
                  {{ data.event.start }}
                </div>
                <div class="logo ">
                  <car-logo v-if="data.event.lectureType === 3"/>
                  <lecture-logo
                      v-if="data.event.lectureType !== 3"/>
                </div>
                <div class="custom-info">
                  {{ data.event.title }}
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
import EventsRequest from "@/services/EventsRequest";

export default {
  name: "ExampleDay.vue",
  components: {LectureLogo, CarLogo},
  data: () => ({
    events: [],
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
    value: '2023-12-13',
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
    this.getAllEvents()

  },

  methods: {
    async getLessons() {
      const lessons = new EventsRequest()
      await lessons.getLecture().catch(x => console.log(x)).then(x => {
        this.events = x.data.lecture.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return this.events
    },

    async getPractices() {
      const practices = new EventsRequest()
      await practices.getPractice().catch(x => console.log(x)).then(x => {
        this.events = x.data.practice.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return this.events
    },

    async getAllEvents() {
      const lessons = await this.getLessons();
      const practices = await this.getPractices();

      // console.log('Lessons:', lessons);
      // console.log('Practices:', practices);

      this.events = [...lessons, ...practices];

      console.log('Combined Events:', this.events);
    },

    formatTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    getEventColor(event) {
      if (event.lectureType === 3) {
        return '#9DB9FF';
      } else if (event.lectureType === 2) {
        return '#E9E9E8';
      } else {
        return '#E9E9E8'
      }
    },

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