<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
        class="delete-practice-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="delete-practice-dialog_first-title">Удаление записи</span>
        <span class="delete-practice-dialog_second-title">Вождение</span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="delete-practice-dialog_text">
          <div class="d-flex flex-row w-full">
            <div class="d-flex align-center justify-center">
              <v-icon class="time-of-practice-icon">mdi-clock-time-four-outline</v-icon>
            </div>
            <div class="d-flex flex-column justify-start">
              <div class="date-of-practice">{{ dateOfPractice }}</div>
              <div class="time-of-practice">{{ timeOfPractice }}</div>
            </div>
          </div>
          <div class="open-practice-dialog_text">
            <div
                v-for="item in items"
                class="d-flex flex-column"
            >
              <span class="review-practice-dialog_text_title">{{ item.title }}</span>
              <span class="teacher-text">{{ item.value }}</span>
            </div>
          </div>
          <div>
            <v-radio-group
                class="flex-row mt-2 pt-0"
                v-model="typeOfReasonId"
                row
                hide-details
            >
              <v-radio label="Отменена" :value="1"/>
              <v-radio label="Сгорела" :value="2"/>
            </v-radio-group>
          </div>
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
              :disabled="typeOfReasonId !== 1"
          />
        </div>
      </v-card-text>
      <v-card-actions class="pa-5">
        <div class="delete-practice-dialog_actions">
          <v-btn
              class="delete-practice-dialog_actions_cancel-button"
              text
              @click="onCancelClick"
          >
            <span>Отмена</span>
          </v-btn>
          <v-btn
              class="delete-practice-dialog_actions_save-button"
              @click="onDeleteClick"
          >
            <span>Удалить</span>
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
  name: "deletePracticeDialog",
  data: () => ({
    selectedReasonId: 1,
    typeOfReasonId: 1,
    localVisible: true,
  }),
  props: {
    data: {
      type: Object,
      default: {}
    },
  },
  computed: {
    dateOfPractice() {
      return `${moment(this.data.startTime).format('DD.MM.YYYY')} (${moment(this.data.startTime).locale('ru').format('dd')})`;
    },
    timeOfPractice() {
      return `${moment(this.data.startTime).format('HH:mm')} - ${moment(this.data.endTime).format('HH:mm')}`
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
    items() {
      return [
        {
          id: 0,
          title: 'Преподаватель',
          value: this.data.teacher
        },
        {
          id: 1,
          title: 'Коробка передач',
          value: this.data.e.event.transmissionTypeEnum === [1] ? 'АКП' : this.data.e.event.transmissionTypeEnum === [2] ? 'МКП' : '---'
        },
        {
          id: 2,
          title: 'Текущий студент',
          value: this.data.student
        },
      ]
    }
  },
  methods: {
    onCancelClick() {
      this.$emit('destroy', true)
    },
    async onDeleteClick() {
      let body = {}
      const event = new EventsRequest()
      if (this.data.isAdmin) {
        if (this.typeOfReasonId === 1) {
          body = {
            "id": this.data.e.event.id,
            "deleteReasonEnum": this.selectedReasonId
          }
          await event.closeAdminStudent(body).catch(x => console.log(x)).then(
              this.$emit('destroy', false)
          )
        } else {
          body = {
            "id": this.data.e.event.id,
            "stateEnum": this.typeOfReasonId
          }
          await event.closeAdminStudent(body).catch(x => console.log(x)).then(
              this.$emit('destroy', false)
          )
        }
      } else {
        if (this.typeOfReasonId === 1) {
          body = {
            "id": this.data.e.event.id,
            "deleteReasonEnum": this.selectedReasonId
          }
          await event.closePractice(body).catch(x => console.log(x)).then(
              this.$emit('destroy', false)
          )
        } else {
          body = {
            "id": this.data.e.event.id,
            "stateEnum": this.typeOfReasonId
          }
          await event.closePractice(body).catch(x => console.log(x)).then(
              this.$emit('destroy', false)
          )
        }
      }
    },
  },
}

</script>
<style scoped lang="scss">
.delete-practice-dialog {
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
    width: 100%
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

.time-of-practice-icon {
  color: #4E7AEC;
  margin-right: 8px;
}

.date-of-practice {
  color: #4E7AEC;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
}

.time-of-practice {
  color: #2B2A29;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
}
</style>