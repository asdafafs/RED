<template>
  <div style="width: 100%; height: 100%" class="d-flex justify-center align-center">
    <div style="flex: 1; height: 100%;" v-if="needAdminPanel && showAdminPanelText"/>
    <v-btn-toggle
        v-model="selectedButton"
        mandatory
        group
    >
      <v-btn
          v-for="item in appButtons"
          :key="item.id"
          height="32"
          class="app-bar-toggle-button"
          :value="item.id"
          @click="goRoute(item.router)"
      >
        <span :class="selectedButton === item.id ? 'white--text' : 'white--text'" class="app-bar-toggle-button-text">
          {{ item.title }}
        </span>
      </v-btn>
    </v-btn-toggle>
    <div 
      v-if="needAdminPanel"
      class="admin-panel_section"
    >
      <v-btn
        class="admin-panel_button"
        @click="goRoute('admin-students')"
      >
        <v-icon color="white" class="mr-2">mdi-vector-arrange-above</v-icon>
        <span class="admin-panel_text">
          Админпанель
        </span>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppButtons',
  props: {
    student: {}
  },
  data() {
    return {
      selectedButton: 0,
      showAdminPanelText: true
    }
  },
  created() {
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
  },
  computed: {
    needAdminPanel() {
      return !this.student
    },
    appButtons() {
      return [
        {
          id: 0,
          title:'Мое расписание',
          router: 'schedule-lessons',
          visible: true,
        },
        {
          id: 1,
          title:'Запись на занятие',
          router: 'singUpClasses-month',
          visible: this.student,
        },
        {
          id: 2,
          title:'Личный кабинет',
          router: 'plan-main-day',
          visible: true,
        },
      ].filter(x => x.visible)
    },
  },
  methods: {
    checkWindowWidth() {
      this.showAdminPanelText = window.innerWidth >= 1200;
    },
    goRoute(router) {
      this.$router.push(
          {
            name: router
          }
      )
    },
  },
}
</script>
<style lang="scss">

.app-bar-toggle-button {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: #4E7AEC !important;
  width: 200px !important;
  text-transform: none !important;
}
.app-bar-toggle-button-text {
  font-size: 20px !important;
  font-weight: 600 !important;
}
.admin-panel {
  &_section {
    display: flex;
    align-items: center;
    justify-content: end;
    flex: 1
  }
  &_button {
    background-color: #4E7AEC !important;
  }
  &_text {
    color: white !important;
    text-transform: none !important;
    font-size: 16px !important;
  }
}
</style>