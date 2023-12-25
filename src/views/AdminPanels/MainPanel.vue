<template>
  <v-container>
    <v-row>
      <v-col cols="">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(0); $router.push('/admin/students').catch(err => {})">
          <span :class="{'uno': isButtonMenuPressed[0],}">Студенты</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[0]" class="button-line"></div>
      </v-col>
      <v-col cols="">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(1); $router.push('/admin/teachers').catch(err => {})">
          <span :class="{'uno': isButtonMenuPressed[1],}">Преподаватели</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[1]" class="button-line"></div>
      </v-col>
      <v-col cols="">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(2); $router.push('/admin/groups').catch(err => {})">
          <span :class="{'uno': isButtonMenuPressed[2],}">Группы</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[2]" class="button-line"></div>
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
    isButtonMenuPressed: [false, false, false],
  }),
  methods: {
    changeButtonMenuState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonMenuPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonMenuPressed, index, true);
      this.lastPressedIndex = index;
    },
  },
}
</script>
<style>
.uno {
  color: #4E7AEC;
}

.btn {
  font-size: 1.125rem;
}

.button-line {
  width: 100%;
  height: 2px;
  background-color: black;
  margin-top: 5px;
}
</style>