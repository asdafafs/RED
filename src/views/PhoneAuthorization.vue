<template>
  <v-overlay v-model="overlay" contained class="blur">
    <v-row align="center" justify="center" class="width ">
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column height white rounded-lg ma-2" v-if="form">
          <v-card-title class="black--text"> Добро пожаловать!</v-card-title>
          <v-card-subtitle class="black--text">
            Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через номер телефона.
          </v-card-subtitle>
          <LogoRed class="pos"></LogoRed>
          <v-card-text class="pb-0 " >
            <vue-text-mask
              class="grey phone white--text"
              v-model="value"
              :mask="mask"
              placeholderChar="#"
            ></vue-text-mask>
            <v-alert v-if="showPhoneNumberAlert && !isPhoneNumberValid" type="error">
              Введите корректный номер телефона (10 цифр)
            </v-alert>
            <v-text-field
              background-color="grey"
              solo
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
            <v-alert v-if="showPasswordAlert && !isPasswordValid" type="error">
              Введите корректный пароль (минимум 8 символов)
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="#4E7AEC"
              @click="validateForm"
              class="rounded-lg pa-0 "
              block
            >
              Получить код в СМС
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2" v-if="!form">
          <v-card-title class="black--text"> Подтверждение по СМС</v-card-title>
          <v-card-subtitle class="black--text">
            Для потверждения входа введите код из СМС.
          </v-card-subtitle>
          <v-card-text class="pb-0 " >
            <v-text-field
                background-color="grey"
                solo
                v-model="smsCode"
                :append-icon="show1 ? 'mdi-eye ' : 'mdi-eye-off '"
                :type="show1 ? 'text' : 'password'"
                label="СМС-код"
                counter
                @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#4E7AEC" @click="overlay = false" class="rounded-lg pa-0 " block>
              Продолжить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>
<script>
import VueTextMask from "vue-text-mask";
import LogoRed from "@/components/logos/LogoRed.vue";

export default {
  name: 'AuthorizationForm',
  components: { VueTextMask, LogoRed },
  data: () => ({
    overlay: true,
    form: true,
    showPhoneNumberAlert: false,
    showPasswordAlert: false,
    show1: false,
    value: '',
    smsCode: '',
    password: '',
    rulesPassword: {
      required: value => !!value || 'Введите пароль.',
      min: v => v.length >= 8 || 'Минимум 8 символов',
    },
    mask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
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
.phone{
  width: inherit;
  padding: 13px;
  margin-bottom: 2px;
  font-size: 16px;
  border-radius: 5px;
}

.blur {
  backdrop-filter: blur(0px);
}

.width {
  width: 60em;
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