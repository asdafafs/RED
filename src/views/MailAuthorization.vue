<template>
  <div>
      <v-row align="center" justify="center" class="" style="position: relative; z-index: 1;" >
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column height  rounded-lg ma-2" >
          <v-card-title class="black--text"> Авторизация</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через электронную почту.
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-card-text class="pb-0 " >
            <v-text-field
                solo
                color="black"
              v-model="email"
              :readonly="loading"
              :rules="[required]"
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
              name="input-10-1"
              label="Пароль"
              hint="Минимум 8 символов"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-alert v-if="showPasswordAlert && !isPasswordValid" type="error">Введите корректный пароль (минимум 8 символов)</v-alert>

          </v-card-text>
          <v-card-actions>
            <v-btn
              color="#4E7AEC"
              @click="validateForm"
              class="rounded-lg pa-0 white--text"
              block
            >
              Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue";

export default {
  name: 'AuthorizationForm',
  components: { LogoRed },
  data: () => ({
    overlay: true,
    form: true,
    showPhoneNumberAlert: false,
    showPasswordAlert: false,
    value: '',
    show1: false,
    email: null,
    loading: false,
    password: '',
    rulesPassword: {
      required: value => !!value || 'Введите пароль',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    },
    smsCode: ''
  }),
  methods: {
    validateForm() {
      this.showPhoneNumberAlert = true;
      this.showPasswordAlert = true;

      if (!this.isPhoneNumberValid) {
        return;
      }

      if (!this.isPasswordValid) {
        return;
      }

      this.form = false;
    },
    required (v) {
        return !!v || 'Введите email'
      },
  },
  computed: {
    isPhoneNumberValid() {
      return this.value.replace(/\D/g, '').length === 11;
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