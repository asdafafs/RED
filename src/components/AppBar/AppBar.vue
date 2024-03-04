<template>
  <v-container fluid>
    <NavigationBar :drawer.sync="drawer" :role="role" :show-drawer="showDrawer" :student="discriminatorUser" :user="userName"/>
    <v-app-bar app density="compact" color="#1e1f22" class="appbar position_component">
      <v-container class="pa-0 ma-0" v-if="showDrawer" fluid>
        <v-row no-gutters class="pa-0 ma-0">
          <v-col cols=2>
            <DesktopLogo/>
          </v-col>
          <v-col>
            <AppButtons :student="discriminatorUser" v-if="isDataLoaded"/>
          </v-col>
          <v-col cols="2">
              <UserProfile :role="role" :student="discriminatorUser" :user="userName" v-if="isDataLoaded"/>
          </v-col>
        </v-row>
      </v-container>
      <MobileAppBar :drawer.sync="drawer" v-else/>
    </v-app-bar>
  </v-container>
</template>
<script>
import NavigationBar from "@/components/AppBar/NavigationBar.vue";
import AppButtons from "@/components/AppBar/AppButtons.vue";
import MobileAppBar from "@/components/AppBar/MobileAppBar.vue";
import UserProfile from "@/components/AppBar/UserProfile.vue";
import DesktopLogo from "@/components/AppBar/DesktopLogo.vue";
import {mapState} from "vuex";

export default {
  components: {DesktopLogo, UserProfile, MobileAppBar, AppButtons, NavigationBar},
  data() {
    return {
      role: ["Ученик", "Учитель"],
      drawer: false,
      showDrawer: true,
      student: false,
    }
  },
  props: {
    isDataLoaded: Boolean,
  },
  methods: {
    checkWindowWidth() {
      this.showDrawer = window.innerWidth >= 1260;
    },

  },

  computed: {
    ...mapState(['user']),
    userName() {
      return this.user.name
    },
    discriminatorUser() {
      this.student = this.user.discriminator !== 'Учитель';
      return this.student
    }
  },

  created() {
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/appBarStyles.css";
</style>


