<template>
  <div class="no-scroll">
    <v-row 
      align="center" 
      justify="center"
    >
      <v-col cols="4" class="pa-0 overflow-x-hidden">
        <v-dialog 
          v-model="overlay" 
          persistent 
          width="auto" 
          content-class="elevation-0" 
        >
          <v-card 
            v-if="overlay" 
            class="mail-authorization-card height"
          >
            <v-card-title class="mail-authorization-card__title"> Авторизация</v-card-title>
            <v-card-subtitle class="mail-authorization-card__subtitle">
              Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь.
            </v-card-subtitle>
            <LogoRed
                v-if="!message"
                class="mail-authorization-card__logo"
                :height="50"
                :width="84"
            />
            <v-card-text class="pb-0">
              <v-alert v-if="message" type="error">
                {{ message }}
              </v-alert>
              <v-text-field
                solo
                color="black"
                v-model="email"
                :readonly="loading"
                :rules="[rulesEmail.required]"
                class="mb-2"
                clearable
                label="Email"
              />
              <v-text-field
                solo
                color="black"
                v-model="password"
                :append-icon="show ? 'mdi-eye ' : 'mdi-eye-off '"
                :rules="[rulesPassword.required, rulesPassword.min]"
                :type="show ? 'text' : 'password'"
                name="input-10-4"
                label="Пароль"
                hint="Минимум 8 символов"
                counter
                @click:append="show = !show"
              />
              <v-btn 
                color="#4E7AEC" 
                @click="forgetPassword"
                class="rounded-lg pa-0 ma-0" block text
              >
                Забыли пароль?
              </v-btn>
            </v-card-text>
            <v-card-actions class="mail-authorization-card__actions">
                <v-btn 
                  color="#4E7AEC" 
                  @click="validateForm" 
                  class="authorization-card__actions__btn white--text"
                  :disabled="loginButtonDisabled"
                >
                  Войти
                </v-btn>
                <v-btn 
                  color="#E9E9E8" 
                  @click="logout" 
                  class="authorization-card__actions__btn" 
                  :disabled="loginButtonDisabled"
                >
                  Выйти
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue";
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: 'MailAuthorization',
  components: {LogoRed},
  data: () => ({
    message: null,
    overlay: true,
    form: true,
    show: false,
    email: null,
    loading: false,
    loginButtonDisabled: false,
    value: '',
    password: '',
    rulesEmail: {
      required: v => !!v || 'Введите email'
    },
    rulesPassword: {
      required: value => !!value || 'Введите пароль',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    },
    wrongAuth: false,
  }),
  methods: {
    async login(body) {
      const login = new IdentityRequest()
      await login.postLogin(body).catch(() => {
            this.message = "Неверный пользователь или пароль";
            this.password = ''
            this.wrongAuth = true;
          }
      )
    },
    logout() {
      this.$router.push(
        {
          name: 'main'
        }
      )
    },
    forgetPassword() {
      this.$router.push(
        {
          name: 'recPass'
        }
      )
    },
    async validateForm() {
      if (!this.isPasswordValid) {
        return;
      }
      this.loginButtonDisabled = true
      const body = {"email": this.email, "password": this.password}
      await this.login(body)
      const identity = new IdentityRequest()
      await identity.getIdentity()
          .then((x) => {
            this.$store.dispatch('GET_CURRENT_USER', x)
          }).finally(() => {
            this.loginButtonDisabled = false
            console.log(this.loginButtonDisabled)
          })
      if (this.wrongAuth) ;
      else
        await this.$router.push({name: 'schedule-lessons'}).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loginButtonDisabled = false
          console.log(this.loginButtonDisabled)
        })
    }
  },
  computed: {
    isPasswordValid() {
      return this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.scss";

.no-scroll {
  overflow: hidden;
}
</style>