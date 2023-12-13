<template>
  <div>
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2 width">
            <v-card-title class="black--text"> Восстановление пароля</v-card-title>
            <v-card-subtitle class="black--text">
              Для восстановления пароля введите номер телефона
            </v-card-subtitle>
            <v-card-text class="pb-0 ">
              <v-text-field
                  solo
                  color="black"
                  v-model=email
                  :readonly="loading"
                  :rules="[rulesEmail.required]"
                  class="mb-2"
                  clearable
                  label="Email"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-col>
                <v-btn color="#4E7AEC" @click=" validateEmail" class="rounded-lg pa-0 white--text" block>
                  Ввести новый пароль
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
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: 'RecoveryPassword',
  components: {},
  data: () => ({
    overlay: true,
    email: "",
    loading: false,
    rulesEmail: {
      required: v => !!v || 'Введите email'
    },
  }),
  computed: {
    // passwordsMatch() {
    //   return this.password === this.passwordRepeat;
    // },
    // checkPasswordMatch() {
    //   return value => (value === this.password ? true : 'Пароли не совпадают');
    // },
    isEmailValid() {
      return this.rulesEmail.required(this.email) === true
    }
  },
  methods: {
    async checkEmail(body) {
      const email = new IdentityRequest()
      await email.postForgetPassword({"email": body})
    },

    validateEmail() {
      if (!this.isEmailValid) {
        return;
      }
      console.log(this.email)
      this.checkEmail(this.email);
      alert('проверьте почтовый ящик');
      this.$router.push('/').catch(err => {
        console.log(err)
      })
    },
    // validatePassword() {
    //   if (!(this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true)) {
    //     return;
    //   }
    //   const body = {
    //     "userId": 0,
    //     "newPassword": this.password,
    //     "code": "string"
    //   }
    //   this.newPassword(body)
    //   this.$router.push('/forget-password').catch(err => {
    //     console.log(err)
    //   })
    //   this.overlay = false;
    // }
  },
}
</script>
<style scoped>
.width {
  width: 20em;
}
</style>