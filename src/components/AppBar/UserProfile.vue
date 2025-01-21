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
                @click.stop="openVKBotMessage()">
              Привязать аккаунт к вк
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

    async openVKBotMessage() {
      this.localVisible = false
      await this.$openVKBotMessagePlugin(null, false)
          .then(async (isCancel) => {
            if (!isCancel) {
              this.$emit('destroy', false)
            }
          })
          .finally(() => {
            this.localVisible = true
          })
    },
  }
}
</script>
<style lang="scss">

</style>