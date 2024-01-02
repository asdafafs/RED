<template>
  <v-app>
    <AppBar :isDataLoaded="isDataLoaded">
    </AppBar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar/AppBar.vue";
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";

export default {
  name: 'App',
  components: {AppBar},

  data: () => ({
    isDataLoaded: false

  }),
  async created() {
    const identity = new IdentityRequest()
    identity.getIdentity()
        .then(async (x) => {
          await store.dispatch('GET_CURRENT_USER', x)
          this.isDataLoaded = true
        })
    //добавить проверку старой авторизации


  }
};
</script>
<style>

</style>