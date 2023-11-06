<template>
  <div>Страница после логина ВК</div>
  <div>{{ userVkId }}</div>
  <button @click="getUserVkId">Получить юзер вк ид</button>
  <button @click="authenticate">Аутентифицироваться </button>
</template>

<script>
import VkAuthorizationService from "@/services/VkAuthorizationService/VkAuthorizationService";

export default {
  name: "PostLoginPage.vue",
  async mounted() {
    
  },
  methods: {
    async getUserVkId() {
      const vkService = new VkAuthorizationService();
      await vkService.getUserVkId()
          .catch(x => console.log(x))
          .then(x => {this.userVkId = x.data});
    },
    async authenticate() {
      const code = this.$route.query.code;
      const vkService = new VkAuthorizationService()

      const result = await vkService.authenticate(code)

      console.log(result);

      const data = result.data;
    }
  },
  data() {
    return {
      code: null,
      userVkId: 0
    }
  }
}
</script>

<style scoped>

</style>