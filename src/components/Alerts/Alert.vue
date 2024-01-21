<template>
  <v-alert
      :type="alertType"
      v-if="isActive"
  >
    {{ message }}
  </v-alert>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Alert.vue",
  computed: {
    ...mapState('AlertStore', ['message']),
    ...mapState('AlertStore', ['isActive']),
    ...mapState('AlertStore', ['alertType'])
  }
}
</script>

<style scoped>

</style>