<template>
  <v-container fluid>
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
              @mousedown:event="startDrag"
              @mousemove:event="mouseMove"
              @mouseup:event="endDrag"

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
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar>
                <v-toolbar-title v-html="formatTime(selectedEvent.startTime)"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.title"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn textcolor="secondary" @click="selectedOpen = false">
                  Cancel
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
import Draggable from 'vuedraggable';
import EventsRequest from "@/services/EventsRequest";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {CarLogo, LectureLogo, Draggable},
  watch: {
    events(value) {
      console.log(value);
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
    this.getAllEvents()
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

    async getLessons() {
      const lessons = new EventsRequest()
      let kal
      await lessons.getLecture().catch(x => console.log(x)).then(x => {
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
      await practices.getPractice().catch(x => console.log(x)).then(x => {
        kal = x.data.practice.map(event => ({
          ...event,
          start: event.startTime,
          end: event.endTime
        }));
      })
      return kal
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

    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
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
      console.log('Обновляем')
    }
    ,
    startDrag() {
      console.log('начинаем')
    },

    mouseMove() {
      console.log('двигаем')
    },

    endDrag() {
      console.log('заканчиваем')
    },

  },

}
</script>
<style lang="scss">
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

.custom-bg {
  background-color: #1e1f22;
}

.custom_text {
  color: white;
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
  max-height: inherit;
  max-width: 10em;
}
</style>