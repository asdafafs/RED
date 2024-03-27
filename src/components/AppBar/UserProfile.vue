<template>
  <v-container class="pa-0" fluid>
    <v-row justify="center" no-gutters align-content="center" class="px-0 my-0">
      <v-col cols="12">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text block v-on="on" style="height: 40px; padding: 0 0 0 8px">
              <logout-button/>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                @click.stop="linkVk()">
              Привязать аккуант к вк
            </v-list-item>
            <v-list-item
                @click.stop="logoutAndExit">
              Выйти из приложения
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

import LogoutButton from "@/components/UI/LogoutButton.vue";
import loginIcon from "@/components/Icons/LoginIcon.vue";

export default {
  name: 'UserProfile',
  components:{
    loginIcon,
    LogoutButton
  },
  props: {
    role: {},
    student: {},
    user: {}
  },
  methods: {
    async logoutAndExit() {
      await this.$store.dispatch('LOGOUT')
      await this.$router.push({name: 'main'});
    },

    async linkVk() {
      const clientId = '51785736'
      const redirectUri = `${process.env.FRONT_PAGE_URL}/post-login`
      const display = 'popup'
      const responseType = 'code'
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    },


  }
}
</script>
<style lang="scss">

</style>