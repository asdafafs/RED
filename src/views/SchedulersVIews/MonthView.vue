<template>
  <v-container fluid v-if="groupId !==0">
    <v-row>
      <v-col class="pa-0">
        <v-sheet tile height="54" class="d-flex justify-center">
          <v-btn icon class="ma-0  align-self-center" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="test" class="text-h6 align-self-center">{{ $refs.calendar.title.split(' ')[0] }}
          </v-toolbar-title>
          <v-btn icon class="ma-0  align-self-center" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="value"
              :weekdays="weekday"
              :event-overlap-mode="mode"
              :type="type"
              :events="events"
              @click:event="showEvent"
              :event-ripple="false"
              :event-height="num"
              :hide-header=false
              event-more-text="+ {0}"
          >
            <template v-slot:event="{event}">
              <v-container class="pa-1 mx-0 d-flex " :class="getTableRowClass(event)">
                <v-row class="ma-0" v-if="$vuetify.breakpoint.lgAndUp">
                  <v-col cols="4" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="font-weight-bold text-format">{{ event.title }}</div>
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
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import EventsRequest from "@/services/EventsRequest";
import moment from "moment/moment";
import {mapState} from "vuex";
import UsersRequest from "@/services/UsersRequest";

export default {
  components: {LectureLogo, CarLogo},
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
        .querySelectorAll('.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--light.v-size--small.primary')
        .forEach(item => {
          item.classList = '';
          buttonStyleReplace.forEach(x => {
            item.classList.toggle(x)
          })
        })
    this.test = true
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },


  data: () => ({
    events: [],
    num: 70,
    isMobile: false,
    isButtonPressed: [false, false, false,],
    test: false,
    classesSelectorsToRemove: [],
    type: 'month',
    mode: 'stack',
    modes: [
      'column'
    ],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: '',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    studentHours: 0,
  }),

  created() {
    this.initialize()
  },

  computed: {
    ...mapState(['user']),


    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },

    userId() {
      return this.$store.state.user.userId;
    },

    groupId() {
      return this.user.groupId
    },

    studentTitle(){
      return `${this.$store.state.user.name} ${this.$store.state.user.surname} ${this.$store.state.user.middleName}`
    },
  },

  methods: {
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
            console.log('foundStudent', foundStudent)
            if (foundStudent) {
              console.log('Этого студента не найдено в списке свободных');
            } else {
              console.log(this.groupId)
              const groupId = this.groupId
              this.getAllEvents(groupId)
            }
          })
          .catch(error => {
            console.log("Ошибка при поиске студента:", error);
          });
    },

    showEvent({nativeEvent, event}) {
      console.log(event)
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
      console.log(lessons)
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

    getTableRowClass(event) {
      const classMap = {
        1: ' green-background',
        2: 'yellow-background',
        3: 'red-background',
        4: 'gray-background'
      };
      return classMap[event.lectureType] || 'free-practice';
    },

    handleResize() {
      if (window.innerWidth < 1260) {
        this.num = 30;
      } else {
        this.num = 70;
      }
    },
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/eventTypesStyles.css";
@import "@/assets/styles/buttonStyles.css";

.v-calendar-weekly__week {
  min-height: 20em;
}

@media screen and (max-width: 1260px) {
  .v-calendar-weekly__week {
    min-height: 10em;
  }
}

@media screen and (max-width: 600px) {
  .v-calendar-weekly__week {
    min-height: 5em;
  }
}

.theme--light.v-btn {
  color: #4E7AEC;
}

.v-event {
  display: flex;
  justify-content: center;
  width: 98%;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0 0 0 1.1%;
}

.v-event.v-event-start.v-event-end.white--text {
  min-width: 98%;
}

.v-event-more {
  font-size: 1em !important;
}

.btn {
  text-transform: unset !important;
  font-size: 1.5em;
}

.text-format {
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 6em;
  max-width: 10em;
}
</style>