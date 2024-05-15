<template>
  <v-dialog v-model="localVisible" width="auto">
    <v-card class="add-instructor-card">
      <v-card-title class="pa-3 pb-0 ">
        <span class="add-instructor-card__type_edit">{{ formTitle }}</span>
        <span class="add-instructor-card__title">Общая информация</span>
      </v-card-title>
      <v-card-text class="pa-3 pt-0">
        <v-container class="">
          <v-row class="pa-0">
            <v-col class="flex-column pa-0 flex-wrap">
              <v-text-field v-model="data.editedTeacher.name" label="Имя" :rules="[nameRule.required]" outlined
                            height="32px" dense hide-details
                            class="v-text-field-custom-admin"/>
              <v-text-field v-model="data.editedTeacher.surname" label="Фамилия" :rules="[surnameRule.required]"
                            height="32px" dense hide-details
                            outlined class="v-text-field-custom-admin"/>
              <v-text-field v-model="data.editedTeacher.middleName" label="Отчество" height="32px" dense hide-details
                            :rules="[middleNameRule.required]" outlined
                            class="v-text-field-custom-admin"/>
              <v-text-field v-model="data.editedTeacher.email" label="email" :rules="[emailRule.required]"
                            height="32px" dense hide-details
                            class="v-text-field-custom-admin" outlined/>
              <vue-text-mask class="phone-field" v-model="data.editedTeacher.phoneNumber" :mask="mask"
                             :rules="[phoneRule.required]"/>
              <div class="card-edit-student__title" style="margin-top: 16px !important;">
                Параметры обучения
              </div>
              <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                        v-model="data.editedTeacher.transmissionTypeEnum"
                        :items="availableGearboxType"
                        item-value="id"
                        multiple
                        label="Коробка передач"
                        no-data-text="Нет данных для отображения"
                        height="32px"
                        hide-details
                        dense/>
              <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                        v-model="data.editedTeacher.city"
                        :items="availableCity"
                        item-value="id"
                        multiple
                        label="Город"
                        no-data-text="Нет данных для отображения"
                        height="32px"
                        hide-details
                        dense/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="px-3 ">
        <v-container class="pa-0" style="display: flex; justify-content: space-between; margin-bottom: auto">
          <v-btn text @click="close" style="text-transform: none !important; padding: 0 !important;">
            <span style="color: black">Отмена</span>
          </v-btn>
          <v-btn class="close-button" @click="save" :disabled="isSaveButtonDisabled && blockButtonWhenRequest">
            <span style="color: white">{{ formAction }}</span>
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import VueTextMask from "vue-text-mask";
import UsersRequest from "@/services/UsersRequest";

export default {
  name: "openNewTeacherDialog",
  components: {VueTextMask},

  data: () => ({
    localVisible: true,
    blockButtonWhenRequest: false,
    availableCity: [{id: 1, text: 'Северодвинск'}, {id:2, text: 'Новодвинск'}],
    availableGearboxType: [{id: 1, text: 'АКП'},
      {id: 2, text: 'МКП'}],
    mask: ['+', /\d/, '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    nameRule: {required: value => !!value},
    surnameRule: {required: value => !!value},
    middleNameRule: {required: value => !!value},
    emailRule: {required: value => !!value},
    phoneRule: {required: value => !!value},
  }),
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formAction() {
      return this.data.editedIndex === -1 ? 'Создать' : 'Изменить';
    },

    formTitle() {
      return this.editedIndex === -1 ? 'НОВЫЙ ИНСТРУКТОР' : 'РЕДАКТИРОВАТЬ ИНСТРУКТОРА';
    },

    isSaveButtonDisabled() {
      return !(this.nameRule.required(this.data.editedTeacher.name)
          && this.surnameRule.required(this.data.editedTeacher.surname)
          && this.middleNameRule.required(this.data.editedTeacher.middleName)
          && this.emailRule.required(this.data.editedTeacher.email)
          && this.phoneRule.required(this.data.editedTeacher.phoneNumber))
    }
  },

  methods: {
    async postActiveUser(body) {
      const user = new UsersRequest();
      await user.postActiveUser(body).catch(x => console.log(x))
    },

    async putActiveUser(body) {
      const user = new UsersRequest();
      await user.putActiveUser(body).catch(x => console.log(x))
    },

    async save() {
      this.blockButtonWhenRequest = true
      if (this.data.editedIndex > -1) {
        this.data.editedTeacher.email.replace(/\s/g, '')
        const body = this.data.editedTeacher
        await this.putActiveUser(body).finally(async () => {
          this.close();
        })
      } else {
        const body = {
          "email": this.data.editedTeacher.email.replace(/\s/g, ''),
          "phoneNumber": this.data.editedTeacher.phoneNumber,
          "name": this.data.editedTeacher.name,
          "surname": this.data.editedTeacher.surname,
          "middleName": this.data.editedTeacher.middleName,
          "transmissionTypeEnum": this.data.editedTeacher.transmissionTypeEnum,
          "city": this.data.editedTeacher.city,
        }

        await this.postActiveUser(body).finally(async () => {
          this.close();
        })
      }
    },

    close() {
      this.$emit('destroy', false)
    },
  },
  created() {
  }
}

</script>