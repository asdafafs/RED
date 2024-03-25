<template>
  <v-container fluid>
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
    <hr style="margin: 1em 0 2em 0 !important;">
    <v-row class="flex-wrap">
      <v-col cols="lg-1 md-1 py-0" class="flex-column align-center bg-surface-variant d-flex">
        <v-radio-group class="px-0 py-0 align-center" v-model="selectedDuration" hide-details="true"
                       :disabled="blockEditableTemplate">
          <v-radio label="1 час" :value="1"></v-radio>
          <v-radio label="2 часа" :value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="lg-2 md-2 py-0" class="align-center bg-surface-variant d-flex">
        <v-text-field v-model="practiceCourseStart" label="Дата начала" type="date"
                      :rules="[startDateRules.required]" :min="getTodayDate()" outlined
                      class="rounded-xl align-center" hide-details :disabled="blockEditableTemplate"></v-text-field>
      </v-col>
      <v-col cols="lg-2 md-2 py-0" class="align-center bg-surface-variant d-flex">
        <v-text-field v-model="practiceCourseEnd" label="Дата окончания" type="date"
                      :rules="[endTimeRules.required]" :min="getTodayDate()" outlined
                      class="rounded-xl align-center" hide-details :disabled="blockEditableTemplate"></v-text-field>
      </v-col>
      <v-col cols="lg-2 md-2 py-0" class="align-center bg-surface-variant d-flex">
        <v-select v-model="selectedTemplate" label="Выберите шаблон практик" :items="listTemplates"
                  no-data-text="Нет данных для отображения"
                  :item-text="item => item.practiceCourseId ? `${new Date(item.practiceCourseStart).
                  toLocaleDateString().replace(/\./g, '-')} ${new Date(item.practiceCourseEnd)
                  .toLocaleDateString().replace(/\./g, '-')}` : 'Добавить новый шаблон'"
                  item-value="practiceCourseId"
                  @change="getPracticeCourseTemplate();
blockEditableTemplate = selectedTemplate ? !!selectedTemplate.practiceCourseId : false"
                  outlined
                  class="rounded-xl " hide-details
                  style="min-width:256px;">
        </v-select>
      </v-col>
      <v-col cols="lg-2 md-0 sm-0 pa-0"></v-col>
      <v-col cols=" px-0">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" outlined @click="save" :disabled="savePlanDisabled">
          <span class="black--text">Сохранить изменения</span>
        </v-btn>
      </v-col>
      <v-col cols=" px-0">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" text @click="cancelChanges">
          <span class="black--text">Выйти без изменений</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <TemplateSchedule @plan-updated="handleEvents" :selectedDuration="selectedDuration"
                        :fullNameActiveUser="fullName" :events="eventsTemplate"></TemplateSchedule>
    </v-row>
    <v-dialog v-model="cancelSaveChanges" max-width="500px">
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
import {successAlert, warningAlert} from "@/components/Alerts/alert";

export default {
  name: 'PlanTemplate',
  components: {TemplateSchedule},
  data: () => ({
    fullName: '',
    eventsTemplate: [],
    selectedDuration: 1,
    practiceCourseStart: null,
    practiceCourseEnd: null,
    listTemplates: [{
      "practiceCourseId": null,
      "practiceCourseStart": null,
      "practiceCourseEnd": null,
      "test": 'TEST'
    }],
    selectedTemplate: null,
    cancelSaveChanges: false,
    blockEditableTemplate: false,
    startDateRules: {
      required: value => !!value
    },
    endTimeRules: {
      required: value => !!value
    },
  }),

  computed: {
    getIdUser() {
      const {selectedUserID} = this.$route.params;
      return selectedUserID;
    },

    savePlanDisabled() {
      return !(this.startDateRules.required(this.practiceCourseStart) && this.endTimeRules.required(this.practiceCourseEnd))
    },

  },

  methods: {
    handleEvents(events) {
      this.eventsTemplate = events
      console.log('handleEvents', this.eventsTemplate)
    },

    prev() {
      const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined);
      if (hasUnsavedTime){
        warningAlert('Есть несохранненые изменения', 5000)
      }
      else{
        this.$router.push({name: 'admin-teachers'})
      }
    },

    async save() {
      const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined);
      if (hasUnsavedTime) {
        const body = {
          "practiceCourseId": this.selectedTemplate,
          "practiceCourseStart": this.practiceCourseStart,
          "practiceCourseEnd": this.practiceCourseEnd,
          "activeUserId": this.getIdUser,
          'duration': this.selectedDuration,
          "practices": this.eventsTemplate
        };

        await this.postPracticeCourseTemplate(body);
        await this.getPracticeCourseTemplate()
        successAlert('Изменения сохранены успешно', 5000);


      } else {
        warningAlert('Не обнаружено доступных изменений', 5000)
      }
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

      templates.forEach(template => {
        this.listTemplates.push(template);
      });
      return this.listTemplates
    },

    async getPracticeCourseTemplate() {
      if (this.selectedTemplate === null) {
        return this.eventsTemplate = []
      }
      const practiceCourseTemplate = new PracticeCourseRequest()
      let events;
      await practiceCourseTemplate.getPracticeCourseId(this.selectedTemplate)
          .catch(error => console.log(error))
          .then(response => {
            events = response.data.practices.map(practice => ({
              ...practice,
              color: '#9DB9FF',
              savedTime: practice.start
            }));
            this.selectedDuration = response.data.duration;
            this.practiceCourseStart = response.data.practiceCourseStart.slice(0, 10);
            this.practiceCourseEnd = response.data.practiceCourseEnd.slice(0, 10);
          });
      this.blockEditableTemplate = this.selectedTemplate !== null;
      return this.eventsTemplate = events
    },

    async postPracticeCourseTemplate(body) {
      const practiceCourse = new PracticeCourseRequest()
      await practiceCourse.postPracticeCourse(body).catch(x => console.log(x))
    },

    closeCanselChanges() {
      this.cancelSaveChanges = false
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
      const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined);
      if (!hasUnsavedTime) {
        warningAlert('Не обнаружено доступных изменений', 5000)
      } else {
        warningAlert('Есть несохранненые изменения', 5000)
      }
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