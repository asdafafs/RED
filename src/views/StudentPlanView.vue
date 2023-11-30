<template>
  <div>
    <v-container class="px-4 pa-0 ma-0" fluid v-if = "showDrawer">
      <v-row no-gutters align="center" class="spacer" >
        <v-col cols="1" class="d-flex align-center justify-space-around">
          <v-avatar class="">
             <v-img
                 src="https://cdn.vuetifyjs.com/images/john.jpg"
                 alt="John">
             </v-img>
          </v-avatar>
        </v-col>
        <v-col lg="" >
          <div class="text-h4 font-weight-bold">Здравствуйте, {{ name }}!</div>
        </v-col>
        <v-col lg="3" class="align-self-end text-start justify-start">
          <div class="text-subtitle-1 uno">Вы зачислены в группу №{{groupId}}</div>
        </v-col>
        <v-col cols="">
        </v-col>
        <v-col cols="1">
          <v-btn text class="grey--text btn pa-0" width="100%"
                 @click="changeButtonMenuState(0); $router.push('/testPlan/mainCal').catch(err => {})">
            <span :class="{'uno': isButtonMenuPressed[0],}">Календарь</span>
          </v-btn>
          <div v-show="isButtonMenuPressed[0]" class="button-line"></div>
        </v-col>
        <v-col cols="1">
          <v-btn text class="grey--text btn pa-0" width="100%"
                 @click="changeButtonMenuState(1); $router.push('/testPlan/progress').catch(err => {})">
           <span :class="{'uno': isButtonMenuPressed[1],}">Прогресс</span>
          </v-btn>
          <div v-show="isButtonMenuPressed[1]" class="button-line"></div>
        </v-col>
      </v-row>
      <hr>
      <router-view ></router-view>
    </v-container>
    <v-container class="px-4 pa-0 ma-0" fluid v-if = "!showDrawer">
      <v-row>
        <v-col cols="2" class="d-flex align-center justify-space-around">
        <v-avatar class="">
           <v-img
               src="https://cdn.vuetifyjs.com/images/john.jpg"
               alt="John">
           </v-img>
        </v-avatar>
      </v-col>
        <v-col cols="" >
          <div class="text-lg-h3 text-md-h4 text-sm-h5 text-xs-h5 font-weight-bold" style="">Здравствуйте, {{ name }}!</div>
          <div class="text-subtitle-1 uno">Вы зачислены в группу №{{groupId}}</div>
      </v-col>
      </v-row>
      <v-row>
      <v-col cols="">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(0); $router.push('/testPlan/mainCal').catch(err => {})">
          <span :class="{'uno': isButtonMenuPressed[0],}">Календарь</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[0]" class="button-line"></div>
      </v-col>
      <v-col cols="">
        <v-btn text class="grey--text btn pa-0" width="100%"
               @click="changeButtonMenuState(1); $router.push('/testPlan/progress').catch(err => {})">
         <span :class="{'uno': isButtonMenuPressed[1],}">Прогресс</span>
        </v-btn>
        <div v-show="isButtonMenuPressed[1]" class="button-line"></div>
      </v-col>
      </v-row>
      <hr>
      <router-view></router-view>
    </v-container>
  </div>
</template>
<script>

export default {
  components: {},
  data: () => ({
    showDrawer: true,
    name: 'Сергей',
    groupId: 1,
    isButtonMenuPressed: [false, false,],
  }),
  methods:{
    changeButtonMenuState(index) {
     if (this.lastPressedIndex !== -1) {
        this.$set(this.isButtonMenuPressed, this.lastPressedIndex, false);
      }
      this.$set(this.isButtonMenuPressed, index, true);
      this.lastPressedIndex = index;
    },
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