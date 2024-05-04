<template>
  <v-container class="px-3 pa-0 ma-0" fluid v-if="true">
    <div class="d-flex flex-row justify-space-between full-width mb-3 align-center " v-if="showDrawer">
      <div class="d-flex flex-column" >
        <div  class="mobile-subtitle">
          Удачи на дорогах, {{ userName }}!
        </div>
        <div class=" px-0 mobile-title">
          Расписание
        </div>
      </div>
    </div>
    <div class="d-flex flex-row justify-space-between full-width mb-3 align-center " v-else>
        <div class=" px-0 desk-title">
          Расписание
        </div>
        <div class="desk-subtitle">
          Удачи на дорогах, {{ userName }}!
        </div>
    </div>
    <hr>
    <v-row>
      <v-col class="pa-0">
        <router-view/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {mapState} from "vuex";

export default {
  components: {},
  data: () => ({
    showDrawer: true,
  }),

  computed: {
    ...mapState(['user']),

    userName() {
      return `${this.user.name} ${this.user.middleName} ${this.user.surname}`
    },
  },

  methods: {
    checkWindowWidth() {
      this.showDrawer = window.innerWidth <= 1260;
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
@import "@/assets/styles/titleStyles.css";
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/weekScheduleStyles.css";
</style>