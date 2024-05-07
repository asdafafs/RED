<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
        class="review-practice-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="review-practice-dialog_first-title">Сведения о записи</span>
        <div class="review-practice-dialog_top-buttons" v-if="data.userTeacher">
          <v-btn
              class="edit-buttons-div__edit-button"
              @click="openEditDialog"
          >
            <span class="edit-buttons-div__edit-button__text">Изменить</span>
          </v-btn>
          <v-btn
              color="edit-buttons-div__edit-button"
              @click="openDeleteDialog"
              v-if="data.isAdmin"
          >
            <span class="edit-buttons-div__edit-button__text">Удалить</span>
          </v-btn>
        </div>
        <span class="review-practice-dialog_second-title">Вождение</span>
        <div class="d-flex flex-row w-full">
          <div class="d-flex align-center justify-center">
            <v-icon class="time-of-practice-icon">mdi-clock-time-four-outline</v-icon>
          </div>
          <div class="d-flex flex-column justify-start">
            <div class="date-of-practice">{{ dateOfPractice }}</div>
            <div class="time-of-practice">{{ timeOfPractice }}</div>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="open-practice-dialog_text">
          <div
              v-for="item in items"
              class="d-flex flex-column"
          >
            <span class="review-practice-dialog_text_title">{{ item.title }}</span>
            <span class="teacher-text">{{ item.value }}</span>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pa-5">
        <div 
            class="review-practice-dialog_actions" 
            :class="data.student ? 'justify-space-between' : 'justify-end'"
        >
          <v-btn
              v-if="data.student"
              class="open-practice-dialog_actions_cancel-button"
              text
              @click="onCancelClick"
          >
            <span>Отмена</span>
          </v-btn>
          <v-btn
              class="review-practice-dialog_actions_save-button"
              @click="onSaveClick"
          >
            <span>{{ saveButtonTitle}}</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment/moment";
import EventsRequest from "@/services/EventsRequest";
import UsersRequest from "@/services/UsersRequest";

export default {
  name: "reviewPracticeDialog",
  data: () => ({
    localVisible: true,
  }),
  props: {
    data: {
      type: Object,
      default: {}
    },
  },
  created() {
    console.log('data.e.event',this.data.e.event)
  },
  computed: {
    saveButtonTitle() {
      if (this.data.student && this.data.userIsStudentInPractice) return  'Отписаться'
      if (this.data.student && !this.data.userIsStudentInPractice) return  'Записаться'
      if (this.data.userTeacher || this.data.isAdmin) return  'Понятно'
    },
    dateOfPractice() {
      return `${moment(this.data.e.event.startTime).format('DD.MM.YYYY')} (${moment(this.data.e.event.startTime).locale('ru').format('dd')})`;
    },
    timeOfPractice() {
      return `${moment(this.data.e.event.startTime).format('HH:mm')} - ${moment(this.data.e.event.endTime).format('HH:mm')}`
    },
    items() {
      return [
        {
          id: 0,
          title: 'Преподаватель',
          value: this.data.e.event.title,
          visible: true
        },
        {
          id: 1,
          title: 'Коробка передач',
          value: this.formatTransmissions(this.data.e.event.transmissionTypeEnum),
          visible: true
        },
        {
          id: 2,
          title: 'Город',
          value: this.formatCity(this.data.e.event.city),
          visible: true
        },
        {
          id: 3,
          title: 'Текущий студент',
          value: this.data.e.event.studentId ? this.data.studentName : '---',
          visible: true
        },
        {
          id: 4,
          title: 'Лимит часов',
          value: `Оплаченые (остаток ${this.data.studentGeneralHoursSpent} из ${this.data.studentGeneralHours})`,
          visible: true
        },
      ]
    }
  },
  methods: {
    onCancelClick() {
      this.$emit('destroy',true)
    },

    formatCity(item) {
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
    },

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

    async openEditDialog() {
      this.localVisible = false
      await this.$openNewPracticeDialogPlugin(this.data, false)
          .then(async (isCancel) => {
            if (!isCancel) {
              this.$emit('destroy', false)
            }
          })
          .finally(() => this.localVisible = true)
    },

    async openDeleteDialog() {
      this.localVisible = false
      await this.$deletePracticeDialogPlugin(this.data)
        .then(async (isCancel) => {
          if (!isCancel) {
            this.$emit('destroy', false)
          }
        })
        .finally(() => this.localVisible = true)
    },
    
    async onSaveClick() {
      if (this.saveButtonTitle === 'Отписаться') {
        await this.signPractice(true).then(()=>{
          this.$emit('destroy', false)
        })
      } else if (this.saveButtonTitle === 'Записаться') {
        await this.signPractice(false).then(()=>{
          this.$emit('destroy', false)
        })
      } else {
        this.$emit('destroy', true)
      }
    },
    
    async signPractice(remove) {
      const body = {
        eventId: this.data.e.event.id,
        studentId: remove ? null : this.data.userId,
      }
      const practice = new EventsRequest()
      await practice.setStudent(body).catch(x => console.log(x))
    },
  }
}

</script>
<style scoped lang="scss">
.w-full {
  width: 100%;
}

.review-practice-dialog {
  border-radius: 12px;
  border: 1px solid grey;

  &_text {
    display: flex;
    flex-direction: column;
    gap: 4px;

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
  }

  &_second-title {
    font-size: 32px;
    font-weight: 700;
    text-transform: none;
    color: black;
    line-height: 37.5px;
    width: 100%;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  &_top-buttons {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: start;
    box-shadow: none;
  }

  &_actions {
    display: flex;
    width: 100%;
    flex-direction: row;
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

.edit-buttons-div {
  margin-bottom: 12px !important;
  margin-top: 12px !important;

  &__edit-button {
    border-radius: 12px !important;
    border: 1px solid rgba(0, 0, 0, 0.53) !important;
    height: 32px !important;
    width: 100px !important;
    background-color: #FEFEFE !important;
    text-transform: none !important;
    margin: 0 16px 0 0 !important;
    box-shadow: none;

    &__text {
      color: #2B2A29 !important;
      text-transform: none !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 18.75px !important;
    }
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
