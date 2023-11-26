<template>
  <v-container class="pa-0" fluid style="height: 100%;">
    <v-row no-gutters align="center" style="height: 100%;">
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
  components: {LogoRed}
}
</script>