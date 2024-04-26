<template>
  <v-container fluid>
    <NavigationBar 
      :drawer.sync="drawer" 
      :role="role" 
      :show-drawer="showDrawer" 
      :student="discriminatorUser" 
      :user="userName"
    />
    <v-app-bar 
      app 
      density="compact" 
      color="#1e1f22" 
      class="appbar position_component app-bar-height"
    >
      <v-container
          v-if="showDrawer"
          class="pa-0 my-2"
          fluid
          style="max-height: 60px"
      >
        <v-row no-gutters class="pa-0 ma-0" style="max-height: 60px;flex-wrap: nowrap;">
          <v-col cols=2>
            <DesktopLogo/>
          </v-col>
          <v-col>
            <AppButtons
              v-if="isDataLoaded"
              :student="discriminatorUser"
            />
          </v-col>
          <v-col cols="2">
            <div class="d-flex align-center" style="height: 100%; width: 90%">
              <UserProfile
                class="mr-3 ml-3"
                v-if="isDataLoaded"
                :role="role"
                :student="discriminatorUser"
                :user="userName"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
      <MobileAppBar
        v-else
        :drawer.sync="drawer"
      />
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
      role: ["Ученик", "Учитель", "Администратор"],
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
      this.showDrawer = window.innerWidth >= 960;
    },
  },
  created() {
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowWidth);
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
}
</script>
<style lang="scss">
@import "@/assets/styles/appBarStyles.css";
</style>


