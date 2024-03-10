<template>
  <v-container fluid>
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
              :event-color="getEventColor"
              :event-ripple="false"
              :event-height="num"
              :hide-header=false
              @change="updateRange"
              event-more-text="+ {0}"
          >
            <template v-slot:event="{event}">
              <v-container class="pa-1 mx-0 d-flex ">
                <v-row class="ma-0  ">
                  <v-col cols="4" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
                  </v-col>
                  <v-col class="d-lg-none pa-0" style="display: flex; align-items: center; justify-content: center;">
                    <div class="logo ">
                      <car-logo v-if="event.lectureType === 3"/>
                      <lecture-logo
                          v-if="event.lectureType === 2 || event.lectureType === 1 || event.lectureType === null"/>
                    </div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="font-weight-bold text-format">{{ event.title }}</div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-calendar>
          <v-menu max-width="200px" min-width="200px"
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
  }),

  created() {
    this.selectCurrentFreeStudent()
  },

  computed: {
    ...mapState(['user']),

    userId() {
      return this.$store.state.user.userId;
    }
  },

  methods: {
    initialize() {
    },

    selectCurrentFreeStudent() {
      const id = this.userId;
      const student = new UsersRequest();
      student.getStudentNullGroup()
          .then(response => {
            const students = response.data.students;
            const foundStudent = students.find(student => student.id === id);
            if (foundStudent) {
              if (foundStudent.groupId != null){
                const groupId = foundStudent.groupId
                this.getAllEvents(groupId)
              }
            } else {
              console.log("Студент с id", id, "не найден.");
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

    async getPractices(groupId) {
      const practices = new EventsRequest()
      let cal
      await practices.getPracticeId().catch(x => console.log(x)).then(x => {
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
      const practices = await this.getPractices(groupId);
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