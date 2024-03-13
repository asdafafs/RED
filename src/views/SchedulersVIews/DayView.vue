<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
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
                  {{ formatTime(data.event.start) }}
                </div>
                <div class="logo ">
                  <car-logo v-if="data.event.lectureType === 3"/>
                  <lecture-logo
                      v-if="data.event.lectureType !== 3"/>
                </div>
                <div class="custom-info text-format-day">
                  {{ data.event.title }}
                </div>
              </div>
            </template>
          </v-calendar>
          <v-menu
              max-width="200px" min-width="200px"
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
          >
            <v-card color="grey lighten-4" flat>
              <v-toolbar>
                <v-toolbar-title v-html="formatTime(selectedEvent.startTime)"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.title"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn textcolor="secondary" @click="selectedOpen = false">
                  Закрыть
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
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
import {mapState} from "vuex";
import UsersRequest from "@/services/UsersRequest";

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
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
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

  created() {
    this.initialize()
  },

  computed: {
    ...mapState(['user']),

    userId() {
      return this.$store.state.user.userId;
    }
  },

  methods: {
    initialize(){
      this.selectCurrentFreeStudent()
    },

    selectCurrentFreeStudent() {
      const student = new UsersRequest();
      student.getStudentNullGroup()
          .then(response => {
            const id = this.$store.state.user.userId;
            const students = response.data.students;
            const foundStudent = students.find(student => student.id === id);
            console.log('foundStudent', foundStudent)
            if (foundStudent) {
              console.log('Этого студента не найдено в списке свободных');
            } else {
              console.log('else')
              console.log(this.$store.state.user.groupId)
              const groupId = this.$store.state.user.groupId
              this.getAllEvents(groupId)

              console.log("2", id);
            }
          })
          .catch(error => {
            console.log("Ошибка при поиске студента:", error);
          });
    },

    showEvent({nativeEvent, event}) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },

    async getLessons(groupId) {
      const lessons = new EventsRequest()
      let cal
      await lessons.getLectureGroupId(groupId).catch(x => console.log(x)).then(x => {
        cal = x.data.lecture.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return cal
    },

    async getPractices() {
      const practices = new EventsRequest()
      let cal
      await practices.getPracticeAssigned().catch(x => console.log(x)).then(x => {
        cal = x.data.practice.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return cal
    },

    async getAllEvents(groupId) {
      const lessons = await this.getLessons(groupId);
      let practices = []
      practices = await this.getPractices();

      this.events = [...lessons, ...practices];
      this.events = this.events.map(item => {
        return {
          ...item,
          start: moment(item.start).format("YYYY-MM-DD HH:mm"),
          end: moment(item.end).format("YYYY-MM-DD HH:mm"),
        }
      })
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
    white-space: normal;

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

.text-format-day {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6em;
  max-width: inherit;
}
</style>