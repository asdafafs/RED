<template>
  <div >
    <v-container class="px-4 pa-0 ma-0" fluid v-if="showDrawer && groupId !==0" >
      <v-row no-gutters align="center" class="spacer">
        <v-col lg="">
          <div class="text-h4 font-weight-bold">Здравствуйте, {{ userName }}!</div>
        </v-col>
        <v-col lg="3" class="align-self-end text-start justify-start">
          <div class="text-subtitle-1 uno">{{ groupTitle }}</div>
        </v-col>
        <v-col cols="">
        </v-col>
        <v-col cols="1">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(0); $router.push({name: 'plan-main-month'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[0],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[0],}">Календарь</span>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(1); openProgressBar()"
                 :class="{'tab-background': isButtonMenuPressed[1],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[1],}">Прогресс</span>
          </v-btn>
        </v-col>
      </v-row>
      <hr>
      <router-view></router-view>
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
      <v-row>
        <v-col cols="">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(0); $router.push({name: 'plan-main-day'}).catch(() => {})"
                 :class="{'tab-background': isButtonMenuPressed[0],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[0],}">Календарь</span>
          </v-btn>
        </v-col>
        <v-col cols="">
          <v-btn text class="black--text tab-button pa-0" width="100%"
                 @click="changeButtonMenuState(1);openProgressBar()"
                 :class="{'tab-background': isButtonMenuPressed[1],}">
            <span :class="{'tab-button-text': isButtonMenuPressed[1],}">Прогресс</span>
          </v-btn>
        </v-col>
      </v-row>
      <hr>
      <router-view></router-view>
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
    groupId(){
      this.getGroupNumber()
    }
  },

  methods: {

    changeButtonMenuState(index) {

      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonMenuPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonMenuPressed, index, true);
      this.lastPressedIndex = index;
    },
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
      this.groupTitle = await group.getGroup(this.groupId)
          .then(group => {
            return group.data[0].groupNumber;
          })
          .catch(error => {
            console.log("Error fetching group:", error);
            return null;
          });
      if (this.groupTitle){
       return this.groupTitle = `Вы зачислены в группу №${this.groupTitle}`
      }
      else this.groupTitle = 'Вы пока не зачислены в группу'
      return this.groupTitle;
    },

    async initialize() {
      await this.getGroupNumber()
    },
  },
  computed: {
    ...mapState(['user']),
    userName() {
      return this.user.name
    },

    userId() {
      return this.user.userId
    },

    groupId() {
      console.log('this.user.groupId',this.user.groupId)
      return this.user.groupId
    },

    isButtonMenuPressed() {
      return [this.$route.path.startsWith('/testPlan/mainCal'), this.$route.path.startsWith('/testPlan/progressBar')]
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
}

</script>
<style lang="scss">
@import "@/assets/styles/lineStyles.css";
@import "@/assets/styles/buttonStyles.css";
</style>