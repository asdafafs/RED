<template>
  <div>
    <button @click="vkLogIn">Войти в вк</button>
  </div>
</template>

<script>
export default {
  name: "LoginPage.vue",
  methods: {
    async vkLogIn() {
      const clientId = '51785736'
      const redirectUri = 'http://red.mlsat.ru/post-login'
      const display = 'popup'
      const responseType = 'code'
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    }
  }
}
</script>

<style scoped>

</style>