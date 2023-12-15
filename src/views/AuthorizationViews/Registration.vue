<template>
  <div class="">
    <v-row align="center" justify="center" class=" width">
      <v-col cols="4" class=" pa-0">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0" class="">
          <v-card class="d-flex justify-space-between flex-column height width rounded-lg ma-2 " v-if="overlay">
            <v-card-title class="black--text"> Регистрация</v-card-title>
            <v-card-subtitle class="black--text">
              Для продолжения работы в RED: Расписание, пожалуйста, зарегистрируйтесь
            </v-card-subtitle>
            <LogoRed class="pos"></LogoRed>
            <v-card-text class="pb-0 ">
              <v-text-field v-model="name" solo label="Фамилия" :rules="[rulesFullname.required]"></v-text-field>
              <v-text-field v-model="surname" solo label="Имя" :rules="[rulesFullname.required]"></v-text-field>
              <v-text-field v-model="middleName" solo label="Отчество" :rules="[rulesFullname.required]"></v-text-field>
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
              <vue-text-mask class="phone" v-model="phoneNumber" :mask="mask" placeholderChar="#"></vue-text-mask>
              <v-col v-if="!isPhoneNumberValid" class="red--text">{{ requiredMessage }}</v-col>
              <v-text-field
                  solo
                  v-model="password"
                  :rules="[rulesPassword.required, rulesPassword.min]"
                  :append-icon="showPass ? 'mdi-eye ' : 'mdi-eye-off '"
                  :type="showPass ? 'text' : 'password'"
                  @click:append="showPass = !showPass"
                  name="input-10-1"
                  label="Пароль"
                  counter
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-col>
                <v-btn color="#4E7AEC" @click="validateForm" class="rounded-lg pa-0 white--text" block>
                  Зарегистрироваться
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
import VueTextMask from "vue-text-mask";
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: 'AuthorizationForm',
  components: {VueTextMask, LogoRed},
  data: () => ({
    overlay: true,
    showPass: true,
    loading: false,
    show1: false,
    email: '',
    name: '',
    surname: '',
    middleName: '',
    phoneNumber: '7',
    requiredMessage: 'Номер телефона обязателен',
    password: '',
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    rulesFullname: {
      required: v => !!v || 'Введите ФИО'
    },
    rulesEmail: {
      required: v => !!v || 'Введите email'
    },
    rulesPassword: {
      required: value => !!value || 'Введите пароль.',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    },
    smsCode: ''
  }),
  methods: {
    async registration(body) {
      const register = new IdentityRequest()
      await register.postRegister(body)
          .then(result => console.log(result))
          .catch(x => console.log(x))
    },

    async validateForm() {
      const body = {
        "email": this.email,
        "name": this.name,
        "surname": this.surname,
        "middleName": this.middleName,
        "phoneNumber": this.phoneNumber,
        "password": this.password,
        "userType": 1
      }
      console.log(body)
      console.log(!this.isPhoneNumberValid || !this.isEmailValid || !this.isPasswordValid || !this.isNameValid)
      if (!this.isPhoneNumberValid || !this.isEmailValid || !this.isPasswordValid || !this.isNameValid) {
        return;
      }
      console.log(body)
      await this.registration(body)
      this.$router.push('/post-login').catch(err => {
        console.log(err)
      })
    },
  },
  computed: {
    isNameValid() {
      return this.rulesFullname.required(this.name) === true && this.rulesFullname.required(this.surname) === true && this.rulesFullname.required(this.middleName) === true
    },

    isEmailValid() {
      return this.rulesEmail.required(this.email) === true;
    },

    isPhoneNumberValid() {
      return this.phoneNumber.replace(/\D/g, '').length === 11;
    },
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

.phone {
  width: inherit;
  padding: 13px;
  margin-bottom: 2px;
  font-size: 16px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
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