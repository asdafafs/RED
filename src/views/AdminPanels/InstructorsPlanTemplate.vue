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
      <v-col class="flex-column align-center bg-surface-variant d-flex lg-2 md-2 sm-2 py-0"
             style="min-width: 109px !important;">
        <v-radio-group class="px-0 py-0 align-center ma-0" v-model="selectedDuration" hide-details
                       :disabled="blockEditableTemplate">
          <v-radio label="1 час" :value="1"></v-radio>
          <v-radio label="2 часа" :value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="lg-2 md-2 py-0" class="align-center bg-surface-variant d-flex">
        <v-text-field v-model="practiceCourseStart" label="Дата начала" type="date" ref="startDateField"
                      :rules="[startDateRules.required]" :min="getTodayDate()" outlined
                      class="select-practice-template" hide-details :disabled="blockEditableTemplate"
                      style="border-radius: 12px !important; max-height: 32px !important;"
        ></v-text-field>
      </v-col>
      <v-col cols="lg-2 md-2 py-0" class="align-center bg-surface-variant d-flex">
        <v-text-field v-model="practiceCourseEnd" label="Дата окончания" type="date" ref="endDateField"
                      :rules="[endTimeRules.required]" :min="getTodayDate()" outlined
                      class="select-practice-template"
                      style="border-radius: 12px !important; max-height: 32px !important;"
                      hide-details :disabled="blockEditableTemplate"></v-text-field>
      </v-col>
      <v-col cols="" class="align-center bg-surface-variant d-flex lg-2 md-2 sm-0 py-0">
        <v-select v-model="selectedTemplate" label="Выберите шаблон практик" :items="listTemplates"
                  no-data-text="Нет данных для отображения"
                  :item-text="item => item.practiceCourseId ? `${new Date(item.practiceCourseStart).
                  toLocaleDateString().replace(/\./g, '-')} ${new Date(item.practiceCourseEnd)
                  .toLocaleDateString().replace(/\./g, '-')}` : 'Добавить новый шаблон'"
                  item-value="practiceCourseId"
                  @change="getPracticeCourseTemplate();
blockEditableTemplate = selectedTemplate ? !!selectedTemplate.practiceCourseId : false"
                  outlined hide-details
                  class="select-practice-template"
                  style="border-radius: 12px !important; max-height: 32px !important; min-width: 256px !important;">
        </v-select>
      </v-col>
      <v-col cols="lg-2 md-0 sm-0 pa-0"></v-col>
      <v-col cols=" px-0">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" outlined @click="save">
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
                        :fullNameActiveUser="fullName" :events="eventsTemplate"
                        :practiceCourseStart="dateFirstPractice"></TemplateSchedule>
    </v-row>
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
    dateFirstPractice: null,
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
  },

  methods: {
    handleEvents(events) {
      this.eventsTemplate = events
      if (events.length > 0) {
        const earliestEvent = events.reduce((earliest, current) => {
          if (current.start < earliest.start) {
            return current;
          } else {
            return earliest;
          }
        });
        this.dateFirstPractice = earliestEvent.start;
      }
    },

    prev() {
      const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined);
      if (hasUnsavedTime) {
        warningAlert('Есть несохранненые изменения', 5000)
      } else {
        this.$router.push({name: 'admin-teachers'})
      }
    },

    async save() {
      if (this.startDateRules.required(this.practiceCourseStart) && this.endTimeRules.required(this.practiceCourseEnd)) {
        const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined || event.startTime !== event.savedTime);
        if (hasUnsavedTime) {
          const body = {
            "practiceCourseId": this.selectedTemplate,
            "practiceCourseStart": this.practiceCourseStart,
            "practiceCourseEnd": this.practiceCourseEnd,
            "activeUserId": this.getIdUser,
            'duration': this.selectedDuration,
            "practices": this.eventsTemplate
          };
          await this.postPracticeCourseTemplate(body).then(() => {
            successAlert('Изменения сохранены успешно', 5000);
          })
          this.initialize()


        } else {
          warningAlert('Не обнаружено доступных изменений', 5000)
        }
      } else {
        if (!this.startDateRules.required(this.practiceCourseStart)) {
          this.$refs.startDateField.$el.classList.add('error--text');
        }
        if (!this.endTimeRules.required(this.practiceCourseEnd)) {
          this.$refs.endDateField.$el.classList.add('error--text');
        }
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
        console.log('ничего не будет')
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

      if (events.length > 0) {
        const earliestEvent = events.reduce((earliest, current) => {
          if (current.start < earliest.start) {
            return current;
          } else {
            return earliest;
          }
        });
        this.dateFirstPractice = earliestEvent.start;
      }

      return this.eventsTemplate = events
    },

    async postPracticeCourseTemplate(body) {
      const practiceCourse = new PracticeCourseRequest()
      await practiceCourse.postPracticeCourse(body).catch(x => console.log(x))
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
      this.confirmCancelChanges()
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

    checkInitialValidity() {
      return !(this.startDateRules.required(this.practiceCourseStart) && this.endTimeRules.required(this.practiceCourseEnd))
    },

    initialize() {
      this.getListTemplates()
      this.checkInitialValidity();
    }
  },
  created() {
    this.getActiveUser().then(response => this.fullName = `${response.surname} ${response.name} ${response.middleName}`)
    this.initialize()
  }
}
</script>
<style>

.select-practice-template {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;

  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    max-height: 32px !important;
  }

  .v-label {
    color: currentColor;
  }

  .v-input {
    color: currentColor;
  }

  .v-input__control {
    max-height: 32px !important;

    .v-input__slot {
      max-height: 32px !important;

    }
  }
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: currentColor;
}

.theme--light.v-input input, .theme--light.v-input textarea {
  color: currentColor;
}
</style>