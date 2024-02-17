<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="focus"
              :events="eventsTemplate"
              color="primary"
              type="week"
              :event-color="getEventColor"
              :event-height="50"
              :weekdays="weekday"
              :event-ripple="false"
              @change="getEvents"
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

export default {
  components: {CarLogo, LectureLogo},
  watch: {
    eventsTemplate() {
    },

    selectedDuration(newVal, oldVal) {
      this.createEventsWithNewDuration();
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
      default: 1
    },

    fullNameActiveUser: {
      type: String,
      default: ''
    }
  },

  computed: {
    abbreviatedName() {
      // Разбиваем fullNameActiveUser на слова
      const words = this.fullNameActiveUser.split(' ');
      // Если в fullNameActiveUser есть хотя бы три слова
      if (words.length >= 3) {
        // Возвращаем первое слово и первую букву второго и третьего слова
        console.log(`${words[0]} ${words[1].charAt(0)}. ${words[2].charAt(0)}.`)
        return `${words[0]} ${words[1].charAt(0)}. ${words[2].charAt(0)}.`;
      } else {
        // Иначе просто возвращаем fullNameActiveUser
        return this.fullNameActiveUser;
      }
    }
  },

  methods: {
    createEventsWithNewDuration() {
      this.eventsTemplate.forEach(event => {
        const newEndTime = new Date(event.start);
        newEndTime.setHours(newEndTime.getHours() + this.selectedDuration);
        event.end = newEndTime.getTime();
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
    getEvents({start, end}) {

    },

    startTime(tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)
        console.log(this.selectedDuration)
        let endHour = new Date(this.createStart).getHours() + this.selectedDuration;
        const endTime = new Date(this.createStart).setHours(endHour);
        this.createEvent = {
          start: this.createStart,
          end: endTime,
          timed: true,
        }
        this.eventsTemplate.push(this.createEvent)
        console.log(this.eventsTemplate)
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


  },
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/monthScheduleStyles.css";
</style>