<template>
  <v-container class="px-4 pa-0 ma-0" fluid>
    <v-row no-gutters align="center"
          class="spacer" >
      <v-col cols="1" class="d-flex align-center justify-space-around">
        <v-avatar class="">
           <v-img
               src="https://cdn.vuetifyjs.com/images/john.jpg"
               alt="John">

           </v-img>
        </v-avatar>
      </v-col>
      <v-col cols="" >
        <div class="text-h4 font-weight-bold" style="">Здравствуйте, {{ name }}!</div>
      </v-col>
      <v-col cols="" class="align-self-end text-start">
        <div class="text-subtitle-1 uno">Вы зачислены в группу №{{groupId}}</div>
      </v-col>
      <v-spacer>
      </v-spacer>
      <v-col cols="1">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(0);">
          <span :class="{'uno': isButtonMenuPressed[0],}">Календарь</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[0]" class="button-line"></div>
      </v-col>
      <v-col cols="1">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(1);">
         <span :class="{'uno': isButtonMenuPressed[1],}">Прогресс</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[1]" class="button-line"></div>
      </v-col>
    </v-row>
    <hr>
    <v-row class="px-12">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold">Мое расписание</div>
      </v-col>
    </v-row>
    <v-row class="d-flex mt-0 ga-3 " no-gutters>
      <v-col cols="1">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[0],}"
               @click="changeButtonState(0);
               $router.push('/testPlan/testDay').catch(err => {})"
        >
          <span :class="{ 'custom_text':isButtonPressed[0]}">День</span>
        </v-btn>
      </v-col >
      <v-col cols="1">
        <v-btn text  class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[1]}"
               @click="changeButtonState(1);
               $router.push('/testPlan/testWeek').catch(err => {})">
          <span :class="{ 'custom_text':isButtonPressed[1]}">Неделя</span>
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn text class="black--text btn pa-0" width="100%"
               :class="{'custom-bg': isButtonPressed[2]}"
               @click="changeButtonState(2);
               $router.push('/testPlan/testMonth').catch(err => {})">
          <span :class="{ 'custom_text':isButtonPressed[2]}">Месяц</span>
        </v-btn>
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
  data: () => ({
    name: 'Сергей',
    groupId: 1,
    isButtonMenuPressed: [false, false,],
    isButtonPressed: [false, false, false]
  }),
  methods:{
    changeButtonMenuState(index) {
     if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonMenuPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonMenuPressed, index, true);
      this.lastPressedIndex = index;
    },
    changeButtonState(index){
      if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonPressed, index, true);
      this.lastPressedIndex = index;
    }
  }
}

</script>
<style scoped>
hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    padding: 0;
}

.uno{
  color: #4E7AEC;
}

.btn
{
  font-size: 1.125rem;
}

.button-line {
  width: 100%;
  height: 2px;
  background-color: black;
  margin-top: 5px;
}
</style>