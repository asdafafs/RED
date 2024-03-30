<template>
  <v-container fluid v-if="groupId !==0">
    <v-row>
      <v-col class="pa-0">
        <v-sheet tile height="54" class="d-flex justify-center">
          <v-btn icon class="ma-0  align-self-center" @click="prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title class="text-h6 align-self-center">{{ dateDay }}</v-toolbar-title>
          <v-btn icon class="ma-0  align-self-center" @click="next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet>
          <v-calendar
              style="overflow: hidden;"
              ref="cal"
              type="day"
              v-model="value"
              event-overlap-mode="stack"
              :events="all_events"
              color="white"
              event-color="white"
              mode="stack"
              class="day-calendar"
              @click:event="showEvent"
              :first-interval=6
              :interval-minutes=60
              :interval-count=18>
            <template v-slot:event="{event}">
              <div class="day-event " :class="getTableRowClass(event)">
                <div class="day  ">
                  {{ formatTime(event.start) }}
                </div>
                <div class="custom-info text-format-day">
                  {{ event.title }}
                </div>
              </div>
            </template>
          </v-calendar>
          <v-dialog v-model="selectedOpen" max-width="407px" persistent>
            <v-card class="rounded-xl"
                    :style="{ border: (selectedEvent.studentId === null && userId !== selectedEvent.studentId) ? '2px solid #4E7AEC' : '2px solid grey' }"
                    flat>
              <v-toolbar-title class="pa-3">
                <v-row>
                  <v-col class="flex-column">
                    <div class="text-caption text-medium-emphasis grey--text">СВЕДЕНИЯ О ЗАПИСИ</div>
                    <div class="text-lg-h4 font-weight-bold" v-if="selectedEvent.lectureType">Лекция</div>
                    <div class="text-lg-h4 font-weight-bold" v-else>Вождение</div>
                  </v-col>
                </v-row>
              </v-toolbar-title>
              <v-card-text class="pa-3 pt-0">
                <v-container class="">
                  <v-row class="">
                    <v-col class="flex-column pa-0 flex-wrap">
                      <div style="color: #4E7AEC">
                        {{ selectedEvent && selectedEvent.startTime ? selectedEvent.startTime.split('T')[0] : '' }}
                      </div>
                      <div class="text-lg-h5 font-weight-bold black--text">{{ formatTime(selectedEvent.startTime) }}
                        {{ ' - ' }} {{ formatTime(selectedEvent.endTime) }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis "
                           v-if="discriminatorUser && !selectedEvent.lectureType">Преподаватель
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis "
                           v-else>Тема лекции
                      </div>
                      <div class="text-subtitle-2 font-weight-regular black--text" v-if="discriminatorUser">{{
                          selectedEvent.title
                        }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis" v-if="!discriminatorUser">Студент</div>
                      <div class="text-subtitle-2 font-weight-regular black--text" v-if="!discriminatorUser">{{
                          studentTitle
                        }}
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis" v-if="discriminatorUser">Лимит часов</div>
                      <div v-if="discriminatorUser" class="black--text">Основные <span
                          style="color: #4E7AEC">({{ studentHours[1] }} из {{ studentHours[0] }})</span></div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="pa-0">
                <v-container class="pa-0" style="display: flex; justify-content: space-between;">
                  <v-btn text color="secondary" @click="closeEvent()">
                    Закрыть
                  </v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    value: moment().locale('ru').format('YYYY-MM-DD'),
    all_events: [],
    today_events: [],
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
    studentHours: 0,
  }),

  watch:{
    value(newValue) {
      this.confirmOnChangeMonthAndYear(newValue);
    }
  },

  updated() {
    this.classesSelectorsToRemove.forEach(item => {
      this.$refs.cal.$el.querySelectorAll(item).forEach(item => {
        item.remove();
      })
    })
    this.$refs.cal.checkChange()
  },

  mounted() {
    this.test = true
    this.prevMonthAndYear = this.getMonthAndYear(this.value);
  },

  created() {
    this.initialize()
  },

  computed: {
    ...mapState(['user']),

    userId() {
      return this.$store.state.user.userId;
    },

    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },

    groupId() {
      return this.user.groupId
    },

    studentTitle(){
      return `${this.$store.state.user.name} ${this.$store.state.user.surname} ${this.$store.state.user.middleName}`
    },
  },

  methods: {
    async confirmOnChangeMonthAndYear(newValue) {
      const currentMonthAndYear = this.getMonthAndYear(newValue);
      console.log(currentMonthAndYear)
      if (currentMonthAndYear !== this.prevMonthAndYear) {
        const groupId = this.groupId
        await this.getAllEvents(groupId);
        this.prevMonthAndYear = currentMonthAndYear;
      }
    },

    getMonthAndYear(dateString) {
      const [year, month] = dateString.split('-');
      return `${year}-${month}`;
    },

    closeEvent() {
      this.selectedOpen = false
    },

    initialize() {
      this.selectCurrentFreeStudent()
    },

    selectCurrentFreeStudent() {
      const student = new UsersRequest();
      student.getStudentNullGroup()
          .then(response => {
            const id = this.$store.state.user.userId;
            const students = response.data.students;
            const foundStudent = students.find(student => student.id === id);
            if (foundStudent) {
              console.log('Этого студента не найдено в списке свободных');
            } else {
              const groupId = this.groupId
              this.getAllEvents(groupId)
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
      const monthTime = `Date=${this.value}`
      await lessons.getLectureGroupId(groupId,monthTime).catch(x => console.log(x)).then(x => {
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
      const monthTime = `Date=${this.value}`
      await practices.getPracticeAssigned(monthTime).catch(x => console.log(x)).then(x => {
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
      this.all_events = [...lessons, ...practices];
      this.all_events = this.all_events.map(item => {
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

    getTableRowClass(event) {
      const classMap = {
        1: ' green-background',
        2: 'yellow-background',
        3: 'red-background',
        4: 'gray-background'
      };
      return classMap[event.lectureType] || 'free-practice';
    },

    prev() {
      this.$refs.cal.prev();
      this.currentDate = this.currentDate.clone().subtract(1, 'day');
      this.updateDateRange()

    },

    next() {
      this.$refs.cal.next();
      this.currentDate = this.currentDate.clone().add(1, 'day');
      this.updateDateRange()

    },

    updateDateRange() {
      this.dateDay = this.currentDate.clone().locale('ru').format('Do MMMM');
    },

  },
}
</script>

<style lang="scss">
@import "@/assets/styles/eventTypesStyles.css";

.day-event {
  display: flex;
  height: 100%;
  border-radius: 12px;
  align-items: center;

  padding: 15px;

  .day {
    display: flex;
    color: #000000;
    font-size: 40px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
    min-width: 120px;
    margin: 0px 0px 0px 0px;
  }

  .custom-info {
    font-size: 16px;
    color: #000000;
    padding-left: 8px;
    font-family: Roboto, sans-serif;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    white-space: normal;

    .teacher {
      font-family: Roboto, sans-serif;
      font-weight: normal;
      font-size: 12px;
    }

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
  max-height: inherit;
  max-width: 100%;
}
</style>