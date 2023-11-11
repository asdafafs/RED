<script>
  import LogoRed from "@/components/LogoRed.vue";

  export default {
    components: {LogoRed},
    data: () => ({
      overlay: true,
    }),
  }
</script>

<template>
 <v-row
    align="center"
    class="ma-4"
    justify="center"
  >
      <v-row justify="center">
        <v-overlay
          v-model="overlay"
          contained
          class="blur"
        >
          <v-row align="center" justify="center" class="width ">
            <v-col cols="4" class="height" >
              <div class = "d-flex justify-space-between flex-column white height rounded-lg " >
                <div  class="black--text mx-4 text-h6 pa-2" > Добро пожаловать! </div>
                <div  class="black--text mx-4 pa-0">Для продолжения работы в RED: Расписание, пожалуйста, авторизуйтесь через Вконтакте.</div>
              <LogoRed class = "pos"></LogoRed>
              <v-btn
                  color="#4E7AEC"
                  @click="overlay = false; "
                  class = "rounded-lg"
                  max-height="3em"
                  block
              >
                Войти через VK
              </v-btn>
              </div>

            </v-col>
          </v-row>

        </v-overlay>
      </v-row>

  </v-row>
</template>


<style scoped>
.blur
{
  backdrop-filter: blur(5px);
}
.width
{
  width: 60em;
}
.height
{
  min-height: 18rem;
}

.pos
{
  align-self: center;
  transform: scale(2.1);
}
</style>