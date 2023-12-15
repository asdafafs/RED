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
    let identity = new IdentityRequest()
    await identity.getIdentity()
        .then(async () =>  this.isDataLoaded = true,
            )
    // await store.dispatch('GET_CURRENT_USER', response)

  }
};
</script>
<style>

</style>