<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="focus"
              :events="events"
              color="primary"
              type="week"
              :event-color="getEventColor"
              :event-height="50"
              :weekdays="weekday"
              @change="updateRange"
              @click:event="showEvent"

          >
            <template v-slot:event="{event}">
              <v-container class="pa-0 mx-0 d-flex " fill>
                <v-row class="ma-0" fill>
                  <v-col cols="4" class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="text-subtitle-2 d-flex justify-center">{{ formatTime(event.start) }}</div>
                  </v-col>
                  <v-col class="d-lg-none pa-0" fill>
                    <div class="logo ">
                      <car-logo v-if="event.lectureType === 3"/>
                      <lecture-logo
                          v-if="event.lectureType === 2 || event.lectureType === 1 || event.lectureType === null"/>
                    </div>
                  </v-col>
                  <v-col class="black--text pa-0 align-self-center d-none d-lg-block">
                    <div class="font-weight-bold text-format-week">{{ event.title }}</div>
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
import moment from 'moment';
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";

export default {
  components: {CarLogo, LectureLogo},
  watch: {
    events() {
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
    events: [],
    currentDate: moment(),
    focus: '',
    weekday: [1, 2, 3, 4, 5, 6, 0],
    today: new Date(),
    test: false,
    dateMonday: moment().subtract(0, 'weeks').startOf('isoWeek').format('DD'),
    dateSunday: moment().subtract(0, 'weeks').endOf('isoWeek').format('DD'),
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),
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

    updateRange() {
    }
    ,
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
@import "@/assets/styles/buttons.css";
.v-event-timed.white--text {
  //display: flex;
  //justify-content: center;
  //align-items: center;
}

.theme--light.v-btn {
  color: #4E7AEC;
}

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

.btn {
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
  max-width: 10em;
}
</style>