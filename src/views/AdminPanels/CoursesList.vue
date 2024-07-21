<template>
  <div>
    <v-btn class="add-student-btn" @click="openAddDialog">
      <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
        <v-icon color="white">mdi-plus-circle-outline</v-icon>
        <span class="add-student-btn-text">Добавить занятие</span>
      </section>
    </v-btn>
    <ag-grid-vue
        :rowDragManaged="true"
        @row-drag-end="onRowDragEnd"
        ref="CoursesGrid"
        style="width: 100%; height: 500px; min-height: 200px"
        class="ag-theme-alpine courses-grid"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="courses"
    />
    <v-dialog v-model="dialog" width="auto" persistent>
      <v-card class="course-event-card">
        <v-card-title class="pa-3 pb-0 ">
          <span class="course-event-card__title">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text class="pa-3 pt-0">
          <v-container class="">
            <v-row class="pa-0">
              <v-col class="flex-column pa-0 flex-wrap">
                <v-text-field v-model="editedItem.title" label="Название" height="32px" dense hide-details
                              :rules="[titleRules.required]" outlined
                              class="v-text-field-custom-course"/>
                <v-text-field v-model="editedItem.startTime" label="Начало занятия" type="datetime-local"
                              :rules="[startDateTimeRules.required]" :min="getTodayDate" outlined height="32px"
                              dense hide-details
                              class="v-text-field-custom-course"/>
                <v-text-field v-model="editedItem.endTime" label="Конец занятия" type="datetime-local"
                              height="32px"
                              dense hide-details
                              :rules="[endDateTimeRules.required]" :min="getTodayDate" outlined
                              class="v-text-field-custom-course"/>
                <v-select height="32px" dense hide-details
                          ref="selectItem"
                          v-model="discriminator[editedItem.lectureType]"
                          label="Тип занятия"
                          :items="discriminator"
                          :rules="[typeEventRules.required]"
                          outlined
                          class="v-text-field-custom-course"
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
                    height="32px" dense hide-details
                    v-model="editedItem.activeUser"
                    label="Выберите преподавателя"
                    :items="[...teachers, { id: null, name: 'Преподаватель не назначен' }]"
                    :item-text="item => item ? `${item.surname || ''} ${item.name || ''} ${item.middleName || ''}` : 'Преподаватель не назначен'"
                    item-value="id"
                    outlined
                    class="v-text-field-custom-course"
                    no-data-text="Нет данных для отображения"/>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-container style="display: flex; justify-content: space-between;" class="pa-0 ">
            <v-btn text @click="closeEditItem" style="text-transform: none !important;">
              <span style="color: black">Отмена</span>
            </v-btn>
            <v-btn class="close-button" text @click="save" :disabled="hasChanges || isSaveButtonDisabled">
              <span style="color: white">Добавить</span>
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
  </div>
</template>
<script>
import moment from "moment";
import WarningIcon from "@/components/Icons/WarningIcon.vue";
import WarningInstructorIcon from "@/components/Icons/WarningInstructorIcon.vue";
import {AgGridVue} from "ag-grid-vue";
import ActionsCellRenderer from "@/components/CellRenderers/ActionsCellRenderer.vue";

