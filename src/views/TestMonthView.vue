<script>

export default {
    components: {},
    data: () => ({
      classesSelectorsToRemove: [

      ],
      type: 'month',
      mode: 'stack',
      modes: [
        'column'
      ],
      weekday: [1, 2, 3, 4, 5, 6, 0],
      weekdays: [1, 2, 3, 4, 5, 6, 0
      ],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      isModalVisible: false,
    }),
    methods: {

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
      <div class="text-h6 align-self-center">Месяц</div>
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
          color="primary"
          :weekdays="weekday"
          :event-overlap-mode="mode"
          :type="type"
          :events="events"
          :event-ripple="false"

        >
          <template v-slot:event="{}" >

          </template>
        </v-calendar>
    </v-sheet>

  </div>
</template>

<style scoped lang="scss">

</style>