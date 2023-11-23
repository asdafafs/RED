<template>
  <v-container fluid>
    <v-row>
      <v-row class="justify-center">
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
        <div  class="d-flex flex-row justify-space-between align-center col-lg-2 col-md-4 col-sm-8 col-9">
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
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="next"
      >
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
          :event-color = "getEventColor"
          :event-height = "50"
          :weekdays = "weekday"
        >
          <template v-slot:event="{event}" >
         <v-container class="pa-0 mx-0 d-flex " fill>
            <v-row class="ma-0" fill>
              <v-col cols="4" class = "black--text pa-0 align-self-center d-none d-lg-block" >
                <div class="text-subtitle-2 d-flex justify-center">{{event.startTime}}</div>
              </v-col>
              <v-col class = "d-lg-none pa-0" fill>
                <div class="logo d-flex justify-center align-center">
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

<script>
import moment from 'moment';
import CarLogo from "@/components/logos/CarLogo.vue";
import LectureLogo from "@/components/logos/LectureLogo.vue";
import {mapState} from "vuex";
  export default {
    components: {CarLogo, LectureLogo},
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
          console.log(item);
          item.classList = '';
          buttonStyleReplace.forEach(x => {
            item.classList.toggle(x)
          })
        });
         this.test = true
    },

    computed:{
      ...mapState(['events'])
    },

    data: () => ({
      currentDate: moment(),
      focus: '',
      weekday: [1, 2, 3, 4, 5, 6, 0],
      today: new Date(),
      test: false,
      dateMonday: moment().subtract(0, 'weeks').startOf('isoWeek').format('DD'),
      dateSunday: moment().subtract(0, 'weeks').endOf('isoWeek').format('DD'),
      // events: [
      //   {
      //   name: 'Лекция',
      //   start: new Date(2023, 10, 13, 3, 0),
      //   end: new Date(2023, 10, 13, 5, 0),
      //   startTime: '11:00',
      //   type: 'lecture',
      //   timed: true,
      //   teacher: 'Каминский С.В.'
      // },
      // {
      //   name: 'Вождение',
      //   start: new Date(2023, 10, 15, 3, 0),
      //   end: new Date(2023, 10, 15, 5, 0),
      //   startTime: '14:00',
      //   type: 'practice',
      //   timed: true,
      //   teacher: 'Каминский С.В.'
      // },
      // {
      //   name: 'Лекция',
      //   start: new Date(2023, 10, 11, 3, 0),
      //   end: new Date(2023, 10, 11, 5, 0),
      //   startTime: '14:00',
      //   type: 'lecture',
      //   timed: true,
      //   teacher: 'Каминский С.В.'
      // },
      //           {
      //   name: 'Вождение',
      //   start: new Date(2023, 10, 23, 3, 0),
      //   end: new Date(2023, 10, 23, 5, 0),
      //   startTime: '14:00',
      //   type: 'practice',
      //   timed: true,
      //   teacher: 'Каминский С.В.'
      // },
      // {
      //   name: 'Лекция',
      //   start: new Date(2023, 10, 24, 3, 0),
      //   end: new Date(2023, 10, 24, 5, 0),
      //   startTime: '14:00',
      //   type: 'lecture',
      //   timed: true,
      //   teacher: 'Каминский С.В.'
      // }
      // ],
    }),
    methods: {
      updateRange () {},
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },

      getEventColor(event) {
        if (event.type === 'lecture') {
          return '#9DB9FF';
        } else if (event.type === 'practice') {
          return '#E9E9E8';
        } else {

          return 'rgba(0,0,0,0)';
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
  },

  }
</script>
<style lang="scss">
.v-event-timed.white--text{
  //display: flex;
  //justify-content: center;
  //align-items: center;
}

.theme--light.v-btn {
    color: #4E7AEC;
}

.v-event-timed{
  width: 100% ;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0px 0px 0px 5px;
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

.v-calendar-daily__interval-text {
  color: #424242;
  font-size: 19px;
  font-weight: bold;
}

@media screen and (max-width: 1260px){
  .v-calendar-daily__interval-text {
    color: #424242;
    font-size: 10px;
    font-weight: bold;
  }
  .v-calendar-daily__intervals-body{
    max-width: 30px;
}
  .v-calendar-daily__intervals-head{
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
</style>