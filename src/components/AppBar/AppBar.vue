<script>

import LogoRed from "@/components/logos/LogoRed.vue";
import NavigationBar from "@/components/AppBar/NavigationBar.vue";
import AppButtons from "@/components/AppBar/AppButtons.vue";
import MobileAppBar from "@/components/AppBar/MobileAppBar.vue";
import UserProfile from "@/components/AppBar/UserProfile.vue";


export default {
  components: {UserProfile, MobileAppBar, AppButtons, NavigationBar, LogoRed},
  data() {
    return {
      user: "Петров С.А.",
      role: ["Ученик", "Учитель"],
      drawer: false,
      showDrawer: true,
      student: true,
    }
  },

   methods: {
     checkWindowWidth() {
    this.showDrawer = window.innerWidth >= 1260;
     },
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
<template>
  <v-container >
    <NavigationBar :drawer.sync="drawer" :role="role" :show-drawer="showDrawer" :student="student" :user="user"/>
    <v-app-bar app density="compact" color="#1e1f22" class = "appbar position_component" >
      <v-container  class="pa-0 my-0" v-if = "showDrawer" fluid>
        <v-row no-gutters >
          <v-col cols = 2 >
            <v-container class="pa-0"  fluid style="height: 100%;">
              <v-row  no-gutters  align="center" style="height: 100%;" >
                <v-col cols = 12 class="d-flex justify-center align-center">
                  <LogoRed ></LogoRed>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col>
            <AppButtons :student="student"/>
          </v-col>
          <v-col cols="2">
            <UserProfile :role="role" :student="student" :user="user"/>
          </v-col>
        </v-row>
      </v-container>
      <MobileAppBar :drawer.sync="drawer" v-else/>
    </v-app-bar>
  </v-container>
</template>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0 !important;
}
.appbar
{
  z-index: auto;
}

.position_component{
  z-index: 2;
}
</style>


