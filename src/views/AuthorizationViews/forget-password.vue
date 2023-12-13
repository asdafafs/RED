<script setup>
import IdentityRequest from "@/services/IdentityRequest";

export default {
  async mounted() {
    const userId = this.$route.query.userId
    const code = this.$route.query.code

    await this.confirmEmail(userId, code)
  },
  methods: {
    async confirmEmail(userId, code) {
      const identity = new IdentityRequest()
      await identity.postNewPassword({userId ,code}).then(() => {
        identity.getIdentity();
        this.$router.push('/')
      })
    }
  }
}
</script>

<template>
  <div>
    изменение пароля
  </div>
</template>
