<template>
  <v-container fluid v-if="groupId !==0">
    <v-row>
      <v-row class="justify-center">
        <v-btn icon class="ma-0  align-self-center" @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="d-flex flex-row justify-space-between align-center col-lg-2 col-md-4 col-sm-8 col-9">
          <div class="col-5 text-center pa-0">
            <div class="grey--text">понедельник
            </div>
            <div class="text-h6 " v-if="test">
              {{ dateMonday }}
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-divider class="mx-0 col-1 align-center pa-0 ma-0"></v-divider>
          <v-spacer></v-spacer>
          <div class="col-5 text-center pa-0">
            <div class="grey--text">
              воскресенье
            </div>
            <div class="text-h6" v-if="test">
              {{ dateSunday }}
            </div>
          </div>
        </div>
        <v-btn icon class="ma-0  align-self-center" @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="value"
              :events="events"
              type="week"
              :weekdays="weekday"
              @click:event="showEvent"
              :event-ripple="false"
              :hide-header=false
              :first-interval=6
              :interval-minutes=60
              :interval-count=18
          >
            <template v-slot:event="{event}">
              <v-container class="pa-0 mx-0 d-flex fill-height" fluid :class="getTableRowClass(event)"
                           style="align-items: flex-start;">
                <v-row class="ma-0 " fill v-if="$vuetify.breakpoint.lgAndUp">
                  <v-col cols="4" class="black--text pa-0 ">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.start) }}</div>
                  </v-col>
                  <v-col cols="6" class="black--text pa-0 ">
                    <div class="font-weight-bold text-format-week">{{ event.title }}</div>
                  </v-col>
                </v-row>
                <v-row class="ma-0 d-lg-none fill-height" fill>
                  <v-col class="d-lg-none pa-0 black--text align-self-center text-center" fill>
                    <div class="font-weight-bold text-format-week ">{{ formatTime(event.start) }}</div>
                  </v-col>
                </v-row>
              </v-container>
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
import moment from 'moment';
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import EventsRequest from "@/services/EventsRequest";
import {mapState} from "vuex";
import UsersRequest from "@/services/UsersRequest";

export default {
  components: {CarLogo, LectureLogo},
  watch: {
    events() {
    },

    value(newValue) {
      this.confirmOnChangeMonthAndYear(newValue);
    }
  },
  mounted() {
    const buttonStyleReplace = [
      'v-btn',
      'v-btn--fab',
      'v-btn--has-bg',
      'v-btn--round',
      'theme--light',
      'v-size--small',
      'transparent',
    ]
    this.$refs.calendar.$el
        .querySelectorAll('.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--light.v-size--default.primary')
        .forEach(item => {
          item.classList = '';
          buttonStyleReplace.forEach(x => {
            item.classList.toggle(x)
          })
        });
    this.test = true
    this.prevMonthAndYear = this.getMonthAndYear(this.value);
  },

  data: () => ({
    events: [],
    currentDate: moment(),
    value: new Date().toISOString().substr(0, 7) + '-01',
    weekday: [1, 2, 3, 4, 5, 6, 0],
    today: new Date(),
    test: false,
    dateMonday: moment().subtract(0, 'weeks').startOf('isoWeek').format('DD'),
    dateSunday: moment().subtract(0, 'weeks').endOf('isoWeek').format('DD'),
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dragEvent: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    studentHours: 0,
  }),

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

    studentTitle() {
      return `${this.$store.state.user.name} ${this.$store.state.user.surname} ${this.$store.state.user.middleName}`
    },
  },

  methods: {
    async confirmOnChangeMonthAndYear(newValue) {
      const currentMonthAndYear = this.getMonthAndYear(newValue);
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
            const id = this.userId;
            const students = response.data.students;
            const foundStudent = students.find(student => student.id === id);
            console.log('foundStudent', foundStudent)
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
      let kal
      const monthTime = `Date=${this.value}`
      await lessons.getLectureGroupId(groupId, monthTime).catch(x => console.log(x)).then(x => {
        kal = x.data.lecture.map(event => ({
          ...event,
          start: event.startTime,
          end: event.endTime
        }));
      })
      return kal
    },

    async getPractices() {
      const practices = new EventsRequest()
      let kal
      const monthTime = `Date=${this.value}`
      await practices.getPracticeAssigned(monthTime).catch(x => console.log(x)).then(x => {
        kal = x.data.practice.map(event => ({
          ...event,
          start: event.startTime,
          end: event.endTime
        }));
      })
      return kal
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
    prev() {
      this.$refs.calendar.prev(1);
      this.currentDate = this.currentDate.clone().subtract(1, 'week');
      this.updateDateRange()
    },

    next() {
      this.$refs.calendar.next(1);
      this.currentDate = this.currentDate.clone().add(1, 'week');
      this.updateDateRange()
    },

    updateDateRange() {
      this.dateMonday = this.currentDate.clone().startOf('isoWeek').format('DD');
      this.dateSunday = this.currentDate.clone().endOf('isoWeek').format('DD');
    },

    getTableRowClass(event) {
      const classMap = {
        1: ' green-background',
        2: 'yellow-background',
        3: 'red-background',
        4: 'gray-background'
      };
      console.log(classMap[event.lectureType] || 'free-practice')
      return classMap[event.lectureType] || 'free-practice';
    },

    startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        this.createEvent = {
          activeUserId: 1,
          title: `Новый урок`,
          start: this.createStart,
          end: this.createStart,
          student: null,
          timed: true,
        }
        this.events.push(this.createEvent)
      }
    },

    roundTime(time, down = true) {
      const roundTo = 15
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },

    toTime(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
  },

}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/eventTypesStyles.css";

.v-calendar .v-event-timed {
  white-space: pre-wrap;
  width: 100%;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0 0 0 5px;
}

.v-event-more {
  font-size: 1em !important;
}

.app-bar-button-style {
  text-transform: unset !important;
  font-size: 1.5em;
}

.v-calendar-daily__interval-text {
  color: #424242;
  font-size: 19px;
  font-weight: bold;
}

@media screen and (max-width: 1260px) {
  .v-calendar-daily__interval-text {
    color: #424242;
    font-size: 10px;
    font-weight: bold;
  }
  .v-calendar-daily__intervals-body {
    max-width: 30px;
  }
  .v-calendar-daily__intervals-head {
    max-width: 30px;
  }
}

.v-btn--fab.v-size--default {
  height: min-content;
  width: min-content;
  font-size: 0.8em;
}

.v-btn--fab.v-size--small {
  height: min-content;
  width: min-content;
  font-size: 0.8em;
}

.text-format-week {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 7em;
}
</style>