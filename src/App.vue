<template>
  <v-app>
    <AppBar :isDataLoaded="user.userId !== null">
    </AppBar>
    <v-main>
      <Alert/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar/AppBar.vue";
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";
import Alert from "@/components/Alerts/Alert";
import {mapState} from "vuex";

export default {
  name: 'App',
  components: {Alert, AppBar},
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
            await this.$router.push('/schedule/lessons')
        })
  },
  computed: {
    ...mapState(['user'])
  },
};
</script>