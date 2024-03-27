<template>
  <div style="width: 100%">
    <div class="big-title">
      Группы и планы обучения
    </div>
    <hr>
    <div class="mb-3">
      <v-btn
          color="#4E7AEC"
          class="add-instructor-btn"
          @click="transitionNewCourse"
      >
        <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
          <v-icon color="white">mdi-plus-circle-outline</v-icon>
          <span class="add-instructor-text">Добавить группу</span>
        </section>
      </v-btn>
    </div>
    <v-data-table 
        :headers="headersGroup" 
        :search="search" 
        :items="groups"
        class="custom-header-table"
        style="border-bottom: thin solid rgba(0, 0, 0, 0.12); border-radius: unset !important;"
        v-if="!discriminatorUser" 
        no-data-text="Нет данных для отображения"
        :hide-default-footer="true" 
        disable-pagination
        :header-props="{ class: 'blue--text text--darken-2 header-grid-text' }"
        mobile-breakpoint="0"
    >
     <template v-slot:top>
       <v-toolbar flat>
         <v-dialog v-model="groupDelete" max-width="500px">
           <v-card>
             <v-card-title class="text-h5">Удалить группу?</v-card-title>
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
               <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
               <v-spacer></v-spacer>
             </v-card-actions>
           </v-card>
         </v-dialog>
       </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.groupNumber }}</td>
          <td>{{ item.title }}</td>
          <td>{{ formatDatetime(item.courseStartDate) }} - {{ formatDatetime(item.courseEndDate) }}</td>
          <td>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
        <span v-if="item.students" v-for="(student, index) in item.students"
              :key="index">
          {{ student.name }} {{ student.surname }} {{ student.middleName }}, &nbsp;
          <br>
        </span>
            </div>
          </td>
          <td class="text-xs-right grid-actions">
            <v-icon class="mr-2 blue--text" @click="editGroupItem(item)">mdi-pencil</v-icon>
            <v-icon class="red--text" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div v-else>
      <p>Вы не авторизованы для просмотра этой страницы</p>
    </div>
  </div>
</template>
<script>
import GroupsRequest from "@/services/GroupsRequest";
import {mapState} from "vuex";
import Item from "@/views/AdminPanels/GroupTemplate.vue";
import CoursesList from "@/views/AdminPanels/CoursesList.vue";

export default {
  components: {CoursesList, Item},
  data: () => ({
    groupDelete: false,
    headersGroup: [
      {text: '№', align: 'start', sortable: false, width: '5%'},
      {text: 'Название', align: 'start', sortable: false, width: '20%'},
      {text: 'Даты обучения', align: 'start', sortable: false, width: '20%'},
      {text: 'Ученики', align: 'start', sortable: false, width: '50%'},
      {text: 'Действия', align: 'end', value: 'actions', sortable: false,width: '5%'},
    ],
    groups: [],
    deletedIndex: -1,
    titleRules: {
      required: value => !!value
    },
    startDateRules: {
      required: value => !!value
    },
    startTimeRules: {
      required: value => !!value
    },
  }),

  computed: {
    ...mapState(['user']),

    discriminatorUser() {
      return this.user.discriminator !== 'Учитель'
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async getGroups() {
      const groups = new GroupsRequest();
      let groupData
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        groupData = x.data
      })
      return groupData
    },

    async deleteGroups() {
      const groups = new GroupsRequest();
      const deletedItem = {"id": this.deletedIndex}
      await groups.deleteGroup(deletedItem.id).catch(x => console.log(x))
    },

    async initialize() {
      this.groups = await this.getGroups();
    },

    deleteItem(item) {
      this.editedIndex = this.groups.indexOf(item);
      this.deletedIndex = item.groupId
      this.groupDelete = true;
    },

    editGroupItem(item) {
      const selectedGroupID = item.groupId;
      this.$router.push({name: 'groupItem', params: {selectedGroupID}}).catch(() => {
      });
    },

    transitionNewCourse() {
      const selectedGroupID = '-1';
      this.$router.push({name: 'groupItem', params: {selectedGroupID}}).catch(() => {
      });
    },

    async deleteItemConfirm() {
      await this.deleteGroups().finally(async () => {
            this.groups = await this.getGroups();
            this.closeDelete();
          }
      )
    },

    closeDelete() {
      this.groupDelete = false;
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },

};
</script>
<style>
@import "@/assets/styles/dataTableStyles.css";
.theme--light.v-chip:not(.v-chip--active) {
  background: rgba(255, 255, 255, 0.7);
}


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

.v-text-field {
  padding: 0 !important;
  margin: 0 !important;
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

.v-btn {
  letter-spacing: unset !important;
}

.big-title {
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 46px !important;
}
</style>