<template>
  <div class="d-flex flex-row">
    <div class="d-flex flex-column">
      <div class="user-info-section">
        <Icon color="white" icon="mdi-account-outline" height="24"/>
        <span class="user-name">{{ userName }}</span>
      </div>
      <div class="user-role-section">
        <span class="user-role-name">{{ userRole }}</span>
      </div>
    </div>
    <div class="d-flex align-center ml-2">
      <login-icon style="width: 24px; height: 24px"/>
    </div>
  </div>  
</template>
<script>
import {mapState} from "vuex";
import loginIcon from "@/components/Icons/LoginIcon.vue";
import { Icon } from '@iconify/vue2'
export default {
  name: 'LogoutButton',
  components:{
    loginIcon,
    Icon
  },
  computed: {
    ...mapState(['user']),
    userName() {
      return `${this.user.surname} ${this.user.name[0]}. ${this.user.middleName[0]}. `
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
  text-transform: none;
  color: white;
}
.user-role-name {
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: white;
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