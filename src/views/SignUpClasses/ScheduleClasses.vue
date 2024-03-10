<template>
  <v-container class="px-3 pa-0 ma-0" fluid v-if="true">
    <div class="text-lg-h3 text-md-h3 text-sm-h3 text-xs-h1 font-weight-medium px-0">
      Расписание ваших занятий
    </div>
    <hr>
    <div class="text-lg-h6 text-md-h5 text-sm-h4 text-xs-h1 px-0">
      Выберите день, чтобы записаться на занятие
    </div>
    <v-row>
      <v-col class="pa-0">
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

<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/lineStyles.css";
</style>