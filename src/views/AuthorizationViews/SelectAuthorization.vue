<template>
  <v-overlay :value="overlay" contained class="">
    <v-row align="center" justify="center" class="width-main-authorization-form ">
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column height white rounded-lg ma-2">
          <v-card-title class="black--text"> Добро пожаловать!</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-alert v-if="message" type="success">
            {{ message }}
          </v-alert>
          <v-card-actions class="flex-column">
            <v-btn color="#4E7AEC" @click="$router.push({name: 'mail'}).catch(() => {})"
                   class="rounded-lg pa-0 ma-0 my-1" block>
              Войти
            </v-btn>
            <v-btn color="#4E7AEC" @click="vkLogIn"
                   class="rounded-lg pa-0 ma-0 my-1" block :disabled="loginButtonDisabled">
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
import ConfirmEmailMessageMixin from "@/mixins/ConfirmEmailMessageMixin";

export default {
  name: 'AuthorizationForm',
  components: {LogoRed},
  mixins: [ConfirmEmailMessageMixin],
  props: {
    overlay: {
      type: Boolean,
      required: true
    }
  },
  data:() =>({
    loginButtonDisabled: false
  }),
  methods: {
    async vkLogIn() {
      this.loginButtonDisabled = true
      const clientId = process.env.CLIENT_ID
      const redirectUri = process.env.REDIRECT_URI
      const display = process.env.DISPLAY
      const responseType = process.env.RESPONSE_TYPE
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    },
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.css";
</style>