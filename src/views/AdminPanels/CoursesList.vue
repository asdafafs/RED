<template>
  <v-data-table :headers="headers" :items="lessons" class="elevation-1 custom-header-table"
                no-data-text="Нет данных для отображения"
                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                :hide-default-footer="true"
                mobile-breakpoint="0"
                disable-pagination :header-props="{ class: 'blue--text text--darken-2' }"
                v-model="selectedRows"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="rounded-lg app-bar-button-color" color="#4E7AEC" v-bind="attrs" v-on="on">
              <v-col cols="1" class="px-0 tab-button-text">
                <i class="mdi mdi-plus-circle-outline" style="transform: scale(1.5)"></i>
              </v-col>
              <v-col cols="" class="tab-button-text">
                Добавить занятие
              </v-col>
            </v-btn>
          </template>
          <v-card class="rounded-xl">
            <v-card-title>
              <div class="text-h5">{{ formTitle }}</div>
            </v-card-title>
            <v-card-text class="pb-0">
              <v-container class="pa-0">
                <v-row class="pa-0">
                  <v-col cols="12" sm="12" md="12" class="pb-0">
                    <v-text-field v-model="editedItem.title" label="Название"
                                  :rules="[titleRules.required]" outlined class="rounded-xl"></v-text-field>
                    <v-text-field v-model="editedItem.startTime" label="Начало занятия" type="datetime-local"
                                  :rules="[startDateTimeRules.required]" :min="getTodayDate" outlined
                                  class="rounded-xl">
                    </v-text-field>
                    <v-text-field v-model="editedItem.endTime" label="Конец занятия" type="datetime-local"
                                  :rules="[endDateTimeRules.required]" :min="getTodayDate" outlined class="rounded-xl">
                    </v-text-field>
                    <v-select
                        ref="selectItem"
                        v-model="discriminator[editedItem.lectureType]"
                        label="Тип занятия"
                        :items="discriminator"
                        :rules="[typeEventRules.required]"
                        outlined
                        class="rounded-xl"
                        no-data-text="Нет данных для отображения"
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item @click="selectItem(item)">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                    <v-select
                        v-model="editedItem.activeUser"
                        label="Выберите преподавателя"
                        :items="[...teachers, { id: null, name: 'Преподаватель не назначен' }]"
                        :item-text="item => item ? `${item.name || ''} ${item.surname || ''} ${item.middleName || ''}` : 'Преподаватель не назначен'"
                        item-value="id"
                        outlined
                        class="rounded-xl"
                        no-data-text="Нет данных для отображения"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-container style="display: flex; justify-content: space-between;" class="py-0">
                <v-btn color="blue darken-1" text @click="closeEditItem">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="save" :disabled="hasChanges || isSaveButtonDisabled">
                  OK
                </v-btn>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="rounded-xl">
            <v-card-title class="text-h5">Удалить занятие?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete()">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item="{ item  }">
      <tr :class="selectedRows.indexOf(item.id)>-1?'selected-row':''">

        <td>{{ item.title }}</td>
        <td>{{ getTitleTeacher(item.activeUser) }}</td>
        <td>{{ discriminator[item.lectureType] }}</td>
        <td>
          {{
            formatDatetime(item.startTime)
          }}
        </td>
        <td>
          {{
            formatDatetime(item.endTime)
          }}
        </td>
        <td class="text-xs-right">
          <v-icon small class="mr-2" @click="editItem(item);">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import moment from "moment";

