<template>
  <div>
    <div class="d-flex flex-row justify-space-between full-width  px-3 mb-3 align-center">
      <div class="text-h3 font-weight-medium px-0">
        Личный кабинет 
      </div>
      <div style="font-weight: 700; font-size: 28px; color: #4E7AEC">
        Удачи на дорогах, {{ userName }}
      </div>
    </div>
    <v-container class="px-4 pa-0 ma-0" fluid v-if="showDrawer && groupId !== 0" >
      <hr class="mb-2">
      <div class="d-flex align-center mb-2">  {{ groupTitle }} </div>
      <router-view/>
    </v-container>
    <v-container class="px-4 pa-0 ma-0" fluid v-if="!showDrawer">
      <v-row>
        <v-col cols="">
          <div class="text-lg-h3 text-md-h4 text-sm-h5 text-xs-h5 font-weight-bold">
            Здравствуйте, {{ userName }}!
          </div>
          <div class="text-subtitle-1 uno">{{ groupTitle }}</div>
        </v-col>
      </v-row>
      <hr>
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
      this.showDrawer = window.innerWidth >= 1260;
    },

    openProgressBar() {
      const currentStudentID = this.userId;
      this.$router.push({name: 'progressBar', params: {currentStudentID}}).catch((err) => {
        throw new Error(`Problem handling something: ${err}.`);
      });
    },

    async getGroupNumber() {
      const group = new GroupsRequest();

      if(this.groupId !== 0 && this.groupId !== null)
      {
        console.log('this.groupId',this.groupId)
        this.groupTitle = await group.getGroup(this.groupId)
            .then(group => {
              return group.data[0].groupNumber;
            })
            .catch(error => {
              console.log("Error fetching group:", error);
              return null;
            });
        return this.groupTitle = `Вы зачислены в группу №${this.groupTitle}`
      }
      else return this.groupTitle = 'Вы пока не зачислены в группу'
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
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/buttonStyles.css";
</style>