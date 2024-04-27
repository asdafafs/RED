<template>
  <v-navigation-drawer
      v-if="!showDrawer"
      :value="drawer"
      app
      clipped
      color="#1e1f22"
      :style="{ height: '94vh' }"
  >
    <v-list
        height="inherit"
        class="d-flex flex-column"
    >
      <v-list-item
          v-for="item in navigationItems"
          :key="item.id"
          class="white--text align-center list-item"
          @click.stop="onClick(item)"
          :class="{'align-end mt-auto': item.routerName === 'main'}"
          v-if="item.id !== 3 || !student"
      >
        <template #default>
          {{ item.title }}
          <v-icon color="white">{{ item.icon }}</v-icon>
          <logoutButton v-if="item.routerName === 'main'"/>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import IdentityRequest from "@/services/IdentityRequest";
import logoutButton from "@/components/UI/LogoutButton.vue";

export default {
  name: 'NavigationBar',
  components: {
    logoutButton
  },
  props: {
    student: Boolean,
    drawer: Boolean,
    showDrawer: Boolean,
  },
  computed: {
    navigationItems() {
      return [
        {
          id: 0,
          icon: 'mdi-close-thick',
          visible: true,
        },
        {
          id: 1,
          title: 'Мое расписание',
          routerName: 'schedule-lessons',
          visible: true,
        },
        {
          id: 2,
          title: 'Личный кабинет',
          routerName: 'plan',
          visible: this.student,
        },
        {
          id: 3,
          title: 'Админпанель',
          routerName: 'admin-students',
          visible: this.needAdminPanel,
        },
        {
          id: 4,
          title: 'Привязать аккаунт к вк',
          link: 'linkVk',
          visible: true,
        },
        {
          id: 5,
          routerName: 'main',
          visible: true,
        },
      ].filter(x => x.visible)
    },

    needAdminPanel() {
      return this.$store.state.user.isAdmin
    }
  },
  methods: {
    async logout() {
      const user = new IdentityRequest()
      await user.postLogout({})
    },
    onClick(item) {
      if (item.routerName) {
        this.$router.push(
            {
              name: item.routerName
            }
        ).catch(() => {
            }
        );
      }
      this.$emit('update:drawer', false)
      if (item.routerName === 'main') this.logout()
      if (item.link === 'linkVk') this.linkVk()
    },

    async linkVk() {
      const clientId = process.env.CLIENT_ID
      const redirectUri = process.env.REDIRECT_URI
      const display = process.env.DISPLAY
      const responseType = process.env.RESPONSE_TYPE
      window.location.replace(`https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=${display}&response_type=${responseType}`)
    },
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