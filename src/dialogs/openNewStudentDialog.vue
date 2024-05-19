<template>
  <v-dialog v-model="localVisible" width="auto" persistent>
    <v-card class="card-edit-student">
      <v-card-title class="pa-3 pb-0 ">
        <span class="card-edit-student__type_edit">{{ formTitle }}</span>
        <span class="card-edit-student__title">Общая информация</span>
      </v-card-title>
      <v-card-text class="pa-3 pt-0">
        <v-container class="">
          <v-row class="pa-0">
            <v-col class="flex-column pa-0 flex-wrap">
              <v-text-field v-model="data.editedStudent.name" label="Имя" height="32px" dense hide-details
                            :rules="[nameRule.required]" outlined
                            class="v-text-field-custom-admin"/>
              <v-text-field v-model="data.editedStudent.surname" outlined label="Фамилия" height="32px" dense
                            hide-details
                            :rules="[surnameRule.required]" class="v-text-field-custom-admin "/>
              <v-text-field v-model="data.editedStudent.middleName" outlined label="Отчество" height="32px" dense
                            hide-details
                            :rules="[middleNameRule.required]"
                            class="v-text-field-custom-admin "/>
              <v-text-field v-model="data.editedStudent.email" outlined label="email" height="32px" dense
                            hide-details
                            :rules="[emailRule.required]" class="v-text-field-custom-admin " :disabled="data.editedIndex >-1"/>
              <vue-text-mask class="phone-field" v-model="data.editedStudent.phoneNumber" :mask="mask"
                             :rules="[phoneRule.required]"/>
              <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                        v-model="data.editedStudent.groupId"
                        :items="data.groups"
                        :item-value="item => item.groupId"
                        :item-text="item => `${item.title}`"
                        label="Группа"
                        no-data-text="Нет данных для отображения"
                        height="32px"
                        hide-details
                        dense/>
              <v-checkbox v-model="data.editedStudent.isDeleted" label="Заблокировать студента" hide-details/>
              <div class="card-edit-student__title" style="margin-top: 16px !important;">Параметры обучения</div>
              <v-radio-group class="px-0 py-0 align-center ma-0 mt-3" v-model="data.editedStudent.transmissionTypeEnum"
                             hide-details>
                <v-radio label="АКП" :value="[2]"/>
                <v-radio label="МКП" :value="[1]"/>
              </v-radio-group>
              <v-select outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                        v-model="data.editedStudent.city"
                        :items="availableCity"
                        item-value="id"
                        multiple
                        label="Город"
                        no-data-text="Нет данных для отображения"
                        height="32px"
                        hide-details
                        dense/>
              <div class="card-edit-student__title" style="margin-top: 16px !important;">Часы</div>
              <v-checkbox v-model="data.editedStudent.isForbiddenToAssign" label="Не может записываться на практики" hide-details/>
              <v-text-field outlined class="v-text-field-custom-admin " style="border-radius: 12px"
                            v-model="data.editedStudent.generalHours"
                            label="Оплаченные практики"
                            height="32px"
                            :hint="`Из них дополнительных: ${data.editedStudent.generalHours - 56}`"
                            persistent-hint
                            dense/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="px-3">
        <v-container class="pa-0" style="display: flex; justify-content: space-between; margin-bottom: auto">
          <v-btn text @click="close" style="text-transform: none !important; padding: 0 !important;">
            <span style="color: black">Отмена</span>
          </v-btn>
          <v-btn class="close-button" @click="save" :disabled="isSaveButtonDisabled && blockButtonWhenRequest ">
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
  name: "openNewStudentDialog",
  components: {VueTextMask},

  data: () => ({
    localVisible: true,
    blockButtonWhenRequest: false,
    availableCity: [{id: 1, text: 'Северодвинск'}, {id:2, text: 'Новодвинск'}],
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
      return this.data.editedIndex === -1 ? 'НОВЫЙ СТУДЕНТ' : 'РЕДАКТИРОВАТЬ СТУДЕНТА';
    },

    isSaveButtonDisabled() {
      return !(this.nameRule.required(this.data.editedStudent.name)
          && this.surnameRule.required(this.data.editedStudent.surname)
          && this.middleNameRule.required(this.data.editedStudent.middleName)
          && this.emailRule.required(this.data.editedStudent.email)
          && this.phoneRule.required(this.data.editedStudent.phoneNumber))
    }
  },

  methods: {
    async save() {
      this.blockButtonWhenRequest = true

      if (this.data.editedIndex > -1) {
        console.log(this.data.editedStudent.email)
        this.data.editedStudent.email = this.data.editedStudent.email.replace(/ /g, '')
        const body = this.data.editedStudent
        await this.putUser(body).catch(() => {
        }).finally(() => {
          this.close();
        })
      } else {
        console.log('email with space', this.data.editedStudent.email)
        console.log('email another space', this.data.editedStudent.email.replace(/ /g, ''))
        const body = {
          "email": this.data.editedStudent.email.replace(/ /g, ''),
          "phoneNumber": this.data.editedStudent.phoneNumber,
          "name": this.data.editedStudent.name,
          "surname": this.data.editedStudent.surname,
          "middleName": this.data.editedStudent.middleName,
          "groupId": this.data.editedStudent.groupId,
          "generalHours": parseInt(this.data.editedStudent.generalHours ),
          "transmissionTypeEnum": this.data.editedStudent.transmissionTypeEnum,
          "city": this.data.editedStudent.city,
          "IsForbiddenToAssign": this.data.editedStudent.isForbiddenToAssign,
          "isDeleted" : this.data.editedStudent.isDeleted
        }
        console.log(body)
        await this.postUser(body).catch(() => {
        }).finally(() => {
          this.close();
        })
      }
      this.close();
    },

    async postUser(body) {
      const user = new UsersRequest();
      await user.postUser(body).catch(x => console.log(x))
    },

    async putUser(body) {
      const user = new UsersRequest();
      await user.putUser(body).catch(x => console.log(x))
    },

    close() {
      this.$emit('destroy', false)
    },
  },

  created() {
    console.log(this.data.editedStudent)
  }
}
</script>