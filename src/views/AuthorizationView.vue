<script>
import AuthorizationForm from "@/views/VkAuthorization.vue";

export default {
    components: {AuthorizationForm},
    data: () => ({
      overlay: true,
    }),
  }
</script>

<template>
 <v-row
    align="center"
    class="ma-4"
    justify="center"
  >
      <v-row justify="center">
        <AuthorizationForm :overlay.sync="overlay"/>
      </v-row>
  </v-row>
</template>