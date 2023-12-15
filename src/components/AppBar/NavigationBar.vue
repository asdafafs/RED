<template>
  <v-navigation-drawer :value="drawer" app clipped color="#1e1f22" v-if="!showDrawer">
    <v-list height="inherit" class="d-flex flex-column">
      <v-list-item
          class="white--text align-start align-center list-item">
        <span class="mdi mdi-plus rotate" @click.stop="$emit('update:drawer', false);"></span>
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/schedule/testMonth').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Расписание
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Запись на экзамен
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/').catch(err => {}); $emit('update:drawer', false)"
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
          @click.stop="$router.push('/admin').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Админпанель
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/admin').catch(err => {}); $emit('update:drawer', false)"
          class="white--text align-start align-center list-item">
        Привязать аккуант к вк
      </v-list-item>
      <v-list-item
          @click.stop="$router.push('/').catch(err => {}); $emit('update:drawer', false)"
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