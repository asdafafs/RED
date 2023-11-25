<template>
  <v-overlay
      v-model="overlay"
      contained
      class="blur"
  >
    <v-row align="center" justify="center" class="width ">
      <v-col cols="4" class=" pa-0">
        <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2" v-if="form">
          <v-card-title class="black--text"> Восстановление пароля</v-card-title>
          <v-card-subtitle class="black--text">
            Для восстановления пароля введите номер телефона
          </v-card-subtitle>
          <v-card-text class="pb-0 " >
            <vue-text-mask
                class="grey phone white--text"
                v-model="value"
                :mask="mask"
                placeholderChar="#"
            >
            </vue-text-mask>
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="#4E7AEC"
                @click=" form = false"
                class="rounded-lg pa-0 "
                block
            >
              Ввести новый пароль
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="d-flex justify-space-between flex-column white rounded-lg ma-2" v-if="!form">
          <v-card-title class="black--text"> Восстановление пароля</v-card-title>
          <v-card-subtitle class="black--text">
            Введите новый пароль
          </v-card-subtitle>
          <v-card-text class="pb-0 " >
            <v-text-field
                background-color="grey"
                solo
                v-model="password"
                :rules="[rulesPassword.required, rulesPassword.min]"
                name="input-10-1"
                label="Пароль"
                hint="Минимум 8 символов"
                counter
            ></v-text-field>
            <v-text-field
                background-color="grey"
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
                @click="overlay = false"
                class="rounded-lg pa-0"
                block
            >
              Ввести новый пароль
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>
<script>
import VueTextMask from "vue-text-mask";

export default {
  name: 'AuthorizationForm',
  components: {VueTextMask, },
  data:() =>({
    overlay: true,
    form:true,
    mask: ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    value: '',
    show2: false,
    password: '',
    passwordRepeat:'',
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

}
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
</style>