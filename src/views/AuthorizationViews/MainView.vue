<template>
  <v-row class="ma-4 overflow-x-hidden" justify="center">
    <v-row justify="center" class="overflow-x-hidden">
      <AuthorizationForm :overlay.sync="overlay"/>
    </v-row>
  </v-row>
</template>
<script>
import AuthorizationForm from "@/views/AuthorizationViews/SelectAuthorization.vue";

export default {
  components: {AuthorizationForm},
  data: () => ({
    overlay: true,
  }),
}
</script>
