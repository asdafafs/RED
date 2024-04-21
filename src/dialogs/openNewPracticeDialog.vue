<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
      class="open-practice-dialog"
      flat
    >
      <v-card-title class="pa-3 d-flex flex-column justify-start">
        <span class="open-practice-dialog_first-title">Добавление записи</span>
        <span class="open-practice-dialog_second-title">Вождение</span>
      </v-card-title>
      <v-card-text class="pa-3 pt-0 pb-0">
        <div class="open-practice-dialog_text">
          <div>
            <span class="open-practice-dialog_text_title">Преподаватель</span>
            <span></span>
          </div>
          <div>
            <span class="open-practice-dialog_text_title">Коробка передач</span>
            <span></span>
          </div>
          <div>
            <span class="open-practice-dialog_text_title">Город</span>
            <span></span>
          </div>
          <v-text-field
            class="v-text-field-custom-h-32 mt-2"
            v-model="eventDate"
            hide-details 
            label="Дата" 
            type="date"
            outlined dense 
            
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
              outlined 
              dense 
              hide-details
              no-data-text="Нет данных для отображения" label="Ученик" item-value="id"
          />
        </div>
      </v-card-text>
      <v-card-actions class="pa-3">
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
            @click="onSaveClick"
          >
            <span>Сохранить</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "openNewPracticeDialog",
  data: () => ({
    localVisible: true,
    eventDate: null,
    eventStartTime: null,
    selectedDuration: 1,
  }),
  computed: {
   
  },
  methods: {
    onCancelClick() {
      this.$emit('destroy')
    },
    onSaveClick() {
      
    },
    openNewEvent() {
      this.newEvent = true
      const [hours, minutes] = this.newTimeEvent.split(':');
      this.selectedEvent.startTime = moment(this.selectedEvent.startTime)
          .set({hour: parseInt(hours), minute: parseInt(minutes)})
          .format('YYYY-MM-DD HH:mm');
      this.selectedEvent.endTime = moment(this.selectedEvent.startTime)
          .add(this.newSelectedDuration, 'hours')
          .format('YYYY-MM-DD HH:mm');
      if (this.selectedTeacher === null) {
        const selectedTeacherObj = this.listTeachers.find(teacher => teacher.id === this.userID);
        if (selectedTeacherObj) {
          this.titleNewEvent = `${selectedTeacherObj.surname || ''} ${selectedTeacherObj.name || ''} ${selectedTeacherObj.middleName || ''}`;
        }
      } else {
        const selectedTeacherObj = this.listTeachers.find(teacher => teacher.id === this.selectedTeacher);
        if (selectedTeacherObj) {
          this.titleNewEvent = `${selectedTeacherObj.surname || ''} ${selectedTeacherObj.name || ''} ${selectedTeacherObj.middleName || ''}`;
        }
      }
      this.selectedEvent.title = this.titleNewEvent
    },
  }
}

</script>
<style  lang="scss">
.open-practice-dialog {
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
  }
}
.duration-text {
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color:black !important;
}
</style>