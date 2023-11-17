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
    modes: ['column'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: '',
  }),
  methods: {
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