<template>
  <div style="width: 100%; height:100%; padding: 0 12px 12px 12px">
    <v-btn-toggle
      mandatory
      v-model="selectedLessonType"
      group
      color="black"
    >
      <v-btn
        v-for="item in calendarButtons"
        :key="item.id"
        height="32"
        class="toggle-button"
        :value="item.id"
        @click="onToggleClick(item.id)"
      >
        <span :class="selectedLessonType === item.id ? 'white--text' : 'black--text'">
          {{ item.title }}
        </span>
      </v-btn>
    </v-btn-toggle>
    <div>
      <div>
        <v-sheet 
          tile 
          height="54" 
          class="d-flex justify-center"
        >
          <v-btn 
            icon 
            class="ma-0 align-self-center" 
            @click="$refs.calendar.prev()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title 
            v-if="test" 
            class="month-name"
          >
            {{ month }}
          </v-toolbar-title>
          <v-btn 
            icon 
            class="ma-0 align-self-center" 
            @click="$refs.calendar.next()"
          >
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
              :event-color="getEventColor"
              @click:event="showEvent"
              :event-ripple="false"
              :event-height="num"
              :hide-header=false
              event-more-text="+ {0}"
          >
            <template v-slot:event="{event}">
              <div class="d-flex flex-row" style="width: 100%">
                <div class="d-flex align-center justify-center event-time" style="width: 30%">
                  {{ formatTime(event.startTime) }}
                </div>
                <div class="d-flex align-center justify-center event-type" style="width: 70%">
                  {{ event.title }}
                </div>
              </div>
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
      </div>
    </div>
  </div>
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
    selectedLessonType: null,
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
  }),
  watch: {
    userID(value) {
      if (value) this.getAllEvents()
    }
  },
  created() {
    if (this.userID) this.getAllEvents()
  },
  computed:{
    ...mapState(['user']),
    calendarButtons() {
      return [
        {
          id: 0,
          title: 'Смотреть всё',
        },
        {
          id: 1,
          title: 'Теория',
        },
        {
          id: 2,
          title: 'Практика',
        },
      ]
    },
    month() {
      return this.$refs.calendar.title.split(' ')[0]
    },
    userID() {
      return this.user.userId
    },

  },

  methods: {
    onToggleClick(id) {
      switch (id) {
        case 0: return this.getAllEvents()
        case 1: return this.testLessons()
        case 2: return this.testPractices()
      }
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
    
    getEventColor(event) {
      if (event.lectureType === 3) {
        return '#9DB9FF';
      } else if (event.lectureType === 2) {
        return '#E9E9E8';
      } else {
        return '#E9E9E8'
      }
    },
    
    handleResize() {
      if (window.innerWidth < 1260) {
        this.num = 30;
      } else {
        this.num = 70;
      }
    },

    async initialize(){
      await this.getAllEvents()
    }
  },

}
</script>

<style scoped lang="scss">
@import "@/assets/styles/monthScheduleStyles.css";
.toggle-button {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: black !important;
  border-radius: 4px !important;
  text-transform: none !important;
}
.v-btn--active::before {
  opacity: 1 !important;
}
.v-btn:hover,
.v-btn:focus,
{
  color: black !important;
}

.month-name {
  font-size: 24px !important;
  font-weight: 700 !important;
  display: flex !important;
  align-items: center !important;
  margin-right: 8px !important;
  margin-left: 8px !important;
}

.event-time {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: black !important;
}
.event-type {
  font-weight: 600 !important;
  font-size: 12px !important;
  color: black !important;
}
.event-instructor,
.event-long
{
  font-weight: 400 !important;
  font-size: 12px !important;
  color: black !important;
}
</style>