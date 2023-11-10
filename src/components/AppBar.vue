<script>

import LogoRed from "@/components/LogoRed.vue";

export default {
  components: {LogoRed},

  data() {
    return {

    }
  }
  }

</script>

<template>
  <v-app-bar app density="compact" color="#1e1f22" class = "appbar">
  <v-container  class="pa-0 my-0" fluid>
    <v-row align="start" no-gutters>
    <v-col cols = 2 >
          <v-container class="pa-0" fill-height >
            <v-row  no-gutters align-content="center"  justify="center">
              <v-col cols = 12 class="d-flex justify-center align-center">
                <LogoRed ></LogoRed>
              </v-col>
            </v-row>
          </v-container>
    </v-col>
    <v-col>

          <v-container class="pa-0" fluid>
            <v-row justify="center" no-gutters align-content="center" class="my-0 ga-3">
              <v-col cols = 2>
                <v-btn text min-height="3em" color="white" class="pa-0" block>Расписание

                </v-btn>
              </v-col>
              <v-col cols = 2>
                <v-btn text min-height="3em" color="white" class="pa-0" block>Запись на экзамен

                </v-btn>
              </v-col>
              <v-col cols = 2>
                <v-btn text min-height="3em" color="white" class="pa-0" block>Лекции

                </v-btn>
              </v-col>
              <v-col cols = 2>
                <v-btn text min-height="3em" color="white" class="pa-0" block>Мой план

                </v-btn>
              </v-col>
            </v-row>
          </v-container>


    </v-col>
    <v-col cols = 2 >

         <v-container class="pa-0" fluid>
            <v-row justify="center" no-gutters align-content="center" class="px-1 my-0">
              <v-col cols = 12>
                <v-btn text min-height="3em" color="white" class="pa-0" block>Кабинет

                </v-btn>
              </v-col>
            </v-row>
          </v-container>

    </v-col>
    </v-row>
  </v-container>
  </v-app-bar>
</template>

<style scoped>
.test1{
  background: #1e1f22;
  height: 3em;
}
.test2{
  background: rgba(248, 7, 7, 0.0);
  height: 3em;
}
/deep/ .v-toolbar__content {
  padding: 0px !important;
}
.appbar{
  z-index: auto;

}
</style>

