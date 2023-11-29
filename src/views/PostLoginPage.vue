<template>
  <div>Страница после логина ВК</div>
  {{ registerData }}
  <v-btn @click="register">Регистрация</v-btn>
  <v-btn @click="registertwo">Регистрация 2</v-btn>
</template>

<script>
import IdentityService from "@/services/VkAuthorizationService/IdentityService";

export default {
  name: "PostLoginPage.vue",
  data() {
    return {
      code: null,
      userVkId: 0,
      registerData: {
        email: "sakhnikarseni@mail.ru",
        name: "Арсений",
        surname: "Сахник",
        middleName: "Алексеевич",
        phoneNumber: "89021945789",
        password: "password",
        userType: 1,
        vkUserId: null,
      }
    }
  },
  methods: {
    async getUserVkId() {
      const vkService = new IdentityService();
      await vkService.register()
          .catch(x => console.log(x))
          .then(x => {
            this.userVkId = x.data
          });
    },
    async register() {
      const code = this.$route.query.code;
      const vkService = new IdentityService()
      const result = await vkService.registerWithVk(code)
      this.registerData.vkUserId = result.data.vkUserId;
    },
    async registertwo() {
      const vkService = new IdentityService();
      const result = vkService.register(this.registerData)
    }
  },
}
</script>

<style scoped>

</style>