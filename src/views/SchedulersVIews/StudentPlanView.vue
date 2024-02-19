<template>
  <div>
    <v-container class="px-4 pa-0 ma-0" fluid v-if="showDrawer">
      <v-row no-gutters align="center" class="spacer">
        <v-col lg="">
          <div class="text-h4 font-weight-bold">Здравствуйте, {{ userName }}!</div>
        </v-col>
        <v-col lg="3" class="align-self-end text-start justify-start">
          <div class="text-subtitle-1 uno">{{ groupId }}</div>
        </v-col>
        <v-col cols="">
        </v-col>
        <v-col cols="1">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(0); $router.push({name: 'plan-main-month'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[0],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[0],}">Календарь</span>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(1); $router.push({name: 'progress'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[1],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[1],}">Прогресс</span>
          </v-btn>
        </v-col>
      </v-row>
      <hr>
      <router-view></router-view>
    </v-container>
    <v-container class="px-4 pa-0 ma-0" fluid v-if="!showDrawer">
      <v-row>
        <v-col cols="">
          <div class="text-lg-h3 text-md-h4 text-sm-h5 text-xs-h5 font-weight-bold">
            Здравствуйте, {{ userName }}!
          </div>
          <div class="text-subtitle-1 uno">Вы зачислены в группу №{{ groupId }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(0); $router.push({name: 'plan-main-day'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[0],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[0],}">Календарь</span>
          </v-btn>
        </v-col>
        <v-col cols="">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(1); $router.push({name: 'progress'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[1],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[1],}">Прогресс</span>
          </v-btn>
        </v-col>
      </v-row>
      <hr>
      <router-view></router-view>
    </v-container>
  </div>
</template>
<script>

import {mapState} from "vuex";

export default {
  components: {},
  data: () => ({
    showDrawer: true,
  }),
  methods: {
    changeButtonMenuState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonMenuPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonMenuPressed, index, true);
      this.lastPressedIndex = index;
    },
    checkWindowWidth() {
      this.showDrawer = window.innerWidth >= 1260;
    },
  },
  computed: {
    ...mapState(['user']),
    userName() {
      return this.user.name
    },

    groupId() {
      if (this.user.groupId != null)
        return `Вы зачислены в группу № ${this.user.groupId}`
      else
        return 'Вы пока не зачислены в группу'
    },

    isButtonMenuPressed(){
      return [this.$route.path.startsWith('/testPlan/mainCal'), this.$route.path.startsWith('/testPlan/progress')]
    }

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
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/buttonStyles.css";
</style>