<template>
  <v-container fluid>
    <v-row class="flex-nowrap">
      <v-col cols="" class="">
        <v-btn cols="" text class="black--text tab-button pa-0 align-center " width="100%"
               :class="{'tab-background': isButtonPressed[0]}"
               @click="changeButtonState(0); $router.push({name: 'admin-students'}).catch(() => {})">
          <span :class="{ 'tab-button-text':isButtonPressed[0]}">Студенты</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[1]}"
               @click="changeButtonState(1); $router.push({name: 'admin-teachers'}).catch(() => {})">
          <span :class="{ 'tab-button-text':isButtonPressed[1]}">Преподаватели</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn cols="" text class="black--text tab-button pa-0" width="100%"
               :class="{'tab-background': isButtonPressed[2]}"
               @click="changeButtonState(2); $router.push({name: 'admin-groups'}).catch(() => {})">
          <span :class="{ 'tab-button-text':isButtonPressed[2]}">Практика</span>
        </v-btn>
      </v-col>
      <v-col cols="9">
        <v-spacer></v-spacer>
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
  data: () => ({}),
  methods: {
    changeButtonState(index) {
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
    },
  },

  computed: {
    isButtonPressed() {
      return [this.$route.path === '/admin/students',
        (this.$route.path === '/admin/teachers' || this.$route.path.startsWith('/admin/template')),
        this.$route.path === '/admin/groups']
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
</style>