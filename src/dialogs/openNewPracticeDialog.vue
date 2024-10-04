<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
        class="open-practice-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="open-practice-dialog_first-title">{{ isNew ? 'Новая запись' : 'Изменение записи' }}</span>
        <div class="d-flex flex-row w-full flex-wrap" style="gap: 12px">
          <span class="open-practice-dialog_second-title">Вождение</span>
          <span class="edit-practice-label-closed white--text" v-if="!isNew && data.e.event.practiceStateEnum ===3">Отменена</span>
          <span class="edit-practice-label-burned white--text" v-if="!isNew && data.e.event.practiceStateEnum ===2">Сгорела</span>
        </div>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="open-practice-dialog_text">
          <div class="d-flex flex-column">
            <span class="open-practice-dialog_text_title">Преподаватель</span>
            <span class="teacher-text">{{ isNew ? data.userName : data.teacherName }}</span>
          </div>
          <div class="d-flex flex-row w-full"
               style="border-radius: 12px; border: #FFCD6D 1px solid; gap: 8px; padding: 4px 8px 4px 8px"
               v-if="false">
            <div v-if="">
              <div class="d-flex align-center justify-center">
                <warning-instructor-icon class="warning-icon"/>
              </div>
              <div class="d-flex align-center justify-center">
                <span class="warning-match">В расписании инструктора есть <br> другие занятия в это время </span>
              </div>
            </div>
          </div>
          <v-text-field
              class="v-text-field-custom-h-32 mt-2"
              v-model="eventDate"
              hide-details
              label="Дата"
              type="date"
              outlined
              dense
              :min="minDate"
          />
          <v-text-field
              class="v-text-field-custom-h-32 mt-2"
              v-model="eventStartTime"
              hide-details
              label="Время начала"
              type="time"
              outlined
              dense
          />
          <div v-if="data.teacherTransmissions.length < 2">
            <span class="open-practice-dialog_text_title">Коробка передач</span>
            <v-radio-group
                class="flex-row mt-2 pt-0"
                v-model="selectedTransmission"
                row
                hide-details
            >
              <v-radio label="АКП" :value="[2]" v-if="data.teacherTransmissions.includes(2)"/>
              <v-radio label="МКП" :value="[1]" v-if="data.teacherTransmissions.includes(1)"/>
            </v-radio-group>
          </div>
          <div v-else>
            <span class="open-practice-dialog_text_title">Коробка передач</span>
            <br>
            <span class="teacher-text">{{
                formatTransmissions(data.teacherTransmissions)
              }}</span>
          </div>
          <div class="d-flex flex-column" v-if="isNew">
            <span class="open-practice-dialog_text_title">Город</span>
            <v-select
                class="v-text-field-custom-h-32 mt-2"
                v-model="selectedCity"
                outlined
                dense
                hide-details
                no-data-text="Нет данных для отображения"
                item-value="id"
                :items="listCities"
            />
          </div>
          <div class="d-flex flex-column" v-else>
            <span class="open-practice-dialog_text_title">Город</span>
            <span class="teacher-text">{{
                this.formatCity(selectedCity)
              }}</span>
          </div>
          <div>
            <span class="open-practice-dialog_text_title">Продолжительность</span>
            <v-radio-group
                class="flex-row mt-2 pt-0"
                v-model="selectedDuration"
                row
                hide-details
            >
              <v-radio label="1 час" :value="1"/>
              <v-radio label="2 часа" :value="2"/>
            </v-radio-group>
          </div>
          <v-autocomplete
              class="v-text-field-custom-h-32 mt-2"
              v-model="selectedStudentId"
              outlined
              dense
              hide-details
              no-data-text="Нет данных для отображения"
              label="Ученик"
              item-value="id"
              :items="[...data.listStudents, { id: null, name: 'Студент не назначен' }]"
              :item-text="item => item ? `${item.surname || ''} ${item.name || ''} ${item.middleName || ''} ` : 'Студент не назначен'"
              @change="acceptStudent"
          >
            <template #selection="{ item }">
              <div v-if="item.id">
                <span>
                  {{ item.surname + " " + item.name + " " + item.middleName }}
                </span>
              </div>
              <div v-else style="padding-right: 16px">
                <span>Студент не назначен</span>
              </div>
            </template>
          </v-autocomplete>
        </div>
        <div v-if="!isNew" class="d-flex flex-column" style="gap: 12px; padding-top: 12px;">
          <span class="open-practice-dialog_text_subtitle">Статус практики</span>
          <v-radio-group
              class="flex-row mt-2 pt-0"
              v-model="typeOfReasonId"
              row
              hide-details
          >
            <v-radio label="Ожидается" v-if="!practicePassed" :value="0"/>
            <v-radio label="Завершена" v-if="practicePassed" :value="1" />
            <v-radio label="Отменена" :value="3" :disabled = "!canCancel"/>
            <v-radio label="Сгорела" :value="2"/>
          </v-radio-group>
          <v-select
              no-data-text="Нет данных для отображения"
              v-model="selectedReasonId"
              :items="reasonsRefusal"
              item-value="id"
              item-text="reason"
              class="v-text-field-custom-h-32"
              outlined
              dense
              hide-details
              :disabled="typeOfReasonId !== 3 || !canCancel"
          />
        </div>
      </v-card-text>
      <v-card-actions class="pa-5">
        <div class="open-practice-dialog_actions">
          <v-btn
              class="open-practice-dialog_actions_cancel-button"
              text
              @click="onCancelClick"
          >
            <span>Отмена</span>
          </v-btn>
          <v-btn
              class="open-practice-dialog_actions_save-button"
              @click="checkNewEvent"
              @keydown.enter="checkNewEvent"
              :disabled = saveEventDisabled
          >
            <span>Сохранить</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment/moment";
