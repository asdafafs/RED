<template>
  <v-overlay 
    :value="overlay"
    contained
  >
    <v-row 
      align="center" 
      justify="center" 
      class="width-main-authorization-form"
    >
      <v-col cols="4" class="pa-0 d-flex justify-center">
        <v-card class="authorization-card white">
          <v-card-title class="authorization-card__title"> 
            Добро пожаловать!
          </v-card-title>
          <v-card-subtitle class="authorization-card__subtitle">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь.
          </v-card-subtitle>
          <LogoRed 
            class="authorization-card__logo"
            :height="100"
            :width="168"
          />
          <v-card-actions class="authorization-card__actions">
            <v-btn
              color="#4E7AEC"
              class="authorization-card__actions__btn__email"
              @click="LogIn"
            >
              Войти по e-mail
            </v-btn>
            <v-btn
              color="#FEFEFE"
              class="authorization-card__actions__btn__vk"
              @click="vkLogIn"
              :disabled="loginButtonDisabled"
              outlined
            >
              <vk-icon style="width: 24px; height: 24px"/>
              <span class="text--black">Войти через VK</span>
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
import loginIcon from "@/components/Icons/LoginIcon.vue";
import VkIcon from "@/components/Icons/VkIcon.vue";

export default {
  name: 'AuthorizationForm',
  components: {VkIcon, loginIcon, LogoRed},
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
      const redirectUri = `${process.env.FRONT_PAGE_URL}/post-vkLogin`
      const display = process.env.DISPLAY
      const responseType = process.env.RESPONSE_TYPE
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    },

    LogIn() {
      this.$router.push(
        {
          name: 'mail'
        }
      )
    }
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.scss";
</style>