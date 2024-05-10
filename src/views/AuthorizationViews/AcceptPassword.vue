<template>
  <div>
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="accept-password-card ">
            <div class="logo-container">
              <LogoRed
                  class="logo-container__image"
                  :height="50"
                  :width="84"
              />
            </div>
            <v-card-title class="accept-password-card__title">
              Создание пароля
            </v-card-title>
            <v-card-subtitle class="accept-password-card__subtitle">
              Придумайте пароль для входа
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <v-text-field
                  solo dense outlined hide-details
                  v-model="password"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  name="input-10-1"
                  label="Пароль"
                  hint="Минимум 8 символов"
                  counter
                  autocomplete="new-password"
                  class="mb-2 accept-password-card__field"
                  :type="show ? 'text' : 'password'"
              >
                <template v-slot:append>
                  <span class="material-icons" v-if="show" @click="show = false">visibility</span>
                  <span class="material-icons" v-else @click="show = true">visibility_off</span>
                </template>
              </v-text-field>
              <v-text-field
                  solo dense outlined hide-details
                  v-model="passwordRepeat"
                  :rules="[rulesPassword.required, rulesPassword.min, checkPasswordMatch]"
                  name="input-10-2"
                  label="Повторите пароль"
                  hint="Минимум 8 символов"
                  counter
                  autocomplete="new-password"
                  @click:append="showPasswordRepeat = !showPasswordRepeat"
                  class="accept-password-card__field"
                  :type="showPasswordRepeat ? 'text' : 'password'"
              >
                <template v-slot:append>
                  <span class="material-icons" v-if="showPasswordRepeat"
                        @click="showPasswordRepeat = false">visibility</span>
                  <span class="material-icons" v-else @click="showPasswordRepeat = true">visibility_off</span>
                </template>
              </v-text-field>
            </v-card-text>
            <v-card-actions class="accept-password-card__actions">
              <v-btn 
                color="#4E7AEC"
                @click="validatePassword"
                class="accept-password-card__actions__btn white--text"
                block
                :disabled="loginButtonDisabled || passwordsMatch"
                @keydown.enter="validatePassword"
              >
                Сохранить и войти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";
import LogoRed from "@/components/logos/LogoRed.vue";

export default {
  name: 'AcceptPassword',
  components: {LogoRed},
  data: () => ({
    overlay: true,
    loginButtonDisabled: false,
    show: false,
    showPasswordRepeat: false,
    value: '',
    password: '',
    passwordRepeat: '',
    rulesPassword: {
      required: value => !!value || 'Введите пароль.',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    }
    ,
  }),
  computed: {
    passwordsMatch() {
      return !(this.password === this.passwordRepeat);
    },
    checkPasswordMatch() {
      return value => (value === this.password ? true : 'Пароли не совпадают');
    },
  },

  methods: {
    async newPassword(body) {
      this.loginButtonDisabled = true
      const password = new IdentityRequest()
      await password.postPasswordNewUser(body).finally(() => {
        this.loginButtonDisabled = false
      })
    },

    validatePassword() {
      if (!(this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true)) {
        return;
      }

      const body = {
        "userId": parseInt(this.$route.query.userId),
        "password": this.password,
        "code": this.$route.query.code
      }
      this.newPassword(body)
      this.$router.push({name: 'main'}).catch(err => {
        console.log(err)
      })
      this.overlay = false;
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.scss";


</style>