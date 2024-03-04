<template>
  <v-container class="pa-0 ma-0 height-container" fluid>
    <v-row no-gutters align="center" class="height-container">
      <v-col cols=12 class="d-flex justify-center align-center">
        <LogoRed></LogoRed>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue"

export default {
  name: 'DesktopLogo',
  components: {LogoRed},
}
</script>
<style>
@import "@/assets/styles/containerStyles.css";
</style>