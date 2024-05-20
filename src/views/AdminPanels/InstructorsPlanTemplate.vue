<template>
  <v-container fluid>
    <v-row no-gutters align="center">
      <v-col style="width: min-content">
        <div :class="isMobile ? 'mobile-title' : 'desk-title'">
          <v-btn icon class="ma-0  align-self-center" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span v-if="fullName">{{ fullName }}</span>
        </div>
      </v-col>
    </v-row>
    <hr style="margin: 1em 0 1em 0 !important;">
    <div class="d-flex width-full flex-wrap justify-space-between">
      <v-btn-toggle
          v-model="selectedModeType"
          mandatory
          group
          color="black"
          class="flex-wrap"
      >
        <div
            v-for="item in calendarButtons"
            :key="item.id"
            class="toggle-button-container"
        >
          <v-btn
              height="32"
              class="toggle-button-template"
              :value="item.id"
              @click="onToggleClick(item.id)"
          >
        <span :class="selectedModeType === item.id ? 'blue-text' : 'grey--text'">
          {{ item.title }}
        </span>
          </v-btn>
          <div v-if="selectedModeType === item.id" class="underline"></div>
        </div>
      </v-btn-toggle>
    </div>

    <v-row class="flex-wrap"
           style="column-gap: 32px !important; row-gap: 32px !important; padding-left: 12px; margin-top: 70px; min-height: 56px"
           v-if="!isMobile">
      <v-col style="max-width: min-content" class="align-center bg-surface-variant d-flex py-0 px-0"
             v-if="selectedModeType !==2">
        <v-text-field v-model="practiceCourseStart" label="Дата начала" type="date" ref="startDateField"
                      :rules="[startDateRules.required]" :min="getTodayDate()" outlined
                      class="select-date-practice-template" hide-details
                      style="border-radius: 12px !important; max-height: 32px !important; max-width: 156px !important;"/>
      </v-col>
      <v-col class="align-center bg-surface-variant d-flex py-0 px-0" style="max-width: min-content"
             v-if="selectedModeType !==2">
        <v-text-field v-model="practiceCourseEnd" label="Дата окончания" type="date" ref="endDateField"
                      :rules="[endTimeRules.required]" :min="getTodayDate()" outlined
                      class="select-date-practice-template"
                      style="border-radius: 12px !important; max-height: 32px !important; max-width: 156px !important;"
                      hide-details/>
      </v-col>
      <v-col class="flex-column align-center bg-surface-variant d-flex py-0 px-0" v-if="selectedModeType !==2"
             style="min-width: 80px !important; max-width: min-content">
        <v-radio-group class="px-0 py-0 align-center ma-0" v-model="selectedDuration" hide-details>
          <v-radio :value="1">
            <template v-slot:label>
              <strong
                  style="color:#2B2A29; font-weight: 400; font-size: 16px !important; line-height: 18.75px !important;">1
                час</strong>
            </template>
          </v-radio>
          <v-radio :value="2">
            <template v-slot:label>
              <strong
                  style="color:#2B2A29; font-weight: 400 !important; font-size: 16px !important; line-height: 18.75px !important;">2
                часа</strong>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="" class="align-center bg-surface-variant d-flex py-0 px-0"
             style="max-width: min-content">
        <v-select v-model="selectedTemplate" label="Выберите шаблон практик" :items="listTemplates"
                  no-data-text="Нет данных для отображения"
                  item-value="practiceCourseId"
                  @change="getPracticeCourseTemplate(); blockEditableTemplate = selectedTemplate ? !!selectedTemplate.practiceCourseId : false"
                  outlined hide-details
                  class="select-practice-template"
                  style="border-radius: 12px !important; max-height: 41px !important; min-width: 256px !important; max-width: 256px !important; "
                  refreshToken
        >
          <template #selection="{ item }">
            <div v-if="item.practiceCourseId">
              <span style="font-size: 16px; line-height: 18.75px; font-weight: 400; color: #2B2A29">
                {{ new Date(item.practiceCourseStart).toLocaleDateString().replace(/\./g, '.') }}
                {{ new Date(item.practiceCourseEnd).toLocaleDateString().replace(/\./g, '.') }}
              </span>
              <br>
              <span style="font-size: 12px; line-height: 14px; font-weight: 400; color: #A6A8AA">{{
                  formatCity(item.city)
                }}</span>
            </div>
            <div v-else>
              <span>Период</span>
              <br>
              <span style="font-size: 12px; line-height: 14px; font-weight: 400; color: #A6A8AA">Город</span>
            </div>
          </template>
          <template #item="{ item }">
            <div v-if="item.practiceCourseId">
              <span style="font-size: 16px; line-height: 18.75px; font-weight: 400; color: #2B2A29">
                {{ new Date(item.practiceCourseStart).toLocaleDateString().replace(/\./g, '.') }}
                {{ new Date(item.practiceCourseEnd).toLocaleDateString().replace(/\./g, '.') }}
              </span><br>
              <span style="font-size: 12px; line-height: 14px; font-weight: 400; color: #A6A8AA">{{
                  formatCity(item.city)
                }}</span>
            </div>
            <span v-else>
              Добавить новый шаблон
            </span>
          </template>
        </v-select>
      </v-col>
      <v-col cols="" class="align-center bg-surface-variant d-flex py-0 px-0" style="max-width: min-content"
             v-if="selectedModeType !==2">
        <v-select v-model="selectedCity" label="Город" :items="listCities"
                  item-value="id"
                  no-data-text="Нет данных для отображения"
                  outlined hide-details
                  class="select-date-practice-template"
                  style="border-radius: 12px !important; max-height: 32px !important; min-width: 256px !important; max-width: 256px !important;"
                  ref="selectedCity"/>
      </v-col>
      <v-col class="align-center d-flex flex-row pa-0" style="width: min-content"
             v-if="hasChanges && selectedModeType !==2">
        <v-btn class="tab-button pa-0 rounded-lg" color="#4E7AEC" @click="save"
               style="min-width: 132px !important; max-height: 32px !important;"
               :disabled="isSaveButtonDisabled">
          <span class="white--text">Добавить</span>
        </v-btn>
        <v-btn class="tab-button pa-0 rounded-lg ml-3" color="#2B2A29" outlined @click="cancelChanges"
               style="min-width: 132px !important; max-height: 32px !important;">
          <span class="black--text">Отмена</span>
        </v-btn>
      </v-col>
      <v-col class="align-center d-flex flex-row pa-0" style="width: min-content"
             v-if="selectedModeType ===2 && selectedTemplate">
        <v-btn class="tab-button pa-0 rounded-lg" color="#4E7AEC" @click="deletePracticeCourse"
               style="min-width: 132px !important; max-height: 32px !important;">
          <span class="white--text">Удалить</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pt-5" v-if="!isMobile">
      <TemplateSchedule @plan-updated="handleEvents" :selectedDuration="selectedDuration" :fullNameActiveUser="fullName"
                        :events="eventsTemplate" :practiceCourseStart="dateFirstPractice" :showMobile="isMobile"
                        :is-delete-mode="lastSelectedJoinType === 2"/>
    </v-row>
    <div v-if="isMobile" class="text-alert">
      <span style="text-align: center;">Функция определения плана доступна только с ПК</span>
    </div>
  </v-container>
