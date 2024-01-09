<template>
  <v-navigation-drawer :value="drawer" app clipped color="#1e1f22" v-if="!showDrawer">
    <v-list height="inherit" class="d-flex flex-column">
      <v-list-item
          class="white--text align-start align-center list-item">
        <span class="mdi mdi-plus rotate" @click.stop="$emit('update:drawer', false);"></span>
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/schedule/lessons').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Расписание
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/singUpClasses/lessons').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Запись на занятие
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('*').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Лекции
      </v-list-item>
      <v-list-item
          v-if="student"
          @click.stop="$router.push('/testPlan/mainCal/testMonth').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Мой план
      </v-list-item>
      <v-list-item
          v-if="!student"
          @click.stop="$router.push('/admin/students').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Админпанель
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('*').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Привязать аккуант к вк
      </v-list-item>
      <v-list-item
          @click.stop="exit(); $router.push('/').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-end mt-auto align-center"
          style="max-height: 4em;">
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

      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";

export default {
  name: 'NavigationBar',
  props: {
    drawer: {},
    role: {},
    showDrawer: {},
    student: {},
    user: {}
  },
  methods: {
    async logout(){
      const user = new IdentityRequest()
      await user.postLogout({})
    },

    exit(){
      this.logout()
    }
  }
}
</script>
<style scoped>
.rotate {
  transform: rotate(45deg) scale(1.8);
}

.list-item {
  max-height: 4em;
  overflow-y: auto;
}
</style>