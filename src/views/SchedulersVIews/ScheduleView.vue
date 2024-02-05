<template>
  <v-container class="px-4 pa-0 ma-0" fluid v-if="true">
    <div class="text-h3 font-weight-medium px-4">
      Расписание школы
    </div>
    <hr>
    <div class="text-h6 px-4">
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

<style lang="scss">
.theme--light.v-btn {
  color: #4E7AEC;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0;
}

.btn {
  text-transform: unset !important;
  font-size: 1.5em;
}

.custom-bg {
  background-color: #1e1f22;
}

.custom_text {
  color: white;
}
</style>