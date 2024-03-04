<template>
  <v-container class="pa-0" fluid>
    <v-row justify="center" no-gutters align-content="center" class="px-0 my-0">
      <v-col cols="12">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text min-height="3em" color="white" class="pa-0 app-bar-button-style" block v-on="on">
              <div class="d-flex flex-column">
                <div>
                  <span class="mdi mdi-account-outline"></span>
                  {{ user }}
                </div>
                <div style="text-align: left;">
                  {{ student ? role[0] : role[1] }}
                </div>
              </div>
              <span class="mdi mdi-login" style="transform: scale(1.5)"></span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                @click.stop="$router.push('*').catch(() => {})">
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

export default {
  name: 'UserProfile',
  props: {
    role: {},
    student: {},
    user: {}
  },
  methods: {
    async logoutAndExit() {
      await this.$store.dispatch('LOGOUT')
      await this.$router.push({name: 'main'});
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
</style>