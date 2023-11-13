<template>
  <div>
    <v-sheet height="600">
      <v-calendar
          ref="cal"
          type="day"
          event-overlap-mode="stack"
          :events="events"
          color="white"
          event-color="white"
          mode="stack"
          class="day-calendar"
      >
        <template v-slot:event="data">
          <div class="day-event">
            <div class="day">
              {{ data.event.startTime }}
            </div>
            <div class="logo">
              <car-logo v-if="data.event.type === 'practice'"/>
              <lecture-logo v-if="data.event.type === 'lecture'"/>
            </div>
            <div class="custom-info">
              {{ data.event.name }}
              <div v-if="data.event.teacher" class="teacher">
                Преподаватель: {{ data.event.teacher }}
              </div>
            </div>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import LectureLogo from "@/components/logos/LectureLogo";
import CarLogo from "@/components/logos/CarLogo";

export default {
  name: "ExampleDay.vue",
  components: {LectureLogo, CarLogo},
  methods: {
    getTest(data) {
      console.log(data);
      return data
    }
  },
  mounted() {
    this.classesSelectorsToRemove.forEach(item => {
      this.$refs.cal.$el.querySelectorAll(item).forEach(item => {
        item.remove();
      })
    })
  },
  data() {
    return {
      classesSelectorsToRemove: [
        '.v-calendar-daily__interval-text',
        '.v-calendar-daily__interval',
        '.v-calendar-daily_head-day-label',
        '.v-calendar-daily_head-weekday',
        '.v-calendar-daily__day-interval',
        '.v-calendar-daily__intervals-body',
        '.v-calendar-daily_head-day'
      ],
      value: '2023-11-13',
      mode: 'stack',
      events: [
        {
          name: 'Лекция',
          start: new Date(2023, 10, 13, 1, 0),
          end: new Date(2023, 10, 13, 3, 0),
          startTime: '12:00',
          timed: true,
          type: 'practice',
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
      ]
    }
  }
}
</script>

<style lang="scss">
.day-event {
  display: flex;
  height: 100%;
  background-color: #E9E9E8;
  border-radius: 12px;
  align-items: center;
  padding: 15px;

  .day {
    color: #000000;
    font-size: 40px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
  }

  .custom-info {
    font-size: 20px;
    color: #000000;
    padding-left: 8px;
    font-family: Roboto, sans-serif;
    font-weight: bold;
    display: flex;
    flex-direction: column;

    .teacher {
      font-family: Roboto, sans-serif;
      font-weight: normal;
      font-size: 12px;
    }

  }

  .logo {
    padding-left: 22px;
  }
}

.day-calendar {
  :only-child {
    .theme--light.v-calendar-daily .v-calendar-daily__day-interval {
      border-top: none;
    }

    .theme--light.v-calendar-daily {
      border-top: none;
    }
  }

  border-top: none;
}
</style>