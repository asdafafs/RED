<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[0]}"
               @click="changeButtonState(0); $router.push('/admin/students').catch(err => {})">
          <span :class="{ 'custom_text':isButtonPressed[0]}">Студенты</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[1]}"
               @click="changeButtonState(1); $router.push('/admin/teachers').catch(err => {})">
          <span :class="{ 'custom_text':isButtonPressed[1]}">Преподаватели</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[2]}"
               @click="changeButtonState(2); $router.push('/admin/groups').catch(err => {})">
          <span :class="{ 'custom_text':isButtonPressed[2]}">Группы</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},
  data: () => ({
    isButtonPressed: [true, false, false,],
  }),
  methods: {
    //добавить проверку active_user
    changeButtonState(index) {
      this.isButtonPressed = this.isButtonPressed.map(() => false)
      this.isButtonPressed[index] = true;
    },


  },
}
</script>
<style>
.btn {
  font-size: 1.125rem;
}

.custom-bg {
  background-color: #1e1f22;
}

</style>