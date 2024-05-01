<template>
  <div style="width: 100%">
    <div class="desk-title">
      Инструкторы и планы
    </div>
    <hr>
    <div class="d-flex flex-row justify-space-between align-center mb-3">
      <v-btn
          color="#4E7AEC"
          class="add-instructor-card-btn"
          @click="openNewTeacher"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <v-icon color="white">mdi-plus-circle-outline</v-icon>
          <span class="add-instructor-text">Добавить инструктора</span>
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
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Вы действительно хотите удалить инструктора?</v-card-title>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm" :disabled="blockButtonWhenRequest">OK
                </v-btn>
                <v-spacer/>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
          <td>{{formatTransmissions(item.transmissionTypeEnum)}}</td>
          <td>{{ formatCity(item.city) }}</td>
          <td>
            <v-btn
                class="grid-button"
                color="#4E7AEC"
                @click="openPlanTemplate(item)"
            >
              <span class="white--text">Определить план</span>
            </v-btn>
          </td>
          <td>
            <v-checkbox v-model="item.isAdmin" @click="acceptNewRole(item)"/>
          </td>
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <router-view/>
  </div>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import VueTextMask from "vue-text-mask";

export default {
  components: {VueTextMask},
  data: () => ({
    search: '',
    dialogDelete: false,
    blockButtonWhenRequest: false,
    headers: [
      {text: 'ФИО', align: 'start', sortable: false, value: 'fullName', width: '30%'},
      {text: 'E-mail', align: 'start', sortable: false, value: 'email', width: '15%'},
      {text: 'Коробка передач', align: 'start', sortable: false, value: 'transmissionTypeEnum', width: '10%'},
      {text: 'Город', align: 'start', sortable: false, value: 'city', width: '10%'},
      {text: 'Практики', align: 'start', sortable: false, width: '15%'},
      {text: 'Права оператора', align: 'start', sortable: false, value: 'rulesAdmin', width: '10%'},
      {text: 'Действия', align: 'end', value: 'actions', sortable: false, width: '10%'},
    ],
    persons: [],
    editedIndex: -1,
    deletedIndex: -1,
    editedTeacher: {
      name: '',
      surname: '',
      middleName: '',
      email: '',
      phoneNumber: '7',
      isAdmin: false,
      city: [],
      transmissionTypeEnum: [],
    },
  }),

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async putActiveUser(body) {
      const user = new UsersRequest();
      await user.putActiveUser(body).catch(x => console.log(x))
    },

    async acceptNewRole(item){
      await this.putActiveUser(item).finally(async () => {
        this.close();
      })
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

    async openNewTeacher() {
      this.editedIndex = -1
      this.editedTeacher = {
        name: '',
        surname: '',
        middleName: '',
        email: '',
        phoneNumber: '7',
        transmissionTypeEnum: [],
        isAdmin: false,
        city: [],
      }
      const data = {
        editedIndex: this.editedIndex,
        editedTeacher: this.editedTeacher,
      }
      await this.$openNewTeacherDialogPlugin(data).then((result) => {
        if (!result) {
          this.initialize();
        }
      });
    },

    openPlanTemplate(item) {
      const selectedUserID = item.id;
      this.$router.push({name: 'plan-template', params: {selectedUserID}}).catch(() => {
      });
    },

    async getActiveUsers() {
      const user = new UsersRequest();
      let teachersData;
      await user.getAllActiveUsers()
          .then(response => {
            teachersData = response.data.activeUsers.map(user => ({
              ...user,
              fullName: `${user.surname} ${user.name} ${user.middleName}`
            }));
          })
          .catch(error => {
            console.error(error);
          });
      return teachersData;
    },

    async deleteUser() {
      const user = new UsersRequest();
      const deletedItem = {"id": this.deletedIndex}
      await user.deleteActiveUser(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      this.persons = await this.getActiveUsers()
    },

    async editItem(item) {
      this.editedIndex = this.persons.indexOf(item);
      this.editedTeacher = {
        id: item.id,
        email: item.email,
        phoneNumber: item.phoneNumber,
        name: item.name,
        surname: item.surname,
        middleName: item.middleName,
        transmissionTypeEnum: item.transmissionTypeEnum,
        isAdmin: item.isAdmin,
        city: item.city,
      };
      const data = {
        editedIndex: this.editedIndex,
        editedTeacher: this.editedTeacher,
      }
      await this.$openNewTeacherDialogPlugin(data).then((result) => {
        if (!result) {
          this.initialize();
        }
      });
    },

    deleteItem(item) {
      this.editedIndex = this.persons.indexOf(item);
      this.editedTeacher = {name: item.name};
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.blockButtonWhenRequest = true
      await this.deleteUser().finally(() => {
        this.initialize()
        this.closeDelete();
      })
    },

    close() {
      this.blockButtonWhenRequest = false;
      this.$nextTick(() => {
        this.editedTeacher = {
          name: '',
          surname: '',
          middleName: '',
          email: '',
          phoneNumber: '7'
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.blockButtonWhenRequest = false
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedTeacher = {
          name: '',
          surname: '',
          middleName: '',
          email: '',
          phoneNumber: '7',
          gearboxType: 1,
          isAdmin: false,
        };
        this.editedIndex = -1;
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

.add-instructor-card {
  width: 392px !important;
  height: 561px !important;
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

  &-btn {
    border-radius: 12px !important;
    height: 32px !important;
    width: 225px !important;
    text-transform: none !important;
  }
}

.add-instructor {
  &-btn {
    border-radius: 12px !important;
    height: 32px !important;
    width: 225px !important;
    text-transform: none !important;
  }

  &-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: white !important;
    margin-left: 8px !important;
    line-height: 18.75px !important;
  }
}
</style>