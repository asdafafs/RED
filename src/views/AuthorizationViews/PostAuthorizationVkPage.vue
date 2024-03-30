<template>
  <div>Пожалуйста, подождите</div>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: "PostAuthorizationVkPage",
  data() {
    return {
      identityService: new IdentityRequest()
    }
  },

  async created() {
    const code = this.$route.query.code;
    const redirectUri = `${process.env.FRONT_PAGE_URL}/post-vkLogin`
    const redirectLessons = `${process.env.FRONT_PAGE_URL}/schedule/lessons`
    await this.identityService.postLoginVkRegistration(code, redirectUri)
        .then(async () => {
          window.location.replace(redirectLessons)
        });
  }
}
</script>