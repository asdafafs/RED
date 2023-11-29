<template>
  <div>
    <v-overlay
      v-model="overlay"
      contained
      transparent
      class="blur"
    >
    <v-row align="center" justify="center" class=" width">
      <v-col cols="4" class=" pa-0" >
        <v-card  class="d-flex justify-space-between flex-column height width rounded-lg ma-2" v-if="form" >
          <v-card-title class="black--text"> Регистрация</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, зарегистрируйтесь
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-card-text class="pb-0 " >

            <v-text-field
                solo
                label="Фамилия"
                :rules="[required]"
            ></v-text-field>
            <v-text-field
                solo
                label="Имя"
                :rules="[required]"
            ></v-text-field>
            <v-text-field
                solo
                label="Отчество"
                :rules="[required]"
            ></v-text-field>
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
            <vue-text-mask
              class="phone"
              v-model="value"
              :mask="mask"
              placeholderChar="#"
              :rules="[required]"
            ></vue-text-mask>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="#4E7AEC"
              @click="validateForm"
              class="rounded-lg pa-0 white--text"
              block

            >
              Зарегистрироваться
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
       </v-overlay>

  </div>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue";
import VueTextMask from "vue-text-mask";

export default {
  name: 'AuthorizationForm',
  components: {VueTextMask,  LogoRed },
  data: () => ({
    overlay: true,
    form: true,
    showPhoneNumberAlert: false,
    showPasswordAlert: false,
    email: null,
    loading: false,
    value: '7',
    show1: false,
    password: '',
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    rulesPassword: {
      required: value => !!value || 'Введите пароль.',
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
    required (v,) {
        return !!v || 'Обязательное поле'
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
  width: 60em;
}

.phone{
  width: inherit;
  padding: 13px;
  margin-bottom: 2px;
  font-size: 16px;
  border-radius: 5px;
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