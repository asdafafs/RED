<template>
  <div style="width: 100%">
    <div class="desk-title">
      Студенты и планы
    </div>
    <hr>
    <div class="d-flex flex-row justify-space-between align-center mb-3">
      <v-btn
          color="#4E7AEC"
          class="add-instructor-btn"
          @click="openNewStudent"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <Icon color="white" icon="mdi-plus-circle-outline" height="24"/>
          <span class="add-instructor-text">Добавить студента</span>
        </section>
      </v-btn>
      <v-text-field
          v-model="search"
          outlined
          dense
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          class="search-field"
          style=" max-width: 256px !important;  border-radius: 12px !important; max-height: 32px !important;"
      />
    </div>
    <v-data-table
        :headers="headers"
        :items="persons"
        :search="search"
        class="custom-header-table"
        style="border-bottom: thin solid rgba(0, 0, 0, 0.12); border-radius: unset !important;"
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true"
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2 header-grid-text' }"
        mobile-breakpoint="0"
    >
      <template v-slot:item="{ item }">
        <tr style="height: 64px !important;">
          <td style="display: flex; align-items: center; height: inherit">
            <div style="flex: 1;">
              <span>{{ item.fullName }}</span>
            </div>
            <div v-if="item.additinalHoursSpent > 0"
                 style="background-color: #E31E24; border-radius: 4px; width: 36px; height: 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-weight: 600; font-size: 12px; line-height: 14px; text-align: center;"
                    class="white--text">
                Долг
              </span>
            </div>
          </td>
          <td>{{ item.email }}</td>
          <td>{{ formatTransmissions(item.transmissionTypeEnum) }}</td>
          <td>{{ formatCity(item.city) }}</td>
          <td>{{ item.generalHours }}</td>
          <td>{{ item.generalHoursSpent }}</td>
          <td>{{ item.additinalHoursSpent }}</td>
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import VueTextMask from "vue-text-mask";
import GroupsRequest from "@/services/GroupsRequest";
import {formatTransmissions, formatCity} from '@/utils/utils';
import { Icon} from '@iconify/vue2'
export default {
  components: {VueTextMask,Icon},
  data: () => ({
    search: '',
    headers: [
      {text: 'ФИО', align: 'start', sortable: false, value: 'fullName', width: '25%'},
      {text: 'E-mail', align: 'start', sortable: false, value: 'email', width: '10%'},
      {text: 'Коробка передач', align: 'start', sortable: false, value: 'transmissionTypeEnum', width: '25%'},
      {text: 'Город', align: 'start', sortable: false, value: 'city', width: '10%'},
      {text: 'Оплаченные всего', align: 'start', sortable: false, value: 'generalHours', width: '8%'},
      {text: 'Оплаченные остаток', sortable: false, value: 'generalHoursSpent', width: '8%'},
      {text: 'Неоплаченные всего', sortable: false, value: 'additinalHours', width: '8%'},
      {text: 'Действия', align: 'end', value: 'actions', sortable: false, width: '6%'},
    ],
    groups: [],
    persons: [],
    editedIndex: -1,
    editedStudent: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      groupId: null,
      phoneNumber: '7',
      generalHours: 0,
      generalHoursSpent: 56,
      additinalHours: 0,
      additinalHoursSpent: 0,
      transmissionTypeEnum: [],
      city: [],
      isBlocked: false,
      isForbiddenToAssign: false,
    },
  }),
  created() {
    this.initialize();
  },

  methods: {
    formatCity,
    formatTransmissions,

    async openNewStudent() {
      this.editedIndex = -1
      this.editedStudent = {
        name: '',
        surname: '',
        middleName: '',
        email: '',
        groupId: null,
        phoneNumber: '7',
        generalHours: 0,
        transmissionTypeEnum: [],
        city: [],
        isDeleted: false,
        isForbiddenToAssign: false,
      }
      const data = {
        groups: this.groups,
        editedStudent: this.editedStudent,
        editedIndex: this.editedIndex,
      }
      await this.$openNewStudentDialogPlugin(data).then((result) => {
        if (!result) {
          this.initialize();
        }
      });
    },

    async getGroups() {
      const groups = new GroupsRequest();
      let groupsData
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        groupsData = x.data
      })
      return groupsData
    },

    async getStudents() {
      const user = new UsersRequest();
      let studentsData = [];
      let visibleBlockedStudent = 'ShowDeleted=false';
      await user.getUsers(visibleBlockedStudent)
          .then(response => {
            const students = response.data.students.map(student => ({
              ...student,
              fullName: `${student.surname} ${student.name} ${student.middleName}`,
            }));
            studentsData = studentsData.concat(students);
          })
          .catch(error => {
            console.error(error);
          });
      visibleBlockedStudent = 'ShowDeleted=true';
      await user.getUsers(visibleBlockedStudent)
          .then(response => {
            const students = response.data.students.map(student => ({
              ...student,
              fullName: `${student.surname} ${student.name} ${student.middleName}`,
            }));
            studentsData = studentsData.concat(students);
          })
          .catch(error => {
            console.error(error);
          });
      return studentsData;
    },

    async initialize() {
      this.persons = await this.getStudents()
      this.groups = await this.getGroups()
    },

    async editItem(item) {
      this.editedIndex = this.persons.indexOf(item);
      this.editedStudent = {
        id: item.id,
        email: item.email,
        phoneNumber: item.phoneNumber,
        name: item.name,
        surname: item.surname,
        middleName: item.middleName,
        groupId: item.groupId,
        generalHours: parseInt(item.generalHours),
        transmissionTypeEnum: item.transmissionTypeEnum,
        city: item.city,
        isDeleted: item.isDeleted,
        isForbiddenToAssign: item.isForbiddenToAssign,
      };
      const data = {
        groups: this.groups,
        editedStudent: this.editedStudent,
        editedIndex: this.editedIndex,
      }
      await this.$openNewStudentDialogPlugin(data).then((result) => {
        if (!result) {
          this.initialize();
        }
      });
    },

  },
};
</script>
<style lang="scss">
@import "@/assets/styles/phoneMaskStyles.css";
@import "@/assets/styles/dataTableStyles.css";
@import "@/assets/styles/titleStyles.css";

