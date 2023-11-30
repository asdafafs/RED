<script>
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
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
          console.log(item);
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
    events: [
        {
        name: 'Лекция',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '11:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Вождение',
        start: new Date(2023, 10, 15, 3, 0),
        end: new Date(2023, 10, 15, 5, 0),
        startTime: '14:00',
        type: 'practice',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Лекция',
        start: new Date(2023, 10, 11, 3, 0),
        end: new Date(2023, 10, 11, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },

      {
        name: 'Вождение',
        start: new Date(2023, 10, 23, 3, 0),
        end: new Date(2023, 10, 23, 5, 0),
        startTime: '14:00',
        type: 'practice',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Лекция',
        start: new Date(2023, 10, 24, 3, 0),
        end: new Date(2023, 10, 24, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      }
      ],
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
  }),
  methods: {
    updateRange () {},

    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    getEventColor(event) {
      if (event.type === 'lecture') {
        return '#9DB9FF';
    }
      else if (event.type === 'practice') {
        return '#E9E9E8';
    }
      else {
        return 'rgba(0,0,0,0)'
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
  },
}
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col >
    <v-sheet
      tile
      height="54"
      class="d-flex justify-center"
    >
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-if="test" class="text-h6 align-self-center">{{ $refs.calendar.title.split(' ')[0] }}</v-toolbar-title>
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="$refs.calendar.next()"
      >
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
          :event-color = "getEventColor"
          :event-ripple="false"
          :event-height = "num"
          :hide-header = false
           @change = "updateRange"
          event-more-text="+ {0}"
      >
        <template v-slot:event="{event}">
         <v-container class="pa-1 mx-0 d-flex " >
            <v-row class="ma-0  " >
              <v-col cols="4" class = "black--text pa-0 align-self-center d-none d-lg-block" >
                <div class="text-subtitle-2 d-flex justify-center">{{event.startTime}}</div>
              </v-col>
              <v-col class = "d-lg-none pa-0" style="display: flex; align-items: center; justify-content: center;">
                <div class="logo ">
                  <car-logo v-if="event.type === 'practice'"/>
                  <lecture-logo v-if="event.type === 'lecture'"/>
                </div>
              </v-col>
              <v-col class = "black--text pa-0 align-self-center d-none d-lg-block">
                <div class="font-weight-bold">{{event.name}}</div>
                <div>Преподаватель:<br>{{event.teacher}}</div>
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

<style lang="scss">
.v-calendar-weekly__week {
  min-height: 20em;
}

@media screen and (max-width: 1260px){
  .v-calendar-weekly__week {
    min-height: 10em;
  }
}

@media screen and (max-width: 600px){
  .v-calendar-weekly__week {
    min-height: 5em;
  }
}

.theme--light.v-btn {
    color: #4E7AEC;
}

.v-event{
  display: flex;
  justify-content: center;
  width: 98% ;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0px 0px 0px 1.1%;
}

.v-event.v-event-start.v-event-end.white--text{
  min-width: 98%;
}

.v-event-more{
  font-size: 1em !important;
}

.btn
{
  text-transform: unset !important;
  font-size: 1.5em;
}

.custom-bg
{
  background-color: #1e1f22;
}

.custom_text
{
  color: white;
}
</style>