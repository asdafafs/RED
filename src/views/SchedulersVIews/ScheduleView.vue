<template>
  <v-container class="px-3 pa-0 ma-0" fluid v-if="true">
    <div class="text-h3 font-weight-medium px-0">
      Расписание школы
    </div>
    <hr>
    <div class="text-h6 px-0">
      Ваши текущие занятия
    </div>
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
  mounted() {
    this.test = true
  },
  data: () => ({
    test: false,
    showDrawer: true,
  }),
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

<style lang="scss" >
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/lineStyles.css";
</style>