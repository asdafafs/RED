<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
        class="open-practice-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="open-practice-dialog_first-title">{{ isNew ? 'Новая запись' : 'Изменение записи'  }}</span>
        <div class="d-flex flex-row w-full" style="gap: 12px">
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
              <v-radio label="АКП" :value="[1]" v-if="data.teacherTransmissions.includes(1)"/>
              <v-radio label="МКП" :value="[2]" v-if="data.teacherTransmissions.includes(2)"/>
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
          <v-select
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
              @change="acceptStudent(selectedStudentId)"
          />
        </div>
        <div v-if="!isNew" class="d-flex flex-column" style="gap: 12px; padding-top: 12px;">
          <span class="open-practice-dialog_text_subtitle">Статус практики</span>
          <v-radio-group
              class="flex-row mt-2 pt-0"
              v-model="typeOfReasonId"
              row
              hide-details
          >
            <v-radio label="Ожидается" :value="0"/>
            <v-radio label="Отменена" :value="3"/>
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
              :disabled="typeOfReasonId !== 3"
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

export default {
  name: "openNewPracticeDialog",
  data: () => ({
    localVisible: true,
    eventDate: null,
    eventStartTime: null,
    selectedDuration: 1,
    selectedTransmission: null,
    selectedStudentId: null,
    selectedCity: [1],
    listCities: [{id: [1], text: 'Северодвинск'}, {id: [2], text: 'Новодвинск'}],
    typeOfReasonId: 1,
    selectedReasonId: 1,
    savedTransmission: []
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

  created() {
    console.log('created', this.data.listStudents)
  }
  ,
  mounted() {
    if (!this.isNew) {
      this.eventDate = moment(this.data.e.event.startTime).format('YYYY-MM-DD')
      this.eventStartTime = moment(this.data.e.event.startTime).format('HH:mm')
      this.selectedDuration = +moment(this.data.e.event.endTime).format('HH') - +moment(this.data.e.event.startTime).format('HH') === 1 ? 1 : 2
      this.selectedTransmission = this.data.e.event.transmissionTypeEnum
      this.savedTransmission = this.data.teacherTransmissions
      this.selectedCity = this.data.e.event.city
      const selectedStudent = this.data.listStudents.find(student => student.id === this.data.e.event.studentId);
      this.selectedStudentId = selectedStudent ? selectedStudent.id : null;
      this.typeOfReasonId = this.data.e.event.practiceStateEnum
    } else {
      this.eventDate = moment().format('YYYY-MM-DD')
      this.eventStartTime = '06:00'
      this.savedTransmission = this.data.teacherTransmissions
      this.selectedTransmission = this.data.teacherTransmissions
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
  },
  methods: {
    formatTransmissions(item) {
      const includes1 = item.includes(1);
      const includes2 = item.includes(2);
      if (includes1 && includes2) {
        return 'АКП, МКП';
      } else if (includes1) {
        return 'АКП';
      } else if (includes2) {
        return 'МКП';
      } else {
        return '';
      }
    },

    acceptStudent(id) {
      console.log('this.data.listStudents',this.data.listStudents)
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
        this.selectedTransmission = null
        this.data.teacherTransmissions = this.savedTransmission
      }
    },

    formatCity(item) {
      if (item) {
        const includes1 = item.includes(1);
        const includes2 = item.includes(2);
        if (includes1 && includes2) {
          return 'Северодвинск, Новодвинск';
        } else if (includes1) {
          return 'Северодвинск';
        } else if (includes2) {
          return 'Новодвинск';
        } else {
          return '';
        }
      }
    },
    onCancelClick() {
      this.$emit('destroy', true)
    },
    async saveEvent() {
      const [hours, minutes] = this.eventStartTime.split(':');
      const startTime = moment.utc(this.eventDate).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.selectedDuration, 'hours');

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
        }).catch(x => console.log(x))

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
        }).catch(x => console.log(x))
      }
    },

    async putEvent() {
      const [hours, minutes] = this.eventStartTime.split(':');
      const startTime = moment.utc(this.eventDate).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.selectedDuration, 'hours');
      let body = {}
      const event = new EventsRequest()
      if (this.data.isAdmin) {
        if (this.typeOfReasonId === 0) {
          body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "activeUserId": this.data.userId,
            "transmissionTypeEnum": null,
            "city": this.selectedCity
          }

          await event.putAdminPractice(body).catch(x => console.log(x)).then(() =>
              this.$emit('destroy', false)
          )
        } else if (this.typeOfReasonId === 2) {
          body = {
            "id": this.data.e.event.id,
          }
          await event.closeAdminStudent(body).catch(x => console.log(x)).then(() =>
              this.$emit('destroy', false)
          )
        } else if (this.typeOfReasonId === 3) {
          body = {
            "id": this.data.e.event.id,
            "stateEnum": this.typeOfReasonId
          }
          await event.canselAdminPractice(body).catch(x => console.log(x)).then(() =>
              this.$emit('destroy', false)
          )
        }
      } else {
        if (this.typeOfReasonId === 0) {
          const body = {
            "id": this.data.e.event.id,
            "startTime": startTime,
            "endTime": endTime,
            "studentId": this.selectedStudentId,
            "transmissionTypeEnum": null,
            "city": this.selectedCity
          }

          await event.putPractice(body).then(() => {
            this.$emit('destroy', false)
          }).catch(x => console.log(x))
        } else if (this.typeOfReasonId === 2) {
          body = {
            "id": this.data.e.event.id,
          }
          await event.closePractice(body).catch(x => console.log(x)).then(() =>
              this.$emit('destroy', false)
          )
        } else if (this.typeOfReasonId === 3) {
          body = {
            "id": this.data.e.event.id,
            "deleteReasonEnum": this.selectedReasonId
          }
          await event.cancelPractice(body).catch(x => console.log(x)).then(() =>
              this.$emit('destroy', false)
          )
        }
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
</style>