<template>
  <v-container class="px-3 pa-0 ma-0" fluid v-if="true">
    <div class="font-weight-medium px-0 mb-3" :class="isMobile ? 'mobile-title' : 'desk-title'">
      Запись на занятие
    </div>
    <hr>
    <div class="text-lg-h6 text-md-h5 text-sm-h4 text-xs-h1 px-0 mb-3">
      Выберите день, чтобы записаться на занятие
    </div>
    <v-row>
      <v-col class="pa-0">
        <router-view/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {mapState} from "vuex";

export default {
  components: {},
  mounted() {
    this.test = true
  },
  data: () => ({
    test: false,
  }),
  computed:{
    ...mapState(['user','isMobile']),
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/buttonStyles.css";
@import "@/assets/styles/lineStyles.css";
</style>