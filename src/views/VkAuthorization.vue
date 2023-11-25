<template>
  <v-overlay
      :value="overlay"
      contained
      class="blur"
  >
    <v-row align="center" justify="center" class="width ">
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column height white rounded-lg ma-2">
          <v-card-title class="black--text"> Добро пожаловать!</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-card-actions>
            <v-btn
                color="#4E7AEC"
                @click="$emit('update:overlay', false) "
                class="rounded-lg pa-0 "
                block
            >
              Войти через VK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue"

export default {
  name: 'AuthorizationForm',
  components: {LogoRed},
  props: {
     overlay: {
       type: Boolean,
       required: true
     }
  },


}
</script>
<style scoped>
.blur {
  backdrop-filter: blur(0px);
}

.width {
  width: 60em;
}

.height {
  min-height: 20rem;
}

.pos {
  align-self: center;
  transform: scale(2.1);

}
</style>