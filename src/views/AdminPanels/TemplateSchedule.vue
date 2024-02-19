<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="focus"
              :events="eventsItems"
              color="primary"
              type="week"
              :event-color="getEventColor"
              :event-height="50"
              :weekdays="weekday"
              :event-ripple="false"
              @mousedown:event="startDrag"
              @mousedown:time="startTime"
              @mousemove:time="mouseMove"
              @mouseup:time="endDrag"
          >
            <template v-slot:event="{event}">
              <v-container class="pa-0 mx-0 d-flex" fill>
                <v-row class="ma-0" fill>
                  <v-col cols="" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-h6  d-flex justify-center">
                      {{ formatTime(event.start) }}
                    </div>
                  </v-col>
                </v-row>
                <v-row class="ma-0" fill>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block" cols="9">
                    <div class="font-weight-bold text-format-week">{{ `Вождение` }}</div>
                    <div class="text-subtitle-2 d-flex">{{ abbreviatedName }}</div>
                  </v-col>
                  <v-col cols="2">
                    <v-icon class="red--text" @click="deleteEvent(event)">mdi-window-close</v-icon>
                  </v-col>
                </v-row>
              </v-container>
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
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import moment from "moment";

export default {
  components: {CarLogo, LectureLogo},
  watch: {
    eventsTemplate() {
    },

    selectedDuration() {
      this.createEventsWithNewDuration();
    },

    events: {
      handler() {
        this.initialize();
      },
      deep: true
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
  },

  data: () => ({
    eventsTemplate: [],
    focus: '',
    weekday: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dragEvent: null,
    createEvent: null,
    createStart: null,
  }),

  props: {
    selectedDuration: {
      type: Number,
      default: 1,
    },

    fullNameActiveUser: {
      type: String,
      default: '',
    },

    events: {
      type: Array,
      default: [],
    },
  },

  computed: {
    abbreviatedName() {
      const words = this.fullNameActiveUser.split(' ');
      if (words.length >= 3) {
        return `${words[0]} ${words[1].charAt(0)}. ${words[2].charAt(0)}.`;
      } else {
        return this.fullNameActiveUser;
      }
    },

    eventsItems() {
      console.log('Unformulated Events:', this.eventsTemplate);
      debugger
      this.eventsTemplate = this.events.map(item => {
        let test = {
          id: item.id,
          start: moment(item.startTime).format("YYYY-MM-DDTHH:mm"),
          end: moment(item.endTime).format("YYYY-MM-DDTHH:mm"),
          timed: item.timed
        };
        console.log(test)
        return test
      });
      console.log('Formatted Events:', this.eventsTemplate);
      return this.eventsTemplate;
    },
  },

  methods: {
    createEventsWithNewDuration() {
      this.eventsTemplate.forEach(event => {
        const newEndTime = moment(event.start).add(this.selectedDuration, 'hours');
        event.end = newEndTime.valueOf();
      });
    },

    deleteEvent(event) {
      const index = this.eventsTemplate.indexOf(event);
      if (index !== -1) {
        this.eventsTemplate.splice(index, 1);
        this.$emit('plan-updated', this.eventsTemplate);
      }
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

    startDrag({event, timed}) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },

    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
      }
    },


    endDrag() {
      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null

    },

    startTime(tms) {
      //debugger
      const mouse = this.toTime(tms)
      console.log('mouse',mouse)
      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = moment(this.roundTime(mouse)).format("YYYY-MM-DDTHH:mm");
       //console.log(this.createStart)
        let endHour = new Date(this.createStart).getHours() + this.selectedDuration;

        let endTime = new Date(this.createStart).setHours(endHour);
        endTime = moment(endTime).format("YYYY-MM-DDTHH:mm")
        this.createEvent = {
          id:1,
          start: this.createStart,
          end: endTime,
          timed: true,
        }
        console.log(this.createEvent)
        this.eventsTemplate.push(this.createEvent)
        console.log('this.eventsTemplate',this.eventsTemplate)
        this.$emit('plan-updated', this.eventsTemplate);
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

    initialize() {
      //console.log('1', this.eventTest)
    },

  },
  created() {
    this.initialize()
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/monthScheduleStyles.css";
</style>