export default {
  props: {
    coursesData: {
      type: Array,
      default: () => [],
    },

    lectors: {
      type: Array,
      default: () => []
    },

    initialData: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    sortBy: 'startTime',
    sortDesc: false,
    discriminator: [null, "Основы вождения", "Основы ПДД", "Медицина", "Другое"],
    dialog: false,
    dialogDelete: false,
    selectedRows: [],
    headers: [
      {text: 'Название', align: 'start', sortable: false, value: 'title'},
      {text: 'Преподаватель', align: 'start', sortable: false, value: ''},
      {text: 'Тип занятия', align: 'start', sortable: false, value: ''},
      {text: 'Начало', align: 'start', sortable: false, value: 'startTime',},
      {text: 'Конец', align: 'start', sortable: false, value: 'endTime',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    teachers: [],
    courses: [],
    editedIndex: -1,
    deletedIndex: -1,
    initialCourses: [],
    initialItem: {
      id: null,
      title: null,
      startTime: null,
      endTime: null,
      lectureType: null,
      activeUser: null,
    },
    editedItem: {
      id: null,
      title: null,
      startTime: null,
      endTime: null,
      lectureType: null,
      activeUser: null,
    },

    titleRules: {
      required: value => !!value
    },
    startDateTimeRules: {
      required: value => !!value
    },
    endDateTimeRules: {
      required: value => !!value
    },
    typeEventRules: {
      required: value => !!value
    },
  }),

  watch: {
    coursesData: {
      handler() {
        this.initialize();
      },
      deep: true
    }
  },

  computed: {
    hasChanges() {
      const editedItem = this.editedItem
      const initialItem = this.initialItem
      const keys1 = Object.keys(this.editedItem);
      const keys2 = Object.keys(this.initialItem);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let key of keys1) {
        if (editedItem[key] !== initialItem[key]) {
          return false;
        }
      }
      return true;
    },

    isSaveButtonDisabled() {
      return !(this.titleRules.required(this.editedItem.title)
          && this.startDateTimeRules.required(this.editedItem.startTime)
          && this.endDateTimeRules.required(this.editedItem.endTime)
          && this.typeEventRules.required(this.editedItem.endTime))
    },

    lessons() {
      return this.coursesData;
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Новое занятие' : 'Редактировать занятие';
    },

    isEditedItemEqualInitialItem() {
      if (!this.editedItem || !this.initialCourses.length) {
        return false;
      }
      const editedItem = this.courses.find(course => course.id === this.editedItem.id);
      const initialItem = this.initialCourses.find(course => course.id === this.editedItem.id);
      if (initialItem && editedItem) {
        const sortedEditedItem = this.sortObjectKeys(editedItem);
        const sortedInitialItem = this.sortObjectKeys(initialItem);
        return JSON.stringify(sortedEditedItem) === JSON.stringify(sortedInitialItem);
      }
      return false;
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    sortObjectKeys(obj) {
      const sortedObj = {};
      Object.keys(obj).sort().forEach(key => {
        sortedObj[key] = obj[key];
      });
      return sortedObj;
    },

    toggleSelection() {
      if (this.isEditedItemEqualInitialItem) {
        const index = this.selectedRows.indexOf(this.editedItem.id);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
        }
      } else {

        if (!this.selectedRows.includes(this.editedItem.id)) {
          this.selectedRows.push(this.editedItem.id);
        }
      }
    },

    getTitleTeacher(activeUser) {
      if (activeUser) {
        const teacher = this.teachers.find(teacher => teacher.id === activeUser);
        return teacher ? `${teacher.surname} ${teacher.name.substring(0, 1)}.  ${teacher.middleName.substring(0, 1)}.` : '';
      }
    },

    initialize() {
      this.teachers = this.lectors
      this.courses = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: item.startTime,
          endTime: item.endTime,
          lectureType: item.lectureType,
          activeUser: item.activeUser,
        };
      });
      this.initialCourses = this.initialData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: item.startTime,
          endTime: item.endTime,
          lectureType: item.lectureType,
          activeUser: item.activeUser,
        };
      });
    },

    editItem(item) {
      this.editedIndex = this.courses.findIndex(course => course.id === item.id);
      this.editedItem = {
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        activeUser: item.activeUser,
        lectureType: parseInt(item.lectureType),
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.courses.findIndex(course => course.id === item.id);
      this.deletedIndex = this.editedIndex
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.courses.splice(this.editedIndex, 1);
      this.$emit('courses-updated', this.courses);
      this.closeDelete();
    },

    closeEditItem() {
      this.close();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {
          id: null,
          title: '',
          startTime: null,
          endTime: null,
          lectureType: null,
          activeUser: null,
        };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = this.editedItem = {
          id: null,
          title: '',
          startTime: null,
          endTime: null,
          lectureType: null,
          activeUser: null,
        };
        this.editedIndex = -1;
      });
    },

    save() {
      this.editedItem.startTime = moment(this.editedItem.startTime).format('YYYY-MM-DDTHH:mm:ss')
      this.editedItem.endTime = moment(this.editedItem.endTime).format('YYYY-MM-DDTHH:mm:ss')
      if (this.editedIndex > -1) {
        this.$set(this.courses, this.editedIndex, this.editedItem);
      } else {
        this.courses.push(this.editedItem);
      }
      console.log(this.editedItem.startTime, this.editedItem.endTime)
      this.$emit('courses-updated', this.courses);
      this.toggleSelection();
      this.close();
    },

    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      let hours = today.getHours();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      return `${year}-${month}-${day}T${hours}:00`;
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    },

    selectItem(item) {
      const index = this.discriminator.indexOf(item);

      if (index !== -1) {
        this.editedItem.lectureType = index;
        this.$refs.selectItem.blur();
      }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/eventTypesStyles.css";
@import "@/assets/styles/dataTableStyles.css";
</style>