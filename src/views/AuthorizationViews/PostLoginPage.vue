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
    const redirectUri = `${process.env.FRONT_PAGE_URL}/schedule/lessons`
    await this.identityService.postBindVk(code, process.env.REDIRECT_URI)
        .then(async () => {
          window.location.replace(redirectUri)
        })
  }
}
</script>
