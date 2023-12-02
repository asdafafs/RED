<template>
  <v-container class="pa-0 my-0" fluid>
    <v-row no-gutters>
      <v-col cols=12>
        <v-container class="pa-0 height-container" fluid>
          <v-row no-gutters align="center" class="height-container">
            <v-col cols="2" class="d-flex justify-center align-center">
              <v-app-bar-nav-icon color="white" variant="text" @click="$emit('update:drawer',  !drawer);">
              </v-app-bar-nav-icon>
            </v-col>
            <v-col cols=8 class="d-flex justify-center align-center">
              <LogoRed></LogoRed>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue"

export default {
  name: 'MovileAppBar',
  components: {LogoRed},
  props: {
    drawer: {}
  },
  methods: {
    clickLog(drawer) {
      console.log(drawer)
    }
  }
}
</script>
<style>
.height-container {
  height: 100%;
}
</style>