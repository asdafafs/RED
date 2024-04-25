<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
      class="open-practice-dialog"
      flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="open-practice-dialog_first-title">{{ isNew ? 'Новая запись' : 'Изменение записи'}}</span>
        <span class="open-practice-dialog_second-title">Вождение</span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="open-practice-dialog_text">
          <div class="d-flex flex-column">
            <span class="open-practice-dialog_text_title">Преподаватель</span>
            <span class="teacher-text">{{ isNew ? data.userName : data.teacher }}</span>
          </div>
          <div>
            <span class="open-practice-dialog_text_title">Коробка передач</span>
            <v-radio-group
              class="flex-row mt-2 pt-0"
              v-model="selectedTransmission"
              row
              hide-details
            >
              <v-radio label="АКП" :value="1"/>
              <v-radio label="МКП" :value="2"/>
            </v-radio-group>
          </div>
          <div class="d-flex flex-column">
            <span class="open-practice-dialog_text_title">Город</span>
            <span class="teacher-text">Северодвинск</span>
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
          <div>
            <span class="duration-text">Продолжительность</span>
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
            @click="saveEvent"
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
    selectedTransmission: 1,
    selectedStudentId: null,
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
  watch: {
    eventDate() {
      console.log('date',this.eventDate)
    }
  },
  mounted() {
    if (!this.isNew) {
      this.eventDate = moment(this.data.e.event.startTime).format('YYYY-MM-DD')
      this.eventStartTime = moment(this.data.e.event.startTime).format('HH:mm')
      this.selectedDuration = +moment(this.data.e.event.endTime).format('HH') - +moment(this.data.e.event.startTime).format('HH') === 1 ? 1 : 2
      this.selectedTransmission = 1
      this.selectedStudentId = this.data.listStudents.find(student => student.id === this.data.e.event.studentId) || null
    } else {
      this.eventDate = moment().format('YYYY-MM-DD')
      this.eventStartTime = '06:00'
    }
  },
  computed: {
    minDate() {
      return moment().locale('ru').format('DD-MM-YYYY')
    }
  },
  methods: {
    onCancelClick() {
      this.$emit('destroy',true)
    },
    async saveEvent() {
      const [hours, minutes] = this.eventStartTime.split(':');
      const startTime = moment.utc(this.eventDate).hour(parseInt(hours)).minute(parseInt(minutes));
      const endTime = startTime.clone().add(this.selectedDuration, 'hours');
      
      const body = {
        "startTime": startTime,
        "endTime": endTime,
        "studentId": this.selectedStudentId,
        "activeUserId": this.data.userId
      }
      const event = new EventsRequest()
      await event.postPractice(body).then(() => {
        this.$emit('destroy',false)
      }).catch(x => console.log(x))
    },
  }
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

      span:first-of-type{
        color: black;
      }
    }
    &_save-button {
      border-radius: 12px !important;
      background-color: #4E7AEC !important;
      height: 32px !important;
      width: 89px !important;
      text-transform: none !important;

      span:first-of-type{
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
  color:black !important;
}
.teacher-text {
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 400;
  color:black !important;
}
</style>