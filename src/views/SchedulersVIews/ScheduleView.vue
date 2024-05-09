<template>
  <v-container class="px-3 pa-0 ma-0" fluid v-if="true">
    <div class="d-flex flex-row justify-space-between full-width mb-3 align-center " v-if="isMobile">
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
  computed: {
    ...mapState(['user','isMobile']),
    userName() {
      return `${this.user.name} ${this.user.middleName} ${this.user.surname}`
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/titleStyles.css";
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/weekScheduleStyles.css";
</style>