<template>
  <div class="no-scroll">
    <v-row
        align="center"
        justify="center"
    >
      <v-col cols="4" class="pa-0 overflow-x-hidden">
        <v-dialog
            persistent
            width="auto"
            content-class="elevation-0"
        >
          <v-card
              class="mail-authorization-card"
          >
            <div class="logo-container">
              <LogoRed
                  class="mail-authorization-card__logo"
                  :height="50"
                  :width="84"
              />
            </div>
            <v-card-title class="mail-authorization-card__title">
              Авторизация
            </v-card-title>
            <v-card-subtitle class="mail-authorization-card__subtitle">
              Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь.
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <v-text-field
                  color="black"
                  v-model="email"
                  :readonly="false"
                  :rules="[rulesEmail.required]"
                  class="mb-2 mail-authorization-card__field "
                  label="E-mail"
                  outlined
                  dense
              >
                <template v-slot:append>
                  <span class="material-icons" @click="email=''">close</span>
                </template>
              </v-text-field>
              <v-text-field
                  color="black"
                  v-model="password"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  :type="show ? 'text' : 'password'"
                  name="input-10-4"
                  label="Пароль"
                  hint="Минимум 8 символов"
                  dense
                  counter
                  outlined
                  class="mail-authorization-card__field"
              >
                <template v-slot:append>
                  <span class="material-icons" v-if="show" @click="show = false">visibility</span>
                  <span class="material-icons" v-else @click="show = true">visibility_off</span>
                </template>
              </v-text-field>
              <span @click="forgetPassword" class="authorization-card__actions__btn" style="color: #4E7AEC">
                Забыли пароль?
              </span>
            </v-card-text>
            <v-card-actions class="mail-authorization-card__actions py-0">
              <v-btn
                  color="#4E7AEC"
                  @click="validateForm"
                  class="authorization-card__actions__btn white--text"
                  :disabled="loginButtonDisabled"
              >
                Войти
              </v-btn>
              <v-btn
                  color="#2B2A29"
                  text
                  @click="logout"
                  class="authorization-card__actions__btn"
                  :disabled="loginButtonDisabled"
              >
                Отмена
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
    show: false,
    email: null,
    loginButtonDisabled: false,
    password: '',
    rulesEmail: {
      required: value => !!value || 'Введите email'
    },
    rulesPassword: {
      required: value => !!value || 'Введите пароль',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    },
    wrongAuth: false,
  }),

  computed: {
    isPasswordValid() {
      return this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true;
    },
  },

  methods: {
    async login(body) {
      this.wrongAuth = false;
      const login = new IdentityRequest()
      const identity = new IdentityRequest()
      const response =  await login.postLogin(body).catch(() => {
            this.password = ''
            this.wrongAuth = true;
          }
      )
      console.log(response.status)
      if (response.status === 200) {
        await identity.getIdentity()
            .then((x) => {
              this.$store.dispatch('GET_CURRENT_USER', x);
            });
      } else {
        this.wrongAuth = true;
      }
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
    async validateForm()
    {
      if (!this.isPasswordValid) return
      this.loginButtonDisabled = true
      const body = {
        "email": this.email,
        "password": this.password
      }
      new IdentityRequest();
      await this.login(body).finally(() => {
        this.loginButtonDisabled = false
      })
      if (!this.wrongAuth) {
        await this.$router.push({name: 'schedule-lessons'}).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loginButtonDisabled = false
        })
      }
    }
  },

};
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.scss";

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

.no-scroll {
  overflow: hidden;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-left: 16px;
}
</style>