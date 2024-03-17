<template>
  <div class="d-flex flex-row" style="width: 150px">
    <div class="d-flex flex-column" style="width: 75%;">
      <div class="user-info-section">
        <v-icon color="white">mdi-account-outline</v-icon>
        <span class="user-name">{{ userName }}</span>
      </div>
      <div class="user-role-section">
        <span class="user-role-name">{{ userRole }}</span>
      </div>
    </div>
    <div class="d-flex align-center">
      <login-icon style="width: 24px; height: 24px"/>
    </div>
  </div>  
</template>

<script>
import {mapState} from "vuex";
import loginIcon from "@/components/Icons/LoginIcon.vue";

export default {
  name: 'LogoutButton',
  components:{
    loginIcon
  },
  computed: {
    ...mapState(['user']),
    userName() {
      return this.user.name
    },
    userRole() {
      return this.user.discriminator
    },
  }
}
</script>

<style scoped lang="scss">
.user-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 18.75px;
  color: white;
}
.user-role-name {
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  opacity: 80%;
}
.user-role-section {
  text-align: left;
  display: flex; 
  align-items: center
}
.user-info-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>