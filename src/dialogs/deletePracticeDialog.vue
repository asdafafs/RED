<template>
  <v-dialog max-width="407px" v-model="localVisible" persistent>
    <v-card
        class="delete-practice-dialog"
        flat
    >
      <v-card-title class="pa-5 d-flex flex-column justify-start">
        <span class="delete-practice-dialog_first-title">ПОДТВЕРЖДЕНИЕ ДЕЙСТВИЯ</span>
        <span class="delete-practice-dialog_second-title">Вы удаляете практику</span>
      </v-card-title>
      <v-card-text class="pa-5 pt-0 pb-0">
        <div class="delete-practice-dialog_text">
          <div class="open-practice-dialog_text">
            <div class="d-flex flex-column">
              <span class="teacher-text">Вы действительно хотите удалить данную практику?
                <br>
                <br>
Данная практика будет полностью удалена из расписания. Часы данной практики не будут отражены в статистике для инструктора и студента.</span>
            </div>
          </div>
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
  methods: {
    onCancelClick() {
      this.$emit('destroy', true)
    },
    async onDeleteClick() {
      const event = new EventsRequest()
      await event.deleteAdminPractice(this.data.e.event.id)
          .then(() => this.$emit('destroy', false))
      
    },
  },
  created() {
    console.log(this.data)
  }
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
      border: 1px solid rgba(0, 0, 0, 0.53) !important;
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