<template>
  <v-container class="px-4 pa-0 ma-0" fluid>
    <v-row no-gutters align="center" class="spacer">
      <v-col lg="">
        <div class="text-h4 font-weight-bold">
          <v-btn icon class="ma-0  align-self-center" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span v-if="fullName">{{ fullName }}</span>
        </div>
      </v-col>
    </v-row>
    <hr>
    <v-row>
      <v-col cols="1" class="flex-column">
        <v-radio-group class="px-0 py-0" v-model="selectedDuration">
          <v-radio label="1 час" :value=1></v-radio>
          <v-radio label="2 часа" :value=2></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="practiceCourseStart" label="Дата начала" type="date"
                      :min="getTodayDate()"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="practiceCourseEnd" label="Дата окончания" type="date"
                      :min="getTodayDate()"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedTemplate" label="Выберите шаблон практик" :items="listTemplates"
                  no-data-text="Нет данных для отображения"
                  :item-text="item =>
                  `${new Date(item.practiceCourseStart).toLocaleDateString().replace(/\./g, '-')} ${new Date(item.practiceCourseEnd)
                  .toLocaleDateString().replace(/\./g, '-')}`"
                  item-value="practiceCourseId"
                  @change="getPracticeCourseTemplate()">></v-select>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" outlined @click="save">
          <span class="black--text">Сохранить изменения</span>
        </v-btn>
      </v-col>
      <v-col cols="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" text @click="cancelChanges">
          <span class="black--text">Выйти без изменений</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <TemplateSchedule @plan-updated="handleEvents" :selectedDuration="selectedDuration"
                        :fullNameActiveUser="fullName" :events="eventsTemplate"></TemplateSchedule>
    </v-row>
    <v-dialog v-model="groupDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Вы уверены? Все несохраненные изменения будут удалены</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCanselChanges">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="confirmCancelChanges">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import TemplateSchedule from "@/views/AdminPanels/TemplateSchedule.vue";
import UsersRequest from "@/services/UsersRequest";
import PracticeCourseRequest from "@/services/PracticeCourseRequest";
import moment from "moment";

export default {
  name: 'PlanTemplate',
  components: {TemplateSchedule},
  data: () => ({
    fullName: '',
    eventsTemplate: [],
    selectedDuration: 1,
    practiceCourseStart: null,
    practiceCourseEnd: null,
    listTemplates: [],
    selectedTemplate: null,
    groupDelete: false,
  }),

  computed: {
    getIdUser() {
      const {selectedUserID} = this.$route.params;
      return selectedUserID;
    },

  },

  methods: {
    handleEvents(events) {
      this.eventsTemplate = events
      console.log('handleEvents',this.eventsTemplate)
    },

    prev() {
      this.$router.push({name: 'admin-teachers'})
    },

    async save() {
      const body = {
        "practiceCourseId": this.selectedTemplate,
        "practiceCourseStart": this.practiceCourseStart,
        "practiceCourseEnd": this.practiceCourseEnd,
        "activeUserId": this.getIdUser,
        "practices": [
          this.eventsTemplate
        ]
      }
      console.log(body)
      //await this.postPracticeCourseTemplate(body)
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

    async getListTemplates() {
      const listTemplates = new PracticeCourseRequest()
      const id = this.getIdUser
      let templates
      await listTemplates.getPracticeCourseActiveUser(id).catch(x => console.log(x)).then(x => {
        templates = x.data.practiceCourseContents
      })

      //console.log(templates)
      return this.listTemplates = templates
    },

    async getPracticeCourseTemplate() {
      //console.log('getPracticeCourseTemplate',this.selectedTemplate)
      const practiceCourseTemplate = new PracticeCourseRequest()
      let events
      await practiceCourseTemplate.getPracticeCourseId(this.selectedTemplate).catch(x => console.log(x)).then(x => {
        events = x.data.practices
      })
      //console.log(events)
      return this.eventsTemplate= events
    },

    async postPracticeCourseTemplate(body) {
      const practiceCourse = new PracticeCourseRequest()
      await practiceCourse.postPracticeCourse(body).catch(x => console.log(x))
    },

    closeCanselChanges() {
      this.groupDelete = false
    },

    confirmCancelChanges() {
      this.$router.push({name: 'admin-teachers'}).finally(() => {
        this.eventsTemplate = []
        this.selectedDuration = 1
        this.practiceCourseStart = null
        this.practiceCourseEnd = null
        this.listTemplates = []
      })
    },

    cancelChanges() {
      this.groupDelete = true
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
    },

    initialize() {
      this.getListTemplates()
    }
  },
  created() {
    this.getActiveUser().then(response => this.fullName = `${response.name} ${response.surname} ${response.middleName}`)
    this.initialize()
  }
}
</script>
<style>
</style>