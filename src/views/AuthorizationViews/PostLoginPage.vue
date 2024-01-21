<template>
  <div>Пожалуйста, подождите</div>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";

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
        .then(async response => {
          if (response.data.requireRegistration) {
            this.$router.push({
              path: '/registration',
              query: {
                vkUserId: response.data.vkUserId
              }
            })
          } else {
            const identity = new IdentityRequest()
            await identity.getIdentity()
                .then(async (x) => {
                  await store.dispatch('GET_CURRENT_USER', x)
                })
            await this.$router.push({
              path: '/schedule/lessons',
            })
          }
        })
  }
}
</script>