.grid-button {
  width: 155px !important;
  height: 28px !important;
  border-radius: 12px !important;
  text-transform: none !important;
}

.header-grid-text {
  font-weight: 600 !important;
  font-size: 16px !important;
}

.grid-actions {
  text-align: end !important;
  padding-right: 30px !important;
}

.v-text-field--outlined .v-label {
  top: 7px !important;
}

.search-field {
  .v-input__slot {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    height: 32px !important;
  }
}

.v-text-field-custom-admin.v-text-field--outlined .v-input__control .v-input__slot {
  width: inherit !important;
  min-height: 32px !important;
  margin-top: 24px !important;
}

.v-text-field-custom-admin.v-text-field--outlined .v-input__control .v-input__slot .v-select {
  min-height: 32px !important;
}

.card-edit-student {
  width: 392px !important;
  height: 847px !important;
  border-radius: 12px !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  background: #FFFFFF !important;
  border: 1px solid #AAA7A6 !important;

  &__type_edit {
    width: 100% !important;
    height: 12px !important;
    margin-bottom: 12px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 12px !important;
    line-height: 14px !important;
    color: #AAA7A6 !important;
    flex: none !important;
    order: 0 !important;
    flex-grow: 0 !important;
  }

  &__title {
    width: 100% !important;
    height: 28px !important;

    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 24px !important;
    line-height: 28px !important;
    color: #000000 !important;
    flex: none !important;
    order: 0 !important;
    flex-grow: 0 !important;
  }

  &__card_text {
    gap: 12px !important;
  }
}

.close-button {
  border-radius: 12px !important;
  background-color: #4E7AEC !important;
  height: 32px !important;
  width: 89px !important;
  text-transform: none !important;
  margin-bottom: 12px !important;

  &__text {
    text-transform: none !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 18.75px !important;
  }
}

.v-text-field--outlined, {
  border-radius: 12px !important;
}

.big-title {
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 46px !important;
}
</style>