export default {
  components: {AgGridVue, WarningInstructorIcon, WarningIcon,ActionsCellRenderer},
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
    freezedArray:[],
    sortBy: 'startTime',
    sortDesc: false,
    discriminator: [null, "Основы вождения", "Основы ПДД", "Медицина", "Другое"],
    selectedRows: [],
    dialog: false,
    dialogDelete: false,
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
    },
  },

  computed: {
    defaultColDef()  {
      return {
        flex: 1,
        minWidth: 100,
        suppressHeaderMenuButton: true,
        resizable: false
      }
    },
    lessonType() {
      return [
        {
          id: 0,
          value: null
        },
        {
          id: 1,
          value: 'Основы вождения'
        },
        {
          id: 2,
          value: 'Основы ПДД'
        },
        {
          id: 3,
          value: 'Медицина'
        },
        {
          id: 4,
          value: 'Другое'
        },
      ]
    },
    columnDefs() {
      return [
        {
          field: 'title',
          headerName: 'Название',
          rowDrag: true,
          valueFormatter: params => {
            if (params.data.lectureType !== null && params.data.lectureType !== 4) return `Урок ${params.data.lectureNumber} ${params.data.title}`
            return `${params.value}`
          }
        },
        {
          field: 'activeUserFullNameShort',
          headerName: 'Преподаватель'
        },
        {
          field: 'lectureType',
          valueFormatter: (params) => (this.lessonType.find(x => x.id === params.value))?.value,
          headerName: 'Тип занятия'
        },
        {
          field: 'startTime',
          valueFormatter: (params) => moment(params.value).format('DD.MM.YY HH:mm'),
          headerName: 'Начало'
        },
        {
          field: 'endTime',
          valueFormatter: (params) => moment(params.value).format('DD.MM.YY HH:mm'),
          headerName: 'Конец'
        },
        {
          headerName: 'Действия',
          cellRendererSelector: (params) => {
            return {
              component: 'ActionsCellRenderer',
              params: {
                data: params?.data,
                context: {componentParent: this},
              }
            }
          },
          maxWidth: 105,
          
        },
      ]
    },
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
      const editedItem = this.courses.find(course => course.id === this.editedItem.id);
      const initialItem = this.initialCourses.find(course => course.id === this.editedItem.id);
      if (initialItem && editedItem) {
        const sortedEditedItem = this.sortObjectKeys(editedItem);
        const sortedInitialItem = this.sortObjectKeys(initialItem);
        return JSON.stringify(sortedEditedItem) !== JSON.stringify(sortedInitialItem);
      }
      return false;
    },
  },
  created() {
    this.initialize();
    this.$parent.$on('reset-selected-rows', this.resetSelectedRows);
  },
  beforeDestroy() {
    this.$parent.$off('reset-selected-rows', this.resetSelectedRows);
  },
  methods: {
    openAddDialog() {
      return this.dialog = true
    },
    resetSelectedRows() {
      this.selectedRows = [];
    },

    sortObjectKeys(obj) {
      const sortedObj = {};
      Object.keys(obj).sort().forEach(key => {
        sortedObj[key] = obj[key];
      });
      return sortedObj;
    },

    toggleSelection() {
      if (this.isEditedItemEqualInitialItem) {
        if (!this.selectedRows.includes(this.editedItem.id)) {
          this.selectedRows = [this.editedItem.id]
        }
      } else {
        const index = this.selectedRows.indexOf(this.editedItem.id);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
        }
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
          activeUserFullNameShort: item.activeUserFullNameShort
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
          activeUserFullNameShort: item.activeUserFullNameShort
        };
      });
      this.freezedArray = this.coursesData
    },

    editItem(item) {
      this.editedIndex = this.courses.findIndex(course => course.id === item.id);
      this.editedItem = {
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        lectureType: parseInt(item.lectureType),
        activeUser: item.activeUser,
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.courses.findIndex(course => course.id === item.id);
      this.deletedIndex = this.editedIndex
      this.dialogDelete = true;
    },
    onRowDragEnd() {
      let lessonNumber = 0;
      this.$refs.CoursesGrid.api.forEachNode((node,index) => {
        let freezedStartDate = this.freezedArray[index].startTime
        let freezedEndDate = this.freezedArray[index].endTime
        if (node.data.lectureType !== null && node.data.lectureType !== 4) {
          lessonNumber++;
          node.setDataValue('lectureNumber', lessonNumber);
        }
        node.setDataValue('startTime', freezedStartDate);
        node.setDataValue('endTime', freezedEndDate);
      });
    },
   /* onRowDragEnd() {
      let index = 0;
      this.$refs.gridRef.gridApi.forEachNode(node => {
        if (node.data.consumableContractId) {
          index++;
          this.isRowsDragStart.push(`rowId-${node.id}`);
          node.setDataValue('priority', index);
        }
      });
    },*/
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
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
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

.course-event-card {
  width: 407px !important;
  height: 329px !important;
  border-radius: 12px !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  background: #FFFFFF !important;
  border: 1px solid #AAA7A6 !important;

  &__title {
    width: 100% !important;
    height: 32px !important;
    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 32px !important;
    line-height: 32px !important;
    color: #000000 !important;
    flex: none !important;
    order: 0 !important;
    flex-grow: 0 !important;
  }

  &__card_text {
    gap: 12px !important;
  }
}

.v-text-field-custom-course.v-text-field--outlined .v-input__control .v-input__slot {
  width: 367px !important;
  min-height: 32px !important;
}

.v-text-field-custom-course.v-text-field--outlined .v-input__control .v-input__slot .v-select {
  min-height: 32px !important;
}

.v-text-field-custom-course .v-text-field {
  padding: 0 !important;
  margin: 0 !important;
}

.v-text-field-custom-course {
  width: 367px !important;
  height: 32px !important;
  margin-top: 12px !important;
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

.add-student-btn {
  background-color: #4E7AEC !important;
  border-radius: 12px !important;
  height: 32px !important;
  width: 191px !important;
  text-transform: none !important;

  &-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: white !important;
    margin-left: 0px !important;
    line-height: 18.75px !important;
  }
}

.warning-lecture-icon {
  color: #FFCD6D !important;
  fill: #FFCD6D !important;
  height: 20px !important;
  width: 20px;
}

.custom-td {
  padding: 0;
  vertical-align: middle; /* Ensures the td content is vertically centered */
}

.content-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

.flex-1 {
  flex: 1;
}

.warning-container {
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: #FFCD6D 1px solid;
  gap: 8px;
  padding: 4px 8px;
  width: 239px;
  height: 36px;
}

.icon-container, .text-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-match {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  word-break: keep-all;
}
.courses-grid {
  .ag-header-cell {
    font-size: 16px;
    font-weight: 600;
    padding-left: 18px !important;
  }
}
</style>