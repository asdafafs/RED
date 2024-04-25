<template>
  <div>
    <v-row
        align="center"
        justify="center"
    >
      <v-col cols="4" class="pa-0">
        <v-dialog
            v-model="overlay"
            persistent
            width="auto"
            content-class="elevation-0"
        >
          <v-card class="recovery-password-card white">
            <div class="logo-container-recovery-password">
              <LogoRed
                  class="logo-container-recovery-password__image"
                  :height="50"
                  :width="84"
              />
            </div>
            <v-card-title class="recovery-password-card__title">
              Восстановить пароль
            </v-card-title>
            <v-card-subtitle class="recovery-password-card__subtitle">
              Введите электронный адрес аккаунта, для которого нужно восстановить пароль,
              и отправьте запрос. На указанный e-mail придет ссылка для создания нового пароля.
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <v-text-field
                  color="black"
                  v-model=email
                  :readonly="loading"
                  :rules="[rulesEmail.required]"
                  class="recovery-password-card__text-field"
                  clearable
                  label="E-mail"
                  hide-details
                  dense outlined
              />
            </v-card-text>
            <v-card-actions class="recovery-password-card__actions">
              <v-btn
                  color="#4E7AEC"
                  @click="validateEmail"
                  class="recovery-password-card__actions__btn white--text"
                  :disabled="loginButtonDisabled"
              >
                Отправить запрос
              </v-btn>
              <v-btn
                  color="##E9E9E8"
                  @click="logout"
                  class="recovery-password-card__actions__btn mt-2"
                  text
              >
                Отмена
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
import LogoRed from "@/components/logos/LogoRed.vue";
import {successAlert} from "@/components/Alerts/alert";

export default {
  name: 'RecoveryPassword',
  components: {LogoRed},
  data: () => ({
    loginButtonDisabled: false,
    overlay: true,
    email: "",
    loading: false,
    rulesEmail: {
      required: v => !!v || 'Введите email'
    },
  }),
  computed: {
    isEmailValid() {
      return this.rulesEmail.required(this.email) === true
    }
  },
  methods: {
    logout() {
      this.$router.push(
          {
            name: 'main'
          }
      )
    },
    async checkEmail(body) {
      this.loginButtonDisabled = true
      const email = new IdentityRequest()
      await email.postForgetPassword({"email": body}).finally(() => {
        this.loginButtonDisabled = false
      })
    },

    validateEmail() {
      if (!this.isEmailValid) {
        return;
      }

      this.checkEmail(this.email).then(() => {
        this.$router.push({name: 'forget-password'}).catch(err => {
          console.log(err)
        })
      })
    },
  },
}
</script>
<style lang="scss">
.v-dialog > .v-card > .v-card__actions {
  padding: 0 24px;
}

.logo-container-recovery-password {
  display: flex;
  align-items: center !important;
  margin-left: 24px !important;
  padding: 8px 0 16px 0 !important;

  &__image {
    align-self: center !important;
    width: auto;
  }
}

.recovery-password-card {
  display: flex !important;
  flex-direction: column !important;
  width: 400px !important;
  height: 372px !important;

  &__title {
    font-weight: 700 !important;
    font-size: 28px !important;
    line-height: 37.5px !important;
    padding: 0 24px 10px !important;
    margin-bottom: 16px !important;
  }

  &__subtitle {
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 18px !important;
    color: #000000 !important;
    caret-color: #000000 !important;
    padding: 0 25px 0 25px !important;
    margin-bottom: 16px !important;
  }

  &__text-field {
    border-radius: 12px !important;
    margin-bottom: 16px !important;;
    max-height: 32px !important;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    margin-top: 8px !important;

    &__btn {
      text-transform: none !important;
      border-radius: 12px !important;
      padding: 0;
      margin: 0 0 0 0 !important;
      width: 350px;
      height: 32px !important;

    }
  }
}
</style>