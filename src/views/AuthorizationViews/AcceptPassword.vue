<template>
  <div >
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="d-flex flex-column white rounded-lg ma-2 width" style="height: 260px !important;">
            <v-card-title class="black--text pl-4 pr-4" style="font-size: 32px; font-weight: 700; padding-bottom: 0"> Создание пароля</v-card-title>
            <v-card-subtitle class="black--text mt-4 pl-4 pr-4" style="font-size: 16px; font-weight: 400;padding-bottom: 0">
              Придумайте пароль для входа
            </v-card-subtitle>
            <v-card-text class="d-flex flex-column mt-4 mb-4 pb-0 pl-4 pr-4">
              <v-text-field
                  solo dense outlined hide-details
                  v-model="password"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  name="input-10-1"
                  label="Пароль"
                  hint="Минимум 8 символов"
                  counter
                  autocomplete="new-password"
                  style="border-radius: 12px !important; margin-bottom: 8px"
              />
              <v-text-field
                  solo dense outlined hide-details
                  v-model="passwordRepeat"
                  :rules="[rulesPassword.required, rulesPassword.min, checkPasswordMatch]"
                  name="input-10-2"
                  label="Повторите пароль"
                  hint="Минимум 8 символов"
                  counter
                  autocomplete="new-password"
                  @click:append="show = !show"
                  style="border-radius: 12px !important;"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="#4E7AEC" @click="validatePassword" class="rounded-lg pa-0 white--text" block :disabled="loginButtonDisabled || passwordsMatch">
                Добавить пароль
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
  name: 'AcceptPassword',
  components: {},
  data: () => ({
    overlay: true,
    loginButtonDisabled: false,
    blockButtonWhenRequest: false,
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
      return !(this.password === this.passwordRepeat);
    },
    checkPasswordMatch() {
      return value => (value === this.password ? true : 'Пароли не совпадают');
    },
  },
  async mounted() {
  },
  methods: {
    async newPassword(body) {
      this.loginButtonDisabled = true
      const password = new IdentityRequest()
      await password.postPasswordNewUser(body).finally(() => {this.loginButtonDisabled = false})
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
.width {
  width: 20em;
}

</style>