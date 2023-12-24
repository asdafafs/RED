<template>
  <v-container class="pa-0">
    <v-row no-gutters class="my-0 ga-3" align-content="center" justify="center">
      <v-spacer cols="1"></v-spacer>
      <v-col cols=2>
        <v-btn :class="{'custom-bg': isButtonPressed[0]}"
               @click="changeButtonState(0); $router.push('/schedule/lessons').catch(err => {})"
               text min-height="3em" color="white" class="pa-0 btn" width="100%">
          Расписание
        </v-btn>
      </v-col>
      <v-col cols>
        <v-btn :class="{ 'custom-bg': isButtonPressed [1]}"
               @click="changeButtonState(1); $router.push('/singUpClasses/lessons').catch(err => {})"
               text min-height="3em" class="pa-0 btn" width="100%" color="white">
          Запись на занятие
        </v-btn>
      </v-col>
      <v-col cols=2>
        <v-btn :class="{ 'custom-bg': isButtonPressed [2]}"
               @click="changeButtonState(2)"
               text min-height="3em" color="white" class="pa-0 btn" width="100%">
          Лекции
        </v-btn>
      </v-col>
      <v-col cols=2 v-if="student">
        <v-btn :class="{ 'custom-bg': isButtonPressed [3]}"
               @click="changeButtonState(3); $router.push('/testPlan/mainCal/testMonth').catch(err => {})"
               text min-height="3em" color="white" class="pa-0 btn" width="100%">
          Мой план
        </v-btn>
      </v-col>
      <v-spacer cols="1"></v-spacer>
      <v-col cols=2 v-if="!student">
        <v-btn :class="{ 'custom-bg': isButtonPressed [3]}"
               @click="changeButtonState(3); $router.push('/admin').catch(err => {})"
               text min-height="3em" color="white" class="pa-0 btn2" width="100%" height="100%" thin>
          <span class="mdi mdi-vector-arrange-above"></span>
          <div class="d-flex flex-row ">
            <div>
              Админпанель
            </div>
          </div>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'AppButtons',
  props: {
    student: {}
  },
  methods: {
    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
    },
    checkWindowWidth() {
      this.showDrawer = window.innerWidth >= 1260;
    },
  },
  data() {
    return {
      isButtonPressed: [false, false, false, false],
      lastPressedIndex: -1,
    }
  },
}
</script>
<style scoped>
.custom-bg {
  background-color: #4E7AEC;
  color: #ffffff;
}

.btn {
  text-transform: unset !important;
  font-size: 1.125rem;
}

.btn2 {
  text-transform: unset !important;
  font-size: 1.0rem;
  font-weight: lighter;
}
</style>