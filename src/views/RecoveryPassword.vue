<template>
  <div>
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent  width="auto" content-class="elevation-0">
          <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2 width" v-if="form">
            <v-card-title class="black--text"> Восстановление пароля</v-card-title>
            <v-card-subtitle class="black--text">
              Для восстановления пароля введите номер телефона
            </v-card-subtitle>
            <v-card-text class="pb-0 " >
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
            </v-card-text>
            <v-card-actions>
              <v-btn
                  color="#4E7AEC"
                  @click=" validateEmail"
                  class="rounded-lg pa-0 white--text"
                  block
              >
                Ввести новый пароль
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2 width" v-if="!form">
            <v-card-title class="black--text"> Восстановление пароля</v-card-title>
            <v-card-subtitle class="black--text">
              Введите новый пароль
            </v-card-subtitle>
            <v-card-text class="pb-0 " >
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
                  :append-icon="show2 ? 'mdi-eye ' : 'mdi-eye-off '"
                  :rules="[rulesPassword.required, rulesPassword.min, checkPasswordMatch]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-2"
                  label="Повторите пароль"
                  hint="Минимум 8 символов"
                  counter
                  @click:append="show2 = !show2"
              ></v-text-field>
              <v-alert v-if="!passwordsMatch" type="error">Пароли не совпадают</v-alert>
            </v-card-text>
            <v-card-actions v-if="passwordsMatch">
              <v-btn
                  color="#4E7AEC"
                  @click="validatePassword"
                  class="rounded-lg pa-0 white--text"
                  block
              >
                Ввести новый пароль
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'RecoveryPassword',
  components: { },
  data:() =>({
    overlay: true,
    form:true,
    show2: false,
    email: null,
    loading: false,
    value: '',
    password: '',
    passwordRepeat:'',
    rulesEmail:{
      required: v=>!!v || 'Введите email'
    },
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
    isEmailValid(){
      return this.rulesEmail.required(this.email) === true
    }
  },
  methods:{
    validateEmail() {
      if (!this.isEmailValid) {
        return;
      }
      this.form = false
    },
    validatePassword(){
      if(!(this.rulesPassword.required(this.password) === true && this.rulesPassword.min(this.password) === true)) {
        return;
      }
      this.$router.push( '/post-login' ).catch(err => {})
      this.overlay = false;
    }
  },
}
</script>
<style scoped>
.width {
  width: 20em;
}
</style>