import EventsRequest from "@/services/EventsRequest";
import {formatTransmissions, formatCity} from '@/utils/utils';
import WarningIcon from "@/components/Icons/WarningIcon.vue";
import WarningInstructorIcon from "@/components/Icons/WarningInstructorIcon.vue";

export default {
  name: "openNewPracticeDialog",
  components: {WarningInstructorIcon, WarningIcon},
  data: () => ({
    localVisible: true,
    eventDate: null,
    eventStartTime: null,
    selectedDuration: 2,
    selectedTransmission: null,
    selectedStudentId: null,
    selectedCity: [1],
    listCities: [{id: [1], text: 'Северодвинск'}, {id: [2], text: 'Новодвинск'}],
    typeOfReasonId: 0,
    selectedReasonId: 1,
    savedTransmission: [],
    searchInput: '',
    refreshToken: true,
    currentTime: moment(),
    saveEventDisabled: false,
    canCancel: false,
  }),
  props: {
    data: {
      type: Object,
      default: {}
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    if (!this.isNew) {
      this.eventDate = moment(this.data.e.event.startTime).format('YYYY-MM-DD')
      this.eventStartTime = moment(this.data.e.event.startTime).format('HH:mm')
      this.selectedDuration = +moment(this.data.e.event.endTime).format('HH') - +moment(this.data.e.event.startTime).format('HH') === 1 ? 1 : 2
      this.selectedTransmission = this.data.e.event.transmissionTypeEnum
      this.savedTransmission = this.data.teacherTransmissions
      this.selectedCity = this.data.e.event.city
      const selectedStudent = this.data.listStudents.find(student => student.id === this.data.e.event.studentId);
      if (selectedStudent) {
        this.selectedTransmission = selectedStudent.transmissionTypeEnum
        this.data.teacherTransmissions = selectedStudent.transmissionTypeEnum
      }
      this.selectedStudentId = selectedStudent ? selectedStudent.id : null;
      this.typeOfReasonId = this.data.e.event.practiceStateEnum
      this.selectedReasonId = this.data.e.event.practiceDeleteReasonEnum !== 0 ? this.data.e.event.practiceDeleteReasonEnum : 1
      this.canCancel = this.data.canCancel
    } else {
      this.eventDate = this.data.practiceDate
      this.eventStartTime = '06:00'
      this.savedTransmission = this.data.teacherTransmissions
      this.selectedTransmission = this.data.teacherTransmissions
      this.canCancel = this.data.canCancel
    }
  },
  computed: {
    minDate() {
      return moment().locale('ru').format('DD-MM-YYYY')
    },

    reasonsRefusal() {
      return [
        {
          id: 1,
          reason: 'Ремонт'
        },
        {
          id: 2,
          reason: 'Семейные обстоятельств'
        },
        {
          id: 3,
          reason: 'Экзамен'
        },
        {
          id: 4,
          reason: 'Здоровье'
        },
        {
          id: 5,
          reason: 'Задачи офиса'
        }
      ]
    },

    practicePassed() {
      if (this.typeOfReasonId === 1 || this.typeOfReasonId === 0) {
        if (moment(this.data.e.event.startTime).isSameOrBefore(this.currentTime)) {
          this.typeOfReasonId = 1
        } else this.typeOfReasonId = 0
      }
      return moment(this.data.e.event.startTime).isSameOrBefore(this.currentTime)
    }
  },
  methods: {
    formatTransmissions,
    formatCity,

    acceptStudent(id) {
      const item = this.data.listStudents.find(student => student.id === id)
      if (item) {
        this.selectedTransmission = item.transmissionTypeEnum
        this.data.teacherTransmissions = item.transmissionTypeEnum
        if (this.isNew) {
          const includes1 = item.city.includes(1);
          const includes2 = item.city.includes(2);
          if (includes1 && includes2) {
            this.listCities = [
              {id: [1], text: 'Северодвинск'},
              {id: [2], text: 'Новодвинск'}
            ];
          } else if (includes1) {
            this.listCities = [{id: [1], text: 'Северодвинск'}];
            this.selectedCity = [1]

          } else if (includes2) {
            this.listCities = [{id: [2], text: 'Новодвинск'}];
            this.selectedCity = [2]
          }
        }
      } else {
        this.listCities = [
          {id: [1], text: 'Северодвинск'},
          {id: [2], text: 'Новодвинск'}];
        this.selectedTransmission = []
        this.data.teacherTransmissions = this.savedTransmission
      }
    },

    onCancelClick() {
      this.$emit('destroy', true)
    },

    async saveEvent() {
      const [hours, minutes] = this.eventStartTime.split(':');
      const startTime = moment.utc(this.eventDate).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.selectedDuration, 'hours');
      this.saveEventDisabled = true
      if (this.data.isAdmin) {
        const body = {
          "startTime": startTime,
          "endTime": endTime,
          "studentId": this.selectedStudentId,
          "activeUserId": this.data.userId,
          "transmissionTypeEnum": this.selectedTransmission,
          "city": this.selectedCity
        }
        const event = new EventsRequest()
        await event.postAdminPractice(body).then(() => {
          this.$emit('destroy', false)
        }).catch(x => console.log(x)).finally(() => this.saveEventDisabled = false)
      } else {
        const body = {
          "startTime": startTime,
          "endTime": endTime,
          "studentId": this.selectedStudentId,
          "transmissionTypeEnum": this.selectedTransmission,
          "city": this.selectedCity
        }
        const event = new EventsRequest()
        await event.postPractice(body).then(() => {
          this.$emit('destroy', false)
        }).catch(x => console.log(x)).finally(() => this.saveEventDisabled = false)
      }
    },

    async putEvent() {
      const [hours, minutes] = this.eventStartTime.split(':');
      const startTime = moment.utc(this.eventDate).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.selectedDuration, 'hours');
      let body = {}
      const event = new EventsRequest()
      this.saveEventDisabled = true
      if (this.data.isAdmin) {
        if (this.typeOfReasonId === 3) {
          body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "transmissionTypeEnum": this.selectedTransmission,
            "city": this.selectedCity,
            "practiceStateEnum": this.typeOfReasonId,
            "deleteReasonEnum": this.selectedReasonId,
          }
        } else {
          body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "transmissionTypeEnum": this.selectedTransmission,
            "city": this.selectedCity,
            "practiceStateEnum": this.typeOfReasonId,
          }
        }
        await event.putAdminPractice(body).then(() =>
            this.$emit('destroy', false)
        ).catch(x => console.log(x)).finally(() => this.saveEventDisabled = false)
      } else {
        if (this.typeOfReasonId === 3) {
          body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "transmissionTypeEnum": this.selectedTransmission,
            "city": this.selectedCity,
            "practiceStateEnum": this.typeOfReasonId,
            "deleteReasonEnum": this.selectedReasonId,
          }
        } else {
          body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "transmissionTypeEnum": this.selectedTransmission,
            "city": this.selectedCity,
            "practiceStateEnum": this.typeOfReasonId,
          }
        }
        await event.putPractice(body).then(() => {
          this.$emit('destroy', false)
        }).catch(x => console.log(x)).finally(() => this.saveEventDisabled = false)
      }
    },

    checkNewEvent() {
      if (this.isNew) {
        this.saveEvent()
      } else {
        this.putEvent()
      }
    },
  },
}

