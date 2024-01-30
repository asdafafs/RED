<template>
  <div>
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2 width">
            <v-card-title class="black--text"> Восстановление пароля</v-card-title>
            <v-card-subtitle class="black--text">
              Введите новый пароль
            </v-card-subtitle>
            <v-card-text class="pb-0 ">
              <v-text-field
                  solo
                  v-model="password"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  name="input-10-1"
                  label="Пароль"
                  hint="Минимум 8 символов"
                  counter
              ></v-text-field>
              <v-text-field
                  solo
                  v-model="passwordRepeat"
                  :append-icon="show ? 'mdi-eye ' : 'mdi-eye-off '"
                  :rules="[rulesPassword.required, rulesPassword.min, checkPasswordMatch]"
                  :type="show ? 'text' : 'password'"
                  name="input-10-2"
                  label="Повторите пароль"
                  hint="Минимум 8 символов"
                  counter
                  @click:append="show = !show"
              ></v-text-field>
              <v-alert v-if="!passwordsMatch" type="error">Пароли не совпадают</v-alert>
            </v-card-text>
            <v-card-actions v-if="passwordsMatch">
              <v-btn color="#4E7AEC" @click="validatePassword" class="rounded-lg pa-0 white--text" block :disabled="loginButtonDisabled">
                Обновить пароль
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

export default {
  name: 'ForgetPassword',
  components: {},
  data: () => ({
    overlay: true,
    loginButtonDisabled: false,
    show: false,
    loading: false,
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
      return this.password === this.passwordRepeat;
    },
    checkPasswordMatch() {
      return value => (value === this.password ? true : 'Пароли не совпадают');
    },
  },
  async mounted() {
    const userId = this.$route.query.userId
    const code = this.$route.query.code
    await this.confirmEmail(userId, code)
  },
  methods: {
    async confirmEmail(userId, code) {
      const identity = new IdentityRequest()
      await identity.postNewPassword({userId, code}).then(() => {
        console.log("test")
        identity.getIdentity();
        this.$router.push({name: 'main'})
      })
    },

    async newPassword(body) {
      const password = new IdentityRequest()
      await password.postNewPassword(body)
    },

    validatePassword() {
      if (!(this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true)) {
        return;
      }
      this.loginButtonDisabled = true
      const body = {
        "userId": 0,
        "newPassword": this.password,
        "code": "string"
      }
      this.newPassword(body)
      alert('пароль сменен')
      this.$router.push({name: 'main'}).catch(err => {
        console.log(err)
      })
      this.overlay = false;
    }
  }
}
</script>
<style>
.width {
  width: 20em;
}
</style>