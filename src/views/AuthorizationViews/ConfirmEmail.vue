<template>
  <div>
    Подтверждение аккаунта
  </div>
</template>

<script>
import IdentityRequest from "@/services/IdentityRequest";
import store from "@/store";

export default {
  async mounted() {
    const userId = this.$route.query.userId
    const code = this.$route.query.code

    await this.confirmEmail(userId, code)
  },
  methods: {
    async confirmEmail(userId, code) {
      const identity = new IdentityRequest()
      await identity.postEmail({userId, code}).then(() => {
        identity.getIdentity()
            .then(async (x) => {
              await store.dispatch('GET_CURRENT_USER', x)
              this.isDataLoaded = true

              if (this.$route.path === '/')
                await this.$router.push('/schedule/lessons')
            })
      })

    }
  }
}
</script>