<template>
  <v-container class="px-4 pa-0 ma-0" fluid>
    <v-row no-gutters align="center" class="spacer">
      <v-col lg="">
        <div class="text-h4 font-weight-bold">
          <v-btn icon class="ma-0  align-self-center" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span v-if="test">{{ test }}</span>
        </div>
      </v-col>
    </v-row>
    <hr>
    <v-row>
      <v-col cols="1" class="flex-column">
        <v-radio-group class="px-0 py-0">
          <v-radio label="1 час" value="one"></v-radio>
          <v-radio label="2 часа" value="two"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Дата начала" type="date" :min="getTodayDate()"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Дата окончания" type="date" :min="getTodayDate()"></v-text-field>
      </v-col>
      <v-col cols="4"></v-col>
      <v-col cols="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" outlined @click="save">
          <span class="black--text">Сохранить изменения</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" text>
          <span class="black--text">Выйти без изменений</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <TemplateSchedule @plan-updated="handleEvents"></TemplateSchedule>
    </v-row>
  </v-container>
</template>
<script>
import TemplateSchedule from "@/views/AdminPanels/TemplateSchedule.vue";
import UsersRequest from "@/services/UsersRequest";

export default {
  name: 'PlanTemplate',
  components: {TemplateSchedule},
  data: () => ({
    test: '',
    testsTemplate: [],
  }),

  computed: {
    getIdUser() {
      const {selectedUserID} = this.$route.params;
      return selectedUserID;
    },

  },

  methods: {
    handleEvents(events) {
      this.testsTemplate = events
    },

    prev() {
      this.$router.push({name: 'admin-teachers'})
    },

    save() {
      console.log()
    },


    async getActiveUser() {
      const user = new UsersRequest();
      const id = this.getIdUser
      let teachersData
      await user.getActiveUserId(id).catch(x => console.log(x)).then(x => {
        teachersData = x.data.activeUsers[0]
      })
      return teachersData
    },


    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    }
  },
  created() {
    this.getActiveUser().then( response => this.test = `${response.name} ${response.surname} ${response.middleName}`)
  }
}
</script>
<style>
</style>