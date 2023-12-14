<script>
export default {
  components: {},
  data: () => ({
    isButtonMenuPressed: [false, false,],
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
    </v-row>
    <v-row>
      <v-col><router-view></router-view></v-col>

    </v-row>
  </v-container>

</template>

<style scoped>

</style>