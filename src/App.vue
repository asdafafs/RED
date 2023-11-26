<template>
  <v-app>
    <AppBar>
    </AppBar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar/AppBar.vue";

export default {
  name: 'App',
  components: {AppBar},

  data: () => ({

    //
  }),
};
</script>
<style>

</style>