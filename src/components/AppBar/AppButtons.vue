<template>
  <v-container class="pa-0 ma-0 ga-0">
    <v-row no-gutters class="my-0 ga-3" align-content="center" justify="center">
      <v-spacer cols="1"></v-spacer>
      <v-col cols=2>
        <v-btn :class="{'app-bar-button-color': isButtonPressed[0]}"
               @click="changeButtonState(0); $router.push({name: 'schedule-lessons'}).catch(() => {})"
               text min-height="3em" color="white" class="pa-0 app-bar-button-style" width="100%">
          Расписание
        </v-btn>
      </v-col>
      <v-col cols>
        <v-btn :class="{ 'app-bar-button-color': isButtonPressed [1]}"
               @click="changeButtonState(1); $router.push({name: 'singUpClasses-month'}).catch(() => {})"
               text min-height="3em" class="pa-0 app-bar-button-style" width="100%" color="white">
          Запись на занятие
        </v-btn>
      </v-col>
      <!--      <v-col cols=2>-->
      <!--        <v-btn :class="{ 'app-bar-button-color': isButtonPressed [2]}"-->
      <!--               @click="changeButtonState(2)"-->
      <!--               text min-height="3em" color="white" class="pa-0 btn" width="100%">-->
      <!--          Лекции-->
      <!--        </v-btn>-->
      <!--      </v-col>-->
      <v-col cols=2 v-if="student">
        <v-btn :class="{ 'app-bar-button-color': isButtonPressed [2]}"
               @click="changeButtonState(3); $router.push({name: 'plan-main-day'}).catch(() => {})"
               text min-height="3em" color="white" class="pa-0 app-bar-button-style" width="100%">
          Мой план
        </v-btn>
      </v-col>
      <v-spacer cols="1"></v-spacer>
      <v-col cols=2 v-if="!student">
        <v-btn :class="{ 'app-bar-button-color': isButtonPressed [3]}"
               @click="changeButtonState(3); $router.push({name: 'admin-students'}).catch(() => {})"
               text min-height="3em" color="white" class="pa-0 adminPanelButton" width="100%" height="100%" thin>
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
  },
  computed: {
    isButtonPressed() {
      return [this.$route.path === '/schedule/lessons', this.$route.path === '/singUpClasses/schedule-lessons',
        this.$route.path.includes('testPlan'),
        this.$route.path.startsWith('/admin')]
    }
  },
  data() {
    return {
      lastPressedIndex: -1,
    }
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
</style>