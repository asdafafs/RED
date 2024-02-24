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
                <v-row class="ma-0 flex-wrap" fill>
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
            event.start = moment(event.start).format("YYYY-MM-DDTHH:mm:ss");
          }
          if (typeof event.end === 'number') {
            event.end = moment(event.end).format("YYYY-MM-DDTHH:mm:ss");
          }
          event.dayOfWeek = moment(event.start).day()
        });
      },
      deep: true
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
    dragEvent: {
      start: '',
      end: '',
      timed: false,
      savedTime: '',
      color: '',
    },
    testTime: null,
    createEvent: {
      start: '',
      end: '',
      timed: false,
      savedTime: '',
      color: '',
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
        return {
          start: moment(item.start).format("YYYY-MM-DDTHH:mm:ss"),
          end: moment(item.end).format("YYYY-MM-DDTHH:mm:ss"),
          color: item.color,
          dayOfWeek: item.dayOfWeek,
          savedTime: item.savedTime,
          timed: item.timed
        }
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
      this.$emit('plan-updated', this.eventsTemplate);
      //console.log('createEventsWithNewDuration', this.eventsTemplate)
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
    startDrag({event, timed}) {
      if (event && timed) {
        this.dragEvent = event
        this.testTime = event.savedTime
        this.dragTime = null
        this.extendOriginal = null
      }
    },

    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = new Date(this.dragEvent.start).getTime();
        const end = new Date(this.dragEvent.end).getTime();
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        // Проверяем пересечение с уже существующими событиями
        const isIntersect = this.eventsTemplate.some(event => {
          if (event === this.dragEvent) return false; // Пропускаем проверку для перетаскиваемого события

          const existingStart = moment(event.start);
          const existingEnd = moment(event.end);

          const dragStartInsideExisting = existingStart.isSameOrBefore(newStart) && existingEnd.isSameOrAfter(newStart);
          const dragEndInsideExisting = existingStart.isSameOrBefore(newEnd) && existingEnd.isSameOrAfter(newEnd);
          const existingInsideDrag = moment(newStart).isSameOrBefore(existingStart) && moment(newEnd).isSameOrAfter(existingEnd);

          return dragStartInsideExisting || dragEndInsideExisting || existingInsideDrag;
        });

        const interval = Math.abs(newStart - start) >= (15 * 60 * 1000); // 15 минут в миллисекундах

        if (isIntersect || !interval) {
          console.log('Событие пересекается с другими событиями или интервал меньше 15 минут');
          // Отменяем перемещение события
          return;
        }

        // Продолжаем перемещение события
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      }
    },

    endDrag() {
      if (this.dragEvent) {
        // Проверяем пересечение с уже существующими событиями
        const isIntersect = this.eventsTemplate.some(event => {
          if (event === this.dragEvent) return false; // Пропускаем проверку для перетаскиваемого события
          const existingStart = moment(event.start);
          const existingEnd = moment(event.end);
          console.log('start', existingStart, 'end', existingEnd)
          console.log('проверка 1', (this.dragEvent.start) )
          console.log('проверка 2', (this.dragEvent.end))
          return moment(this.dragEvent.start).isBetween(existingStart, existingEnd) || moment(this.dragEvent.end).isBetween(existingStart, existingEnd);
        });
        console.log('endDrag', isIntersect)
        if (isIntersect) {
          console.log('Пересеклось');
          // Возвращаем событие в изначальное положение
          this.dragEvent.start = this.testTime;
          this.dragEvent.end = this.testTime + (new Date(this.dragEvent.end).getTime() - new Date(this.dragEvent.start).getTime());
        }
        if (this.testTime !== this.dragEvent.start) {
          this.dragEvent.color = '#E9E9E8';
        } else {
          this.dragEvent.color = '#9DB9FF';
        }
        // Убираем выделение и завершаем перетаскивание
        this.dragTime = null;
        this.dragEvent = null;
        this.createEvent = {
          start: '',
          end: '',
          timed: false,
          color: '',
        };
        this.createStart = null;
        this.extendOriginal = null;

        // Обновляем массив событий
        this.$emit('plan-updated', this.eventsTemplate);
      }
    },

    startTime(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = new Date(this.dragEvent.start).getTime();
        this.dragTime = mouse - start;
      } else {
        const start = moment(this.roundTime(mouse)).format("YYYY-MM-DDTHH:mm:ss");
        const endHour = new Date(start).getHours() + this.selectedDuration;
        const end = moment(new Date(start).setHours(endHour)).format("YYYY-MM-DDTHH:mm:ss");
        const dayOfWeek = moment(start).day();

        // Проверяем, чтобы новое событие не пересекалось с существующими событиями и чтобы между событиями был интервал не менее 15 минут
        const isIntersect = this.eventsTemplate.some(event => {
          const existingStart = moment(event.start);
          const existingEnd = moment(event.end);
          const fifteenMinutes = 15 * 60 * 1000; // 15 минут в миллисекундах
          const proposedStart = moment(start);
          const proposedEnd = moment(end);

          // Проверяем пересечение
          const intersect = proposedStart.isBetween(existingStart, existingEnd) || proposedEnd.isBetween(existingStart, existingEnd);

          // Проверяем интервал между событиями
          const interval = proposedStart.diff(existingEnd) >= fifteenMinutes || existingStart.diff(proposedEnd) >= fifteenMinutes;

          return intersect || !interval;
        });

        if (isIntersect) {
          console.log('Событие пересекается с уже существующими или интервал меньше 15 минут');
          // Возвращаем false, чтобы отменить создание события
          return false;
        } else {
          // Добавляем новое событие
          this.eventsTemplate.push({
            start: start,
            end: end,
            dayOfWeek: dayOfWeek,
            color: '#E9E9E8',
            timed: true,
          });
          this.$emit('plan-updated', this.eventsTemplate);
        }
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