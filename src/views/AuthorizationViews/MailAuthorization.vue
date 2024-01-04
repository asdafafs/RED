<template>
  <div class="no-scroll">
    <v-row align="center" justify="center" class="">
      <v-col cols="4" class=" pa-0 overflow-x-hidden">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0" class="custom-dialog">
          <v-card class="d-flex justify-space-between flex-column height width rounded-lg ma-2 " v-if="overlay">
            <v-card-title class="black--text"> Авторизация</v-card-title>
            <v-card-subtitle class="black--text">
              Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через электронную почту.
            </v-card-subtitle>
            <LogoRed class="pos"></LogoRed>
            <v-card-text class="pb-0 ">
              <v-text-field
                  solo
                  color="black"
                  v-model="email"
                  :readonly="loading"
                  :rules="[rulesEmail.required]"
                  class="mb-2"
                  clearable
                  label="Email"
              ></v-text-field>
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
              ></v-text-field>
              <v-btn color="#4E7AEC" @click="$router.push('/recoveryPassWord').catch(err => {})"
                     class="rounded-lg pa-0 ma-0" block text>
                Забыли пароль?
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-col>
                <v-btn color="#4E7AEC" @click="validateForm" class="rounded-lg pa-0 ma-0 my-1 white--text" block>
                  Войти
                </v-btn>
                <v-btn color="##E9E9E8" @click="$router.push('/')" class="rounded-lg pa-0 ma-0 my-1" block>
                  Выйти
                </v-btn>
              </v-col>
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
    overlay: true,
    form: true,
    show: false,
    email: null,
    loading: false,
    test: false,
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
            alert("Ошибка авторизации: неверный логин или пароль");
            this.password = ''
            this.test = true;
            this.wrongAuth = true;
          }
      )
    },

    async validateForm() {
      if (!this.isPasswordValid) {
        return;
      }

      const body = {"email": this.email, "password": this.password}
      await this.login(body)
      if (this.wrongAuth) ;
      else await this.$router.push('/schedule/lessons').catch(err => {
        console.log(err)
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
<style>
.width {
  width: 20em;
}

.height {
  min-height: 28rem;
}

.pos {
  align-self: center;
  transform: scale(2.1);
  margin-top: 2em;
  margin-bottom: 2em;
}

.no-scroll {
  overflow: hidden;
}

.v-overlay--active .v-overlay__scrim {
  display: none;
}

.v-overlay--active {
  backdrop-filter: blur(2px);
  background: rgb(0 0 0 / 0.8);
}

@media (prefers-color-scheme: dark) {
  .v-overlay--active {
    background: rgb(0 0 0 / 0.4);
  }
}
</style>