<script>


export default {
  components: {},
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
  },
  data: () => ({
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
    events: [
      {
        name: 'Вождение',
        start: new Date(2023, 10, 13, 1, 0),
        end: new Date(2023, 10, 13, 3, 0),
        startTime: '12:00',
        timed: true,
        type: 'practice',
        teacher: 'Каминский С.В.',
      },
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
        name: 'Лекция',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
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
    updateRange () {

      },
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
}
</script>

<template>
  <v-container >
    <div class="text-h3 font-weight-medium">
      Расписание школы
    </div>
    <hr>
    <div class="text-h6">
      Выберите день, чтобы записаться на занятие
    </div>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col cols="1">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[0],}"
               @click="changeButtonState(0);"
        >
          <span :class="{ 'custom_text':isButtonPressed[0]}">Смотреть все</span>
        </v-btn>
      </v-col >
      <v-col cols="1">
        <v-btn text  class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[1]}"
               @click="changeButtonState(1);">
          <span :class="{ 'custom_text':isButtonPressed[1]}">Теория</span>
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[2]}"
               @click="changeButtonState(2);">
          <span :class="{ 'custom_text':isButtonPressed[2]}">Практика</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
          :event-height = "70"
          :hide-header = false
           @change = "updateRange"
          event-more-text="+ {0}"
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

<style lang="scss">
.v-calendar-weekly__week {
    min-height: 20em;
}
.theme--light.v-btn {
    color: #4E7AEC;
}
.v-event{
  display: flex;
  justify-content: center;
  width: 98% !important;
  height: 70px;
  background-color: rgb(157, 185, 255);
  border-color: rgb(157, 185, 255);
  margin: 0px 0px 0px 1.1%;
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
</style>