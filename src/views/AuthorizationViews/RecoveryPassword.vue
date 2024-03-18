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
          <v-card class="forget-password-card white">
            <div class="logo-container">
              <LogoRed
                  class="logo"
                  :height="50"
                  :width="84"
              />
            </div>
            <v-card-title class="forget-password-card__title">
              Восстановление пароля
            </v-card-title>
            <v-card-subtitle class="forget-password-card__subtitle">
              Введите электронный адрес аккаунта, для которого нужно восстановить пароль,
              и отправьте запрос. На указанный e-mail придет ссылка для создания нового пароля.
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <v-text-field
                color="black"
                v-model=email
                :readonly="loading"
                :rules="[rulesEmail.required]"
                class="forget-password-card__text-field"
                clearable
                label="E-mail"
                outlined
                hide-details
              />
            </v-card-text>
            <v-card-actions class="forget-password-card__actions">
                <v-btn 
                    color="#4E7AEC" 
                    @click="validateEmail" 
                    class="forget-password-card__actions__btn white--text"  
                    :disabled="loginButtonDisabled"
                >
                  Отправить запрос
                </v-btn>
                <v-btn 
                  color="##E9E9E8" 
                  @click="logout" 
                  class="forget-password-card__actions__btn"
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
    logout(){
      this.$router.push(
        {
          name: 'main'
        }
      )
    },
    async checkEmail(body) {
      this.loginButtonDisabled = true
      const email = new IdentityRequest()
      await email.postForgetPassword({"email": body})
    },

    validateEmail() {
      if (!this.isEmailValid) {
        return;
      }

      this.checkEmail(this.email);
      alert('проверьте почтовый ящик');
      this.$router.push({name: 'main'}).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>
<style lang="scss">
.v-dialog > .v-card > .v-card__actions {
  padding: 0px 16px;
}

.logo {
  align-self: center !important;
  margin-left: 16px;

}

.logo-container {
  display: flex;
  align-items: center;
  margin-left: 16px;

}

.forget-password-card {
  display: flex !important;
  //gap: 16px !important;
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

  &__text-field{
    border-radius: 12px !important;
    margin-bottom: 16px !important;
  }
  
  &__actions {
    display: flex;
    flex-direction: column;

    &__btn {
      border-radius: 8px;
      padding: 0;
      //margin: 4px 0 4px 0 !important;
      margin: 0 0 0 0 !important;
      width: 350px;

    }
  }
}
</style>