<template>
  <v-overlay :value="overlay"  contained class="blur" >
    <v-row align="center" justify="center" class="width ">
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column height white rounded-lg ma-2">
          <v-card-title class="black--text"> Добро пожаловать!</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-card-actions class="flex-column">
            <v-btn
                color="#4E7AEC"
                @click="$router.push('/mail').catch(err => {})"
                class="rounded-lg pa-0 ma-0"
                block
            >
              Войти
            </v-btn>
            <v-btn
                color="#4E7AEC"
                @click="$router.push('/recoveryPassWord').catch(err => {})"
                class="rounded-lg pa-0 ma-0"
                block
                text
            >
              Забыли пароль?
            </v-btn>
            <v-btn
                color="#4E7AEC"
                @click="$router.push('/registration').catch(err => {})"
                class="rounded-lg pa-0 ma-0"
                block
            >
              Регистрация
            </v-btn>
            <v-btn
                color="#4E7AEC"
                @click="$emit('update:overlay', false); vkLogIn ; $router.push('/post-login').catch(err => {})"
                class="rounded-lg pa-0 ma-0"
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
  methods: {
    async vkLogIn() {
      console.log('here')
      const clientId = '51785736'
      const redirectUri = 'http://red.mlsat.ru/post-login'
      const display = 'popup'
      const responseType = 'code'
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    }
  }


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
  min-height: 28rem;
}

.pos {
  align-self: center;
  transform: scale(2.1);
}
</style>