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
                  <v-col cols="" class="black--text pa-0 align-self-center  d-lg-block">
                    <div class="text-h6 text-md-subtitle-2 text-lg-h6  d-flex justify-center">
                      {{ formatTime(event.start) }}
                    </div>
                  </v-col>
                </v-row>
                <v-row class="ma-0" fill>
                  <v-col class="black--text pa-0 align-self-center  d-lg-block" cols="9">
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
    eventsTemplate: {
      handler(newVal) {
        newVal.forEach(event => {
          if (typeof event.start === 'number') {
            // Это timestamp, преобразуем его в строку формата "YYYY-MM-DDTHH:mm:ss"
            console.log('алярма')
            event.start = moment(event.start).format("YYYY-MM-DDTHH:mm:ss");
          }
          if (typeof event.end === 'number') {
            console.log('чипичипи')
            // Это timestamp, преобразуем его в строку формата "YYYY-MM-DDTHH:mm:ss"
            event.end = moment(event.end).format("YYYY-MM-DDTHH:mm:ss");
          }
        });
      },
      deep: true // Глубокое наблюдение за изменениями во вложенных объектах
    },
    //че это
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
    createEvent: {
      start: '',
      end: '',
      timed: false,
    },
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
      //console.log('Unformulated Events:', this.eventsTemplate);
      this.eventsTemplate = this.events.map(item => {
        // console.log('startTime', item.start, 'moment', moment(item.start).format("YYYY-MM-DDTHH:mm" ))
        // console.log('end', item.end, 'moment', moment(item.end).format("YYYY-MM-DDTHH:mm" ))
        let test = {
          start: moment(item.start).format("YYYY-MM-DDTHH:mm"),
          end: moment(item.end).format("YYYY-MM-DDTHH:mm"),
          timed: item.timed
        };
        //console.log(test)
        return test
      });
      //console.log('Formatted Events:', this.eventsTemplate);
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
        // console.log('event',event)

        this.dragTime = null
        this.extendOriginal = null
      }
    },

    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = new Date(this.dragEvent.start).getTime();
        const end = new Date(this.dragEvent.end).getTime();
        // console.log('endCock', end)
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
      //console.log('mouse',mouse)
      if (this.dragEvent && this.dragTime === null) {
        const start = new Date(this.dragEvent.start).getTime();

        this.dragTime = mouse - start
        // console.log('start', start)
        // console.log('mouse', mouse)
        // console.log('this.dragTime', this.dragTime)
      } else {

        let start = moment(this.roundTime(mouse)).format("YYYY-MM-DDTHH:mm");
        //console.log(this.createStart)
        let endHour = new Date(start).getHours() + this.selectedDuration;

        let end = new Date(start).setHours(endHour);
        end = moment(end).format("YYYY-MM-DDTHH:mm")
        this.createEvent = {
          start: start,
          end: end,
          timed: true,
        }
        //console.log('this.createEvent',this.createEvent)
        this.eventsTemplate.push(this.createEvent)
        //console.log('this.eventsTemplate',this.eventsTemplate)
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