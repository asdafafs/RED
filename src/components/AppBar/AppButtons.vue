<template>
  <div style="width: 100%; height: 100%" class="d-flex justify-center align-center">
    <div style="flex: 1; height: 100%;" v-if="needAdminPanel && showAdminPanelText"/>
    <v-btn-toggle
        v-model="selectedButton"
        :mandatory="getToggleValue"
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
      :class="currentRouteIsAdmin ? 'admin-panel-selected_section': 'admin-panel_section'"
    >
      <v-btn
        :class="currentRouteIsAdmin ? 'admin-panel-selected_button': 'admin-panel_button'"
        @click="onBtnClick"
      >
        <Icon color="white" icon="mdi-vector-arrange-above" height="24"/>
        <span class="admin-panel_text">
          Админпанель
        </span>
      </v-btn>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";
import { Icon } from '@iconify/vue2'
export default {
  name: 'AppButtons',
  components: {Icon},
  props: {
    student: {}
  },
  data() {
    return {
      selectedButton: 0,
      showAdminPanelText: true
    }
  },
  watch: {
    currentRoute: {
      handler(newVal) {
        if (newVal === 'schedule-lessons') {
          this.selectedButton = 0 
        } else if (newVal === 'progressBar') {
          this.selectedButton = 1
        } else {
          this.selectedButton = null
        }
      },
      immediate: true
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
    ...mapState(['isMobile']),
    getToggleValue() {
      if (this.needAdminPanel) return false
      return true
    },
    currentRoute() {
      return this.$route.name
    },
    currentRouteIsAdmin() {
      return this.$route.path.indexOf('admin') === 1
    },
    needAdminPanel() {
      return this.$store.state.user.isAdmin
    },
    appButtons() {
      return [
        {
          id: 0,
          title:'Расписание',
          router: 'schedule-lessons',
          visible: true,
        },
        {
          id: 1,
          title:'Личный кабинет',
          router: 'plan',
          visible: this.student,
        },
      ].filter(x => x.visible)
    },
  },
  methods: {
    onBtnClick() {
      this.selectedButton = null; 
      this.goRoute('admin-students')
    },
    checkWindowWidth() {
      this.showAdminPanelText = !this.isMobile;
    },
    goRoute(router) {
      this.$router.push(
          {
            name: router
          }
      ).catch(() => {})
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
    background-color: unset !important;
    box-shadow: none !important;
  }
  &_text {
    color: white !important;
    text-transform: none !important;
    font-size: 16px !important;
  }
}
.admin-panel-selected {
  &_section {
    display: flex;
    align-items: center;
    justify-content: end;
    flex: 1
  }
  &_button {
    background-color: #4E7AEC !important;
  }
}
</style>