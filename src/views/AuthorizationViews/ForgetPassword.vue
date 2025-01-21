<template>
  <div>
    <v-row align="center" justify="center" class=" ">
      <v-col cols="4" class=" pa-0" align="center">
        <v-dialog v-model="overlay" persistent width="auto" content-class="elevation-0">
          <v-card class="forget-password-card">
            <div class="logo-container-recovery-password">
              <LogoRed
                  class="logo-container-recovery-password__image"
                  :height="50"
                  :width="84"
              />
            </div>
            <v-card-title class="forget-password-card__title"> Проверьте почту</v-card-title>
            <v-card-subtitle class="forget-password-card__subtitle">
              Мы отправили ссылку для восстановления пароля на указанный электронный адрес. Проверьте почтовый ящик.
            </v-card-subtitle>
            <v-card-actions class="forget-password-card__actions">
              <v-btn color="#4E7AEC" @click="validatePassword" class="forget-password-card__actions__btn white--text" block
                     :disabled="loginButtonDisabled">
                Вернуться к авторизации
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import LogoRed from "@/components/logos/LogoRed.vue";

export default {
  name: 'ForgetPassword',
  components: {LogoRed},
  data: () => ({
    overlay: true,
    loginButtonDisabled: false,
  }),
  methods: {
    validatePassword() {
      this.$router.push({name: 'main'}).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/autorizationFormStyles.scss";
</style>