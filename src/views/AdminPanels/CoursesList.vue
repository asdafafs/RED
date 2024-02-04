<template>
  <v-data-table :headers="headers" :items="lessons" class="elevation-1" no-data-text="Нет данных для отображения"
                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :footer-props="{
      'items-per-page-text': 'Записей на странице:',
      'items-per-page-all-text': 'Все',
      'page-text': '{0}-{1} из {2}',
      'prev-icon': 'mdi-chevron-left',
      'next-icon': 'mdi-chevron-right',
      'no-data-text': 'Нет данных для отображения'}"
                :hide-default-footer="true"
                disable-pagination
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Новое занятие
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle() }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.title" label="Название"
                                  :rules="[titleRules.required]"></v-text-field>
                    <v-text-field v-model="editedItem.startTime" label="Начало занятия" type="datetime-local"
                                  :rules="[startDateTimeRules.required]">
                    </v-text-field>
                    <v-text-field v-model="editedItem.endTime" label="Конец занятия" type="datetime-local"
                                  :rules="[endDateTimeRules.required]">
                    </v-text-field>
                    <v-select
                        v-model="discriminator[editedItem.lectureType]"
                        label="Тип занятия"
                        :items="discriminator"
                        :rules="[typeEventRules.required]"
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item :class="getListItemClass(item)" @click="selectItem(item)">
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
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Отмена
              </v-btn>
              <v-btn color="blue darken-1" text @click="save" :disabled="isSaveButtonDisabled">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Удалить занятие?</v-card-title>
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
    <template v-slot:item="{ item  }">
      <tr :class="getTableRowClass(item)">
        <td>{{ item.title }}</td>
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: {
    coursesData: {
      type: Array,
      default: () => [],
    },

    lectors: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    sortBy: 'startTime',
    sortDesc: false,
    discriminator: [null, "Основы вождения", "Основы ПДД", "Медицина", "Другое"],
    globalStartTime: null,
    globalEndTime: null,
    dialog: false,
    dialogDelete: false,
    headers: [
      {text: 'Название', align: 'start', sortable: false, value: 'title'},
      {text: 'Начало', align: 'start', sortable: false, value: 'startTime',},
      {text: 'Конец', align: 'start', sortable: false, value: 'endTime',},
      {text: 'Действия', value: 'actions', sortable: false},
    ],
    teachers: [],
    courses: [],
    editedIndex: -1,
    deletedIndex: -1,
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
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    coursesData: function (newCoursesData) {
      console.log('Courses data changed:', newCoursesData);
    }
  },

  computed: {
    isSaveButtonDisabled() {
      return !(this.titleRules.required(this.editedItem.title)
          && this.startDateTimeRules.required(this.editedItem.startTime)
          && this.endDateTimeRules.required(this.editedItem.endTime)
          && this.typeEventRules.required(this.editedItem.endTime))
    },

    lessons() {
      return this.coursesData;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.teachers = this.lectors
      this.courses = this.coursesData.map(item => {
        return {
          id: item.id,
          title: item.title,
          startTime: (item.startTime),
          endTime: (item.endTime),
          lectureType: item.lectureType,
          activeUser: item.activeUser,
        };
      });
    },

    editItem(item) {
      this.editedIndex = this.courses.indexOf(item);
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
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = {
        id: item.id,
        title: item.title,
        startTime: (item.startTime),
        endTime: (item.endTime),
        activeUser: item.activeUser,
        lectureType: parseInt(item.lectureType),
      };
      this.deletedIndex = item.id
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.courses.splice(this.editedIndex, 1);
      this.$emit('courses-updated', this.courses);
      this.closeDelete();
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
      if (this.editedIndex > -1) {
        this.$set(this.courses, this.editedIndex, this.editedItem);
        this.close();
      } else {
        this.courses.push(this.editedItem);
        this.close();
      }

      this.$emit('courses-updated', this.courses);
    },

    getTableRowClass(item) {
      const classMap = {
        1: ' green-background',
        2: 'yellow-background',
        3: 'red-background',
        4: 'gray-background'
      };

      return classMap[item.lectureType] || '';
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

    getListItemClass(item) {
      const classMap = {
        'Основы вождения': 'green-background',
        'Основы ПДД': 'yellow-background',
        'Медицина': 'red-background',
        'Другое': 'gray-background'
      };
      const isSelected = this.editedItem.lectureType === item;
      return !isSelected ? classMap[item] || 'gray-background' : '';
    },

    selectItem(item) {
      const index = this.discriminator.indexOf(item);

      if (index !== -1) {
        this.editedItem.lectureType = index;
      }
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Новое занятие' : 'Редактировать занятие';
    },
  },
};
</script>
<style src="@/assets/styles/eventTypes.css">
</style>