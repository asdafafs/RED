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
    await this.identityService.postLoginVk(code, process.env.REDIRECT_URI)
        .then(async () => {
          await this.$router.push({
            path: '/schedule/lessons',
          })
        })
  }
}
</script>
