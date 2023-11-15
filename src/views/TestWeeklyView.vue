<template>
  <v-container>
    <v-row>
    <v-col>
      <v-sheet
      tile
      height="54"
      class="d-flex justify-center"
    ><v-row class="justify-center">
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
        <div class="d-flex flex-row justify-space-between align-center col-2">
          <div class="col-5 text-center pa-0">
            <div class="grey--text">понедельник
            </div>
            <div class="text-h6 ">
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
            <div class="text-h6">
              {{ dateSunday }}
            </div>
          </div>
        </div>
      <v-btn
        icon
        class="ma-0  align-self-center"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      </v-row>
    </v-sheet>
      <v-sheet>
        <v-calendar
          ref="calendar"
          :events="events"
          color="primary"
          type="week"
          :event-color = "getEventColor"
          :event-height = "50"
          :weekdays = "weekday"
        >
          <template v-slot:event="{event}">
         <v-container class="pa-1 mx-0 d-flex " >
            <v-row class="ma-0" >
              <v-col cols="4" class = "black--text pa-0 align-self-center" >
                <div class="text-subtitle-2 d-flex justify-center">{{event.startTime}}</div>
              </v-col>
              <v-col class = "black--text pa-0 align-self-center">
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

  export default {
    components: {},
    data: () => ({
      weekday: [1, 2, 3, 4, 5, 6, 0],
      today: new Date(),
      test: false,
      dateMonday: 12,
      dateSunday: 18,
      events: [
        {
        name: 'Лекция',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '14:00',
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
      }
      ],
    }),
    methods: {
      updateRange () {},
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },

      getEventColor(event) {
        if (event.type === 'lecture') {
          return '#9DB9FF'; // Blue color for 'lecture' type
        } else if (event.type === 'practice') {
          return '#E9E9E8'; // Gray color for 'practice' type
        } else {
      // Default color if type is not 'lecture' or 'practice'
          return 'rgba(0,0,0,0)'; // You can set your default color here
        }
      },

      changeButtonState(index) {
        if (this.lastPressedIndex !== -1) {
          this.$set(this.isButtonPressed, this.lastPressedIndex, false);
        }
        this.$set(this.isButtonPressed, index, true);
        this.lastPressedIndex = index;
      },
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
          .querySelectorAll('.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--light.v-size--small.primary')
          .forEach(item => {
            console.log(item);
            item.classList = '';
            buttonStyleReplace.forEach(x => {
              item.classList.toggle(x)
            })
          })
      this.test = true
    }
  }
</script>
<style lang="scss">
.v-calendar-weekly__week {
    min-height: 20em;
}
.theme--light.v-btn {
    color: #4E7AEC;
}
.v-event-timed{
  display: flex;
  justify-content: center;
  width: 100% !important;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0px 0px 0px 2.1%;
}
.v-event-more{

  font-size: 1em !important;
  //color: white;
  //background-color: black !important;
}
hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
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
</style>