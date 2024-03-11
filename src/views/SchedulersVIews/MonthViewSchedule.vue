<template>
  <v-container fluid>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[0],}"
               @click="changeButtonState(0);getAllEvents();">
          <span :class="{ 'tab-button-text':isButtonPressed[0]}">Смотреть все</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[1]}"
               @click="changeButtonState(1); testLessons();">
          <span :class="{ 'tab-button-text':isButtonPressed[1]}">Теория</span>
        </v-btn>
      </v-col>
      <v-col lg="2" md="2" sm="3">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[2]}"
               @click="changeButtonState(2); testPractices();">
          <span :class="{ 'tab-button-text':isButtonPressed[2]}">Практика</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
        <v-sheet height="600">
          <v-calendar
              ref="calendar"
              v-model="value"
              :weekdays="weekday"
              :event-overlap-mode="mode"
              :type="type"
              :events="events"
              :event-color="getEventColor"
              @click:event="showEvent"
              :event-ripple="false"
              :event-height="num"
              :hide-header=false
              @change="updateRange"
              event-more-text="+ {0}"
              :past=false
          >
            <template v-slot:event="{event}">
              <v-container class="pa-1 mx-0 d-flex ">
                <v-row class="ma-0">
                  <v-col cols="4" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.startTime) }}</div>
                  </v-col>
                  <v-col class="d-lg-none pa-0 event">
                    <div class="logo ">
                      <car-logo v-if="event.lectureType === 3"/>
                      <lecture-logo
                          v-if="event.lectureType === 2 || event.lectureType === 1 || event.lectureType === null"/>
                    </div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="font-weight-bold text-format" style="width: inherit">{{ event.title }}
                    </div>
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
                  OK
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
    test: false,
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
    isButtonPressed: [false, false, false]
  }),

  computed:{
    ...mapState(['user']),

    userID() {
      if (this.user && this.user.userId !== null) {
        return this.$store.state.user.userId
      } else {
        return console.log('а id нету');
      }
    },

  },

  methods: {
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

    async getLessons() {
      const lessons = new EventsRequest()
      let lessonsData
      await lessons.getLectureActiveUser(this.userID).catch(x => console.log(x)).then(x => {
        lessonsData = x.data.lecture.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return lessonsData
    },

    async getPractices() {
      const practices = new EventsRequest()
      let cal
      await practices.getPracticeActiveUser(this.userID).catch(x => console.log(x)).then(x => {
        cal = x.data.practice.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime)
        }));
      })
      return cal
    },

    async getAllEvents() {
      const lessons = await this.getLessons();
      const practices = await this.getPractices();
      this.events = [...lessons, ...practices];
      this.events = this.events.map(item => {
        return {
          ...item,
          start: moment(item.start).format("YYYY-MM-DD HH:mm"),
          end: moment(item.end).format("YYYY-MM-DD HH:mm"),
        }
      })
    },

    async testLessons() {
      this.events = await this.getLessons();
    },

    async testPractices() {
      this.events = await this.getPractices();
    },

    formatTime(startTime) {
      const date = new Date(startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    updateRange() {
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

    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
    },

    handleResize() {
      if (window.innerWidth < 1260) {
        this.num = 30;
      } else {
        this.num = 70;
      }
    },

    async initialize(){
      let index = this.userID
      console.log(index)
      this.changeButtonState(0)
      await this.getAllEvents()
    }
  },
  created() {
    this.initialize()
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/monthScheduleStyles.css";
</style>