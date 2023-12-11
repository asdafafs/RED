<template>
  <v-container class="pa-0" fluid>
    <v-row justify="center" no-gutters align-content="center" class="px-1 my-0">
      <v-col cols="12">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text min-height="3em" color="white" class="pa-0 btn" block v-on="on">
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
                @click.stop="$router.push('*').catch(err => {})">
              Привязать аккуант к вк
            </v-list-item>
            <v-list-item v-if="!student"
                @click.stop="$router.push('/courses').catch(err => {})">
              Добавить курс
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
  }
}
</script>
<style scoped>
.btn {
  text-transform: unset !important;
  font-size: 1.125rem;
}
</style>