<template>
  <div>
    <v-row align="center" justify="center" class="">
      <v-col cols="4" class=" pa-0">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="d-flex justify-space-between flex-column height width rounded-lg ma-2" v-if="overlay">
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
                  :append-icon="show1 ? 'mdi-eye ' : 'mdi-eye-off '"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-4"
                  label="Пароль"
                  hint="Минимум 8 символов"
                  counter
                  @click:append="show1 = !show1"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-col>
                <v-btn color="#4E7AEC" @click="validateForm" class="rounded-lg pa-0 white--text" block>
                  Войти
                </v-btn>
                <v-btn color="##E9E9E8" @click="$router.push('/')" class="rounded-lg pa-0" block>
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
    show1: false,
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
    wrongAuth: false

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
      else await this.$router.push('/post-login').catch(err =>{console.log(err)})
      this.wrongAuth = true;
    }
  },
  computed: {
    isPasswordValid() {
      return this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true;
    },
  },
};
</script>
<style scoped>
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

</style>