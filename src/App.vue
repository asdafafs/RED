<template>
  <v-app>
    <AppBar :isDataLoaded="user.userId !== null">
    </AppBar>
    <v-main id="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar/AppBar.vue";
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";
import {mapState} from "vuex";

export default {
  name: 'App',
  components: { AppBar},
  data: () => ({
    isUserLoaded: false
  }),

  async created() {
    const identity = new IdentityRequest()

    const isRetry = this.$route.query.retry
    const isConfirmRequired = this.$route.query.isConfirmRequired

    if (this.$route.path === '/post-login'
        ||
        isRetry
        ||
        isConfirmRequired
        ||
        this.$route.path === '/confirm-email'
        ||
        this.$route.path === '/registration') return

    identity.getIdentity()
        .then(async (x) => {
          await store.dispatch('GET_CURRENT_USER', x)

          if (this.$route.path === '/')
            await this.$router.push({
              name: 'schedule-lessons'
            })
        }).finally(() => {

    })
  },
  computed: {
    ...mapState(['user'])
  },
};
</script>