</template>
<script>
import TemplateSchedule from "@/views/AdminPanels/TemplateSchedule.vue";
import UsersRequest from "@/services/UsersRequest";
import PracticeCourseRequest from "@/services/PracticeCourseRequest";
import {errorAlert, successAlert, warningAlert} from "@/components/Alerts/alert";
import {mapState} from "vuex";
import {formatCity} from "@/utils/utils";

export default {
  name: 'PlanTemplate',
  components: {TemplateSchedule},
  data: () => ({
    isSaveButtonDisabled: false,
    fullName: '',
    eventsTemplate: [],
    originalEventsTemplate: [],
    originalCity: null,
    originalPracticeCourseStart: null,
    originalPracticeCourseEnd: null,
    selectedDuration: 1,
    practiceCourseStart: null,
    practiceCourseEnd: null,
    dateFirstPractice: null,
    selectedCity: null,
    listCities: [{id: [1], text: 'Северодвинск'}, {id: [2], text: 'Новодвинск'}],
    listTemplates: [{
      "practiceCourseId": null,
      "practiceCourseStart": null,
      "practiceCourseEnd": null,
      "test": 'TEST'
    }],
    selectedTemplate: null,
    blockEditableTemplate: false,
    startDateRules: {
      required: value => !!value
    },
    endTimeRules: {
      required: value => !!value
    },
    transmissionTypeEnum: [],
    responseListCities: [],
    selectedModeType: null,
    lastSelectedJoinType: 1,
    refreshToken: true,
  }),

  computed: {
    ...mapState(['isMobile']),
    getIdUser() {
      const {selectedUserID} = this.$route.params;
      return selectedUserID;
    },

    hasChanges() {
      // console.log('JSON.stringify(this.eventsTemplate) !== JSON.stringify(this.originalEventsTemplate)', JSON.stringify(this.eventsTemplate) !== JSON.stringify(this.originalEventsTemplate))
      // console.log('this.originalCity !== this.selectedCity', this.originalCity !== this.selectedCity)
      // console.log('this.originalPracticeCourseStart !== this.practiceCourseStart', this.originalPracticeCourseStart !== this.practiceCourseStart)
      // console.log('this.originalPracticeCourseEnd !== this.practiceCourseEnd', this.originalPracticeCourseEnd !== this.practiceCourseEnd)
      return JSON.stringify(this.eventsTemplate) !== JSON.stringify(this.originalEventsTemplate) ||
          this.originalCity !== this.selectedCity ||
          this.originalPracticeCourseStart !== this.practiceCourseStart ||
          this.originalPracticeCourseEnd !== this.practiceCourseEnd;
    },

    calendarButtons() {
      return [
        {
          id: 1,
          title: 'СОЗДАТЬ НОВЫЙ',
        },
        {
          id: 2,
          title: 'УДАЛИТЬ СУЩЕСТВУЮЩИЙ',
        },
      ]
    },
  },

  methods: {
    formatCity,

    async deletePracticeCourse() {
      this.isSaveButtonDisabled = true
      const course = new PracticeCourseRequest()
      await course.deletePracticeCourseActiveUser(this.selectedTemplate).then(response => {
        if (response.status && response.status === 200) {
          successAlert(' Практики, созданные по плану, успешно удалены из расписания', 5000);
          this.refreshToken = false
          this.refreshToken = true
          this.listTemplates=  [{
            "practiceCourseId": null,
            "practiceCourseStart": null,
            "practiceCourseEnd": null,
            "test": 'TEST'
          }]
          this.initialize()
          this.onToggleClick(this.lastSelectedJoinType)
        }
      }).finally(() => {
        this.isSaveButtonDisabled = false
      })
    },

    onToggleClick(id) {
      this.selectedTemplate = null
      this.eventsTemplate = []
      this.originalEventsTemplate = []
      this.lastSelectedJoinType = id;
    },

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
      if (this.hasChanges) {
        warningAlert('Есть несохранненые изменения', 5000)
      } else {
        this.$router.push({name: 'admin-teachers'})
      }
    },

    async save() {
      this.isSaveButtonDisabled = true
      if (this.startDateRules.required(this.practiceCourseStart) && this.endTimeRules.required(this.practiceCourseEnd) && this.selectedCity) {
        const hasUnsavedTime = this.eventsTemplate.some(event => event.savedTime === undefined || event.startTime !== event.savedTime);
        if (hasUnsavedTime) {
          const body = {
            "practiceCourseId": this.selectedTemplate,
            "practiceCourseStart": this.practiceCourseStart,
            "practiceCourseEnd": this.practiceCourseEnd,
            "activeUserId": parseInt(this.getIdUser),
            'duration': this.selectedDuration,
            "practices": this.eventsTemplate,
            "transmissionTypeEnum": this.transmissionTypeEnum,
            "city": this.selectedCity
          };
          await this.postPracticeCourseTemplate(body).finally(() => {
            this.isSaveButtonDisabled = false
          })
        } else {
          warningAlert('Не обнаружено доступных изменений', 5000)
          this.isSaveButtonDisabled = false
        }
      } else {
        errorAlert('Заполните все поля', 5000)
        if (!this.startDateRules.required(this.practiceCourseStart)) {
          this.$refs.startDateField.$el.classList.add('error--text');
        }
        if (!this.endTimeRules.required(this.practiceCourseEnd)) {
          this.$refs.endDateField.$el.classList.add('error--text');
        }
        if (!this.selectedCity) {
          this.$refs.selectedCity.$el.classList.add('error--text');
        }
        this.isSaveButtonDisabled = false
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
        this.originalEventsTemplate = []
        return this.eventsTemplate = []
      }
      const practiceCourseTemplate = new PracticeCourseRequest()
      let events;
      await practiceCourseTemplate.getPracticeCourseId(this.selectedTemplate)
          .catch(error => console.log(error))
          .then(response => {
            events = response.data.practices.map(practice => ({
              ...practice,
              color: '#FFFFFF',
              savedTime: practice.start
            }));
            this.selectedDuration = response.data.duration;
            this.practiceCourseStart = response.data.practiceCourseStart.slice(0, 10);
            this.practiceCourseEnd = response.data.practiceCourseEnd.slice(0, 10);
            this.selectedCity = response.data.city
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
      this.originalEventsTemplate = JSON.parse(JSON.stringify(events))
      this.originalPracticeCourseStart = this.practiceCourseStart
      this.originalPracticeCourseEnd = this.practiceCourseEnd
      this.originalCity = this.selectedCity
      return this.eventsTemplate = events
    },

    async postPracticeCourseTemplate(body) {
      const practiceCourse = new PracticeCourseRequest()
      await practiceCourse.postPracticeCourse(body).then(response => {
            if (response.status && response.status === 200) {
              successAlert('Изменения сохранены успешно', 5000);
              this.initialize()
            }
          }
      ).catch(x => console.log(x))
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

    async getTeacherInfo() {
      const teacher = new UsersRequest()
      await teacher.getActiveUserId(this.getIdUser).then(x => {
        this.transmissionTypeEnum = x.data.activeUsers[0].transmissionTypeEnum
      }).catch(error => console.log(error))
    },

    initializeCity() {
      const includes1 = this.responseListCities.includes(1);
      const includes2 = this.responseListCities.includes(2);
      if (includes1 && includes2) {
        this.listCities = [{id: [1], text: 'Северодвинск'}, {id: [2], text: 'Новодвинск'}]
      } else if (includes1) {
        this.listCities = [{id: [1], text: 'Северодвинск'}]
      } else if (includes2) {
        this.listCities = [{id: [2], text: 'Новодвинск'}]
      } else this.listCities = []
    },

    initialize() {
      this.getListTemplates()
      this.checkInitialValidity();
      this.getTeacherInfo()
      this.originalEventsTemplate = JSON.parse(JSON.stringify(this.eventsTemplate))
      this.originalCity = this.selectedCity
      this.originalPracticeCourseStart = this.practiceCourseStart
      this.originalPracticeCourseEnd = this.practiceCourseEnd;
      this.initializeCity()
    },

  },
  created() {
    this.getActiveUser().then(response => {
      this.fullName = `${response.surname} ${response.name} ${response.middleName}`
      this.responseListCities = response.city
    }).finally(() => {
      this.initialize()
    });
  },
}
</script>
<style lang="scss">
@import "@/assets/styles/titleStyles.css";

.select-practice-template {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 41px !important;

  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    max-height: 41px !important;
  }

  .v-label {
    color: currentColor;
  }

  .v-input {
    color: currentColor;
  }

  .v-input__control {
    max-height: 41px !important;

    .v-input__slot {
      max-height: 41px !important;

    }
  }
}

.select-date-practice-template {
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

      .v-select__slot {
        max-height: inherit !important;

        .v-select__selections {
          max-height: inherit !important;
          padding: 0 !important;
        }

        .v-input__append-inner {
          margin-top: 5px !important;
        }
      }
    }
  }
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: currentColor;
}

.theme--light.v-input input, .theme--light.v-input textarea {
  color: currentColor;
}

.text-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 600;
  color: #2B2A29
}

.toggle-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toggle-button-template {
  margin-right: 0 !important;
  margin-left: 0 !important;
  color: white !important;
  border-radius: 4px !important;
  text-transform: none !important;
  padding: 0 16px !important;
}

.toggle-button-template.v-btn--is-elevated {
  box-shadow: none !important;
}

.toggle-button-template.theme--light.v-btn.v-btn--has-bg {
  background-color: transparent !important;
}

.underline {
  width: 100%;
  height: 2px;
  background-color: #4E7AEC;
  margin-top: 4px;
}

.blue-text {
  color: #4E7AEC
}
</style>