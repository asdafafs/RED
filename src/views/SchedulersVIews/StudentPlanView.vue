<template>
  <div>
    <div class="d-flex flex-row flex-wrap justify-space-between full-width  px-3 mb-3 align-center">
      <div class="px-0 mb-3" :class="showDrawer ? 'mobile-title' : 'desk-title'">
        Личный кабинет
      </div>
      <div :class="showDrawer ? 'mobile-subtitle' : 'desk-subtitle'">
        Удачи на дорогах, {{ userName }}
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
  components: {},
  data: () => ({
    showDrawer: true,
  }),


  computed: {
    ...mapState(['user']),
    userName() {
      return `${this.user.name} ${this.user.middleName} ${this.user.surname}`
    },

    userId() {
      return this.user.userId
    },
  },

  methods: {
    checkWindowWidth() {
      this.showDrawer = window.innerWidth <= 1260;
    },

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
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
    this.initialize()

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
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