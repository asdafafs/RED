<template>
  <div>Пожалуйста, подождите 2</div>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";

export default {
  name: "PostAuthorizationVkPage",
  data() {
    return {
      identityService: new IdentityRequest()
    }
  },

  async created() {
    const code = this.$route.query.code;
    await this.identityService.postLoginVkRegistration(code, "https://anton.techbeaver.ru/post-vkLogin")
        .then(async () => {
          setTimeout(async () => {
            const identity = new IdentityRequest()
            await identity.getIdentity()
                .then((x) => {
                  this.$store.dispatch('GET_CURRENT_USER', x)
                }).finally(() => {
                })

            await this.$router.push({
              path: '/schedule/lessons',
            })
            console.log('jopa');
          }, 3000)

        });
  }
}
</script>