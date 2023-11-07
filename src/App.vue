<template>
  <v-app>
    <AppBar>
    </AppBar>
    <v-main>
      <router-view/>
      <v-sheet>
      <v-container style="height: 1000px"> </v-container>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>

import AppBar from "@/components/AppBar.vue";

export default {
  name: 'App',
  components: {AppBar},

  data: () => ({

    //
  }),
};
</script>
