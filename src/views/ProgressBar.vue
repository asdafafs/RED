<script >
export default {
  data:()=>({
    interval: -1,
    value: 0,
  }),
  mounted() {this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0)
        }
        this.value += 10
      }, 1000)
  },
  beforeMount() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <v-container class="px-4 pa-0 ma-0 " fluid >

    <div class="text-h6 font-weight-bold" style="">Мои успехи</div>

    <v-row class=" flex-wrap" no-gutters >
      <v-col cols="4">
          <v-progress-circular
              :rotate="360"
              :size="400"
              :width="45"
              :model-value="value"
              color="red"
          >
            {{ value }}%
          </v-progress-circular>

      </v-col>
      <v-col cols="4">

      </v-col>
      <v-col cols="4">

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>