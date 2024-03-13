<template>
  <v-container class="px-0 pa-0 ma-0 " fluid>
<!--    <v-row class="">-->
<!--      <v-col cols="12" class="">-->
        <div class="text-h5 font-weight-bold">Мое расписание</div>
<!--      </v-col>-->
<!--    </v-row>-->
    <v-row class="d-flex mt-0 ga-3" no-gutters>
      <v-col sm="3" md="3" lg="1">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[0],}"
               @click="changeButtonState(0);
                 $router.push({name: 'plan-main-day'}).catch(() => {})"
        >
          <span :class="{ 'tab-button-text':isButtonPressed[0]}">День</span>
        </v-btn>
      </v-col>
      <v-col sm="3" md="3" lg="1">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[1]}"
               @click="changeButtonState(1);
                 $router.push({name: 'plan-main-week'}).catch(() => {})">
          <span :class="{ 'tab-button-text':isButtonPressed[1]}">Неделя</span>
        </v-btn>
      </v-col>
      <v-col sm="3" md="3" lg="1">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[2]}"
               @click="changeButtonState(2);
                 $router.push({name: 'plan-main-month'}).catch(() => {})">
          <span :class="{ 'tab-button-text': isButtonPressed[2]}">Месяц</span>
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
  name: 'MainCalendar',
  data: () => ({}),
  computed: {
    isButtonPressed() {
      return [this.$route.path.includes('testDay'), this.$route.path.includes('testWeek'), this.$route.path.includes('testMonth')]
    }
  },
  methods: {
    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
</style>