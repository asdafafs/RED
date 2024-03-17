<template>
  <v-app>
    <AppBar :isDataLoaded="isDataLoaded"/>
    <v-main id="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar/AppBar.vue";
import store from "@/store";
import {mapState} from "vuex";

export default {
  name: 'App',
  components: { AppBar},
  created() {
    const isRetry = this.$route.query.retry
    const isConfirmRequired = this.$route.query.isConfirmRequired
    if (this.$route.path === '/post-login' 
        || isRetry
        || isConfirmRequired
        || this.$route.path === '/confirm-email'
        || this.$route.path === '/registration') return
    this.getUserInfo()
  },
  computed: {
    ...mapState(['user']),
    isDataLoaded() {
      return !!this.user.userId
    }
  },
  methods:{
    async getUserInfo() {
      await store.dispatch('GET_CURRENT_USER')
    }
  }
};
</script>