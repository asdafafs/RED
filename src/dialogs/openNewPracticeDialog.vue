<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
      style="border-radius: 12px; border: 1px solid grey"
      flat
    >
      <v-card-title class="pa-3 d-flex flex-column justify-start">
        <span class="open-practice-dialog_first-title">Изменение записи</span>
        <span class="open-practice-dialog_second-title">Вождение</span>
      </v-card-title>
      <v-card-text class="pa-3 pt-0 pb-0">
      
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
  name: "OpenNewPracticeDialog",
  data: ()=>({
    localVisible: true
  }),
  computed: {
    saveButtonTitle() {
      if (this.openEditMode) return 'Сохранить'
    }
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

</style>