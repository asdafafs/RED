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
  },
  data: () => ({
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
        name: 'Лекция',
        start: new Date(2023, 10, 13, 1, 0),
        end: new Date(2023, 10, 13, 3, 0),
        startTime: '12:00',
        timed: true,
        type: 'practice',
        teacher: 'Каминский С.В.',
      },
      {
        name: 'Вождение',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
      {
        name: 'Вождение',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      },
              {
        name: 'Вождение',
        start: new Date(2023, 10, 13, 3, 0),
        end: new Date(2023, 10, 13, 5, 0),
        startTime: '14:00',
        type: 'lecture',
        timed: true,
        teacher: 'Каминский С.В.'
      }
    ],
  }),
  methods: {
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;

      let mn = this.start.month;

      const mNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      console.log(mn)
      this.title = mNames[mn - 1];
    },
    getEventColor(event) {
      return event.color = "#9DB9FF"
    }

  },
}
</script>

<template>
  <div>

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
      <v-toolbar-title class="text-h6 align-self-center">{{ title }}</v-toolbar-title>
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
      >
          <template v-slot:event="{event}">
            <v-row>
              <v-col cols="2">
                <div>{{event.startTime}}</div>
              </v-col>
              <v-col>
                <div>{{event.name}}</div>
                <div>Преподаватель: <br> {{event.teacher}}</div>
              </v-col>
            </v-row>


          </template>
        </v-calendar>
    </v-sheet>

  </div>
</template>

<style lang="scss">
.v-calendar-weekly__week {
  min-height: max-content;
}
</style>