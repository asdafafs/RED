<template>
  <div>Пожалуйста, подождите</div>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: "PostLogin",
  data() {
    return {
      identityService: new IdentityRequest()
    }
  },
  async created() {
    const code = this.$route.query.code
    await this.identityService.postLoginVk(code)
        .then(response => {
          console.log(response)

          if (response.data.requireRegistration) {
            this.$router.push({
              path: '/registration',
              query: {
                vkUserId: response.data.vkUserId
              }
            })
          } else {
            this.$router.push({
              path: '/schedule/lessons',
            })
          }
        })
  }
}
</script>