</script>
<style lang="scss">
.open-practice-dialog {
  border-radius: 12px;
  border: 1px solid grey;

  &_text {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &_title {
      font-size: 12px;
      font-weight: 400;
      line-height: 14.06px;
      text-transform: none;
    }

    &_subtitle {
      font-size: 24px;
      font-weight: 700;
      line-height: 28.13px;
      text-transform: none;
      color: black;
    }
  }

  &_first-title {
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    color: #A6A8AA;
    line-height: 14.06px;
    width: 100%;
    margin-bottom: 12px;
  }

  &_second-title {
    font-size: 32px;
    font-weight: 700;
    text-transform: none;
    color: black;
    line-height: 37.5px;
    word-break: keep-all !important;
    //width: 100%
  }

  &_actions {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-transform: none !important;

    &_cancel-button {
      border-radius: 12px !important;
      height: 32px !important;
      width: 89px !important;
      text-transform: none !important;

      span:first-of-type {
        color: black;
      }
    }

    &_save-button {
      border-radius: 12px !important;
      background-color: #4E7AEC !important;
      height: 32px !important;
      width: 89px !important;
      text-transform: none !important;

      span:first-of-type {
        color: white;
        font-weight: 600;
      }
    }
  }
}

.v-text-field-custom-h-32 {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__append-inner {
    margin-top: 4px !important;
  }

  .v-input__icon {
    max-height: 32px !important;
  }

  .v-input__control {
    max-height: 32px !important;

    .v-input__slot {
      max-height: 32px !important;
    }
  }

  .v-select__selections {
    max-height: 32px !important;
    display: flex !important;
    align-content: center !important;
  }
}

.duration-text {
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: black !important;
}

.teacher-text {
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 400;
  color: black !important;
}

.edit-practice-label-burned {
  background-color: #FF5055;
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 18.75px;
  height: 32px;
  width: 88px;
  padding: 8px 12px 8px 12px;
}

.edit-practice-label-closed {
  background-color: #2B2A29;
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 18.75px;
  height: 32px;
  width: 102px;
  padding: 8px 12px 8px 12px;
}

.w-full {
  width: 100%;
}

.warning-match {
  word-break: keep-all;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

.warning-icon {
  color: #FFCD6D !important;
  fill: #FFCD6D !important;
  height: 20px !important;
  width: 20px;
}

.v-autocomplete.v-select.v-input--is-focused input {
  min-width: 0 !important;
}
</style>