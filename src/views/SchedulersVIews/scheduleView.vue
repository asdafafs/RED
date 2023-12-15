<template>
  <v-container class="px-4 pa-0 ma-0" fluid v-if="true">
    <div class="text-h3 font-weight-medium px-4">
      Расписание школы
    </div>
    <hr>
    <div class="text-h6 px-4">
      Выберите день, чтобы записаться на занятие
    </div>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col lg="1" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[0],}"
               @click="changeButtonState(0);">
          <span :class="{ 'custom_text':isButtonPressed[0]}">Смотреть все</span>
        </v-btn>
      </v-col>
      <v-col lg="1" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[1]}"
               @click="changeButtonState(1);">
          <span :class="{ 'custom_text':isButtonPressed[1]}">Теория</span>
        </v-btn>
      </v-col>
      <v-col lg="1" md="2" sm="3">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[2]}"
               @click="changeButtonState(2);">
          <span :class="{ 'custom_text':isButtonPressed[2]}">Практика</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},
  mounted() {
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
    showDrawer: true,
  }),
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

  created() {
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
  },
}
</script>

<style lang="scss">
.theme--light.v-btn {
  color: #4E7AEC;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0;
}

.btn {
  text-transform: unset !important;
  font-size: 1.5em;
}

.custom-bg {
  background-color: #1e1f22;
}

.custom_text {
  color: white;
}
</style>