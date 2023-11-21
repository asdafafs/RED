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

    <div class="text-h5 font-weight-bold" style="">Мои успехи</div>

    <v-row class="flex-wrap "  no-gutters>
      <v-col lg="4" md="4" sm="6" xs="12" class="justify-center">
        <div class=" d-flex flex-column justify-center" >
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#E31E24"
              class="ma-2 pa-2 "
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>

          </v-progress-circular>
            </div>
          <div class="text-center">Осталось {{100 - value}}% лекций</div>
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#4E7AEC"
              class="ma-2 pa-2"
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>
          </v-progress-circular>
          </div>
           <div class="text-center">Осталось отъездить {{100 - value}} часов</div>
        </div>
      </v-col>
      <v-col lg="4" md="4" sm="6" xs="12" class="justify-center">
        <div class=" d-flex flex-column justify-center" >
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#E31E24"
              class="ma-2 pa-2 "
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>
          </v-progress-circular>
            </div>
          <div class="text-center">Осталось {{100 - value}}% лекций</div>
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#4E7AEC"
              class="ma-2 pa-2"
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>
          </v-progress-circular>
          </div>
           <div class="text-center">Осталось отъездить {{100 - value}} часов</div>
        </div>
      </v-col>
      <v-col lg="4" md="4" sm="6" xs="12" class="justify-center">
        <div class=" d-flex flex-column justify-center" >
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#E31E24"
              class="ma-2 pa-2 "
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>
          </v-progress-circular>
            </div>
          <div class="text-center">Осталось {{100 - value}}% лекций</div>
          <div class="d-flex justify-center">
          <v-progress-circular
              :rotate="360"
              :size="240"
              :width="35"
              :model-value="value"
              :value="value"
              color="#4E7AEC"
              class="ma-2 pa-2"
          >
            <div  class="text-center">
              <div class="text-center text-h3"> {{ value }}% </div>
            <div>  пройдено</div>
            </div>
          </v-progress-circular>
          </div>
           <div class="text-center">Осталось отъездить {{100 - value}} часов</div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>