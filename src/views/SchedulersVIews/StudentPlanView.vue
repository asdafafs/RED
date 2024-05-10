<template>
  <div>
    <div class="d-flex flex-row flex-wrap justify-space-between full-width  px-3 mb-3 align-center">
      <div class="px-0 mb-3" :class="isMobile ? 'mobile-title' : 'desk-title'">
        Личный кабинет
      </div>
      <div :class="isMobile ? 'mobile-subtitle' : 'desk-subtitle'">
        Удачи на дорогах, {{ userName }}!
      </div>
    </div>
    <v-container class="px-4 pa-0 ma-0" fluid >
      <hr class="mb-2">
      <router-view/>
    </v-container>
  </div>
</template>
<script>

import {mapState} from "vuex";

export default {
  name: 'plan',
  computed: {
    ...mapState(['user','isMobile']),
    userName() {
      return `${this.user.name} ${this.user.middleName} ${this.user.surname}`
    },

    userId() {
      return this.user.userId
    },
  },

  methods: {
    openProgressBar() {
      const currentStudentID = this.userId;
      this.$router.push({name: 'progressBar', params: {currentStudentID}}).catch(() => {
      });
    },

    async initialize() {
      this.openProgressBar()
    },
  },

  created() {
    this.initialize()
  },

  updated() {
    this.openProgressBar()
  },
}

</script>
<style lang="scss">
@import "@/assets/styles/titleStyles.css";
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/buttonStyles.css";
</style>