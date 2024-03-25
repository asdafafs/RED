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
    await this.identityService.postBindVk(code, process.env.REDIRECT_URI)
        .then(async () => {
          window.location.replace('https://anton.techbeaver.ru/schedule/lessons')
        })
  }
}
</script>
