<template>
  <div>
    <div class="d-flex flex-row flex-wrap justify-space-between full-width  px-3 mb-3 align-center">
      <div class="px-0 mb-3" :class="showDrawer ? 'mobile-title' : 'desk-title'">
        Личный кабинет
      </div>
      <div :class="showDrawer ? 'mobile-subtitle' : 'desk-subtitle'">
        Удачи на дорогах, {{ userName }}
      </div>
    </div>
    <v-container class="px-4 pa-0 ma-0" fluid v-if="groupId !== 0">
      <hr class="mb-2">
      <router-view/>
    </v-container>
  </div>
</template>
<script>

import {mapState} from "vuex";
import GroupsRequest from "@/services/GroupsRequest";

export default {
  name: 'plan',
  components: {},
  data: () => ({
    showDrawer: true,
    groupTitle: ''
  }),
  watch: {
    groupId(newValue) {
      this.getGroupNumber()
    }
  },

  computed: {
    ...mapState(['user']),
    userName() {
      return `${this.user.name} ${this.user.middleName} ${this.user.surname}`
    },

    userId() {
      return this.user.userId
    },

    groupId() {
      return this.$store.state.user.groupId
    },
  },

  methods: {
    checkWindowWidth() {
      this.showDrawer = window.innerWidth <= 1260;
    },

    openProgressBar() {
      const currentStudentID = this.userId;
      this.$router.push({name: 'progressBar', params: {currentStudentID}}).catch(() => {
      });
    },

    async getGroupNumber() {
      const group = new GroupsRequest();

      if (this.groupId !== 0 && this.groupId !== null) {
        this.groupTitle = await group.getGroup(this.groupId)
            .then(group => {
              return group.data[0].groupNumber;
            })
            .catch(error => {
              console.log("Error fetching group:", error);
              return null;
            });
        return this.groupTitle = `Вы зачислены в группу №${this.groupTitle}`
      } else return this.groupTitle = 'Вы пока не зачислены в группу'
    },

    async initialize() {
      await this.getGroupNumber()
      this.openProgressBar()
    },
  },

  created() {
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
    this.initialize()

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
  },

  updated() {
    this.openProgressBar()
  },
}

</script>
<style lang="scss">
@import "@/assets/styles/titleStyles.css";
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/buttonStyles.css";
</style>