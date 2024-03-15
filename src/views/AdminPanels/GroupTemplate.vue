<template>
  <v-container fluid>
    <v-row no-gutters align="center" class="spacer">
      <v-col lg="">
        <div class="text-h4 font-weight-bold">
          <v-btn icon class="ma-0  align-self-center" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="text-h5">{{ formTitle }}</span>
        </div>
      </v-col>
    </v-row>
    <hr>
    <v-row class="flex-wrap">
      <v-col cols="12">
        <v-select
            v-model="selectedStudents"
            :value="editedItem.lecture.activeUser"
            :items="studentList"
            :item-text="item => `${item.name} ${item.surname} ${item.middleName}`"
            label="Список свободных учеников"
            multiple
            hint="Выберите студентов для группы"
            persistent-hint
            no-data-text="Нет данных для отображения"
            item-value="id"
            @change="updateSelectedStudentsIds"
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="flex-wrap">
      <v-col cols="lg-1 md-2">
        <v-text-field v-model="editedItem.groups.groupNumber" label="Номер группы"
                      :rules="[groupNumberRules.required]" outlined hide-details></v-text-field>
      </v-col>
      <v-col cols="lg-2 md-3">
        <v-text-field v-model="editedItem.groups.title" label="Название группы"
                      :rules="[titleRules.required]" outlined hide-details></v-text-field>
      </v-col>
      <v-col cols="lg-2 md-3">
        <v-text-field v-model="editedItem.groups.startDate" label="Дата начала курса"
                      type="date" :rules="[startDateRules.required]"
                      @input="updateGlobalStartDate" :min="getTodayDate()" outlined hide-details></v-text-field>
      </v-col>
      <v-col cols="lg-1 md-2">
        <v-text-field
            label="Выберите время начала занятий"
            :value="globalStartTime"
            type="time"
            @input="updateGlobalStartTime"
            :rules="[startTimeRules.required]"
            outlined
            hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="lg-3 md-3 sm-6">
        <template>
          <div class="chips-container">
            <v-chip
                v-for="(chip, index) in chips"
                :key="index"
                :color="selectedChips.includes(chip) ? 'blue' : null"
                @click="toggleSelectedChip(chip)"
            >
              <strong>{{ chip }}</strong>&nbsp;
            </v-chip>
          </div>
        </template>
      </v-col>
      <v-col class="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" outlined @click="save"
               :disabled="isSaveButtonDisabled">
          <span class="black--text">Сохранить изменения</span>
        </v-btn>
      </v-col>
      <v-col class="">
        <v-btn class="tab-button pa-0 rounded-lg" color="#2B2A29" text @click="cancelChanges">
          <span class="black--text">Выйти без изменений</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CoursesList :coursesData="lessons" :lectors="teachers"
                     @courses-updated="handleCoursesUpdated"></CoursesList>
      </v-col>
    </v-row>
    <v-dialog v-model="cancelSaveChanges" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Вы уверены? Все несохраненные изменения будут удалены</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCanselChanges">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="confirmCancelChanges">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import CoursesList from "@/views/AdminPanels/CoursesList.vue"
import moment from "moment/moment";
import {mapState} from "vuex";
import UsersRequest from "@/services/UsersRequest";
import CoursesRequest from "@/services/CoursesRequest";
import GroupsRequest from "@/services/GroupsRequest";
import Vue from "vue";

export default {
  name: 'Item',
  components: {CoursesList},
  data: () => ({
    globalStartTime: null,
    coursesData: null,
    studentList: null,
    globalStartDate: null,
    lessons: [],
    selectedChips: [],
    selectedStudents: [],
    selectedStudentsIds: [],
    teachers: [],
    groupDisabled: false,
    cancelSaveChanges: false,
    chips: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    headersGroup: [
      {text: '№', align: 'start', sortable: false, value: 'id', width: '5%'},
      {text: 'Название', align: 'start', sortable: false, value: 'title', width: '20%'},
      {text: 'Даты обучения', align: 'start', sortable: false, value: 'id', width: '20%'},
      {text: 'Ученики', align: 'start', sortable: false, value: 'id', width: '50%'},
      {text: 'Действия', value: 'actions', sortable: false, width: '5%'},
    ],
    groups: [],
    editedIndex: -1,
    editedItem: {
      groups: {
        groupId: null,
        title: ``,
        startDate: null,
        startTime: null,
        fullGroupName: null,
        groupNumber: null,
      },

      lecture: {
        id: null,
        title: '',
        startTime: null,
        endTime: null,
        activeUser: null,
        lectureType: null,
      },
    },
    titleRules: {
      required: value => !!value
    },
    startDateRules: {
      required: value => !!value
    },
    startTimeRules: {
      required: value => !!value
    },
    groupNumberRules: {
      required: value => !!value
    },

    dateOfWeek: [false, false, false, false, false, false, false],
    cursorDateOfWeek: 0,
    cursorDate: moment(new Date())
  }),

  computed: {
    ...mapState(['user']),
    isSaveButtonDisabled() {
      return !(this.titleRules.required(this.editedItem.groups.title)
          && this.startDateRules.required(this.editedItem.groups.startDate)
          && this.startTimeRules.required(this.globalStartTime)
          && this.groupNumberRules.required(this.editedItem.groups.groupNumber));
    },

    areDatesOfWeekNotEmpty() {
      if (this.dateOfWeek.some(item => item === true))
        return this.dateOfWeek.some(item => item === true);
      else {
        this.dateOfWeek[0] = true
        return this.dateOfWeek.some(item => item === true);
      }
    },

    getGroupId() {
      const {selectedGroupID} = this.$route.params;
      return parseInt(selectedGroupID);
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Новая группа' : 'Редактировать группу';
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    prev() {
      this.$router.push({name: 'admin-groups'})
    },

    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    },

    async getEventsTeacher() {
      const teachers = new UsersRequest();
      let activeUsers
      await teachers.getActiveUser().catch(x => console.log(x)).then(x => {
        activeUsers = x.data.activeUsers
      })
      return activeUsers
    },

    handleCoursesUpdated(courses) {
      this.lessons = courses
    },

    async getFreeUsers() {
      const user = new UsersRequest();
      let studentList
      await user.getStudentNullGroup().catch(x => console.log(x)).then(x => {
        studentList = x.data.students
      })
      return studentList
    },
    async getCourseLast() {
      const course = new CoursesRequest()
      await course.getCourseNull().catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime
        this.globalStartDate = this.formatDatetime(x.data.startDate)
        this.groupNumber = x.data.groupNumber
      })
    },

    async getGroups() {
      const groups = new GroupsRequest();
      let groupData
      await groups.getGroups().catch(x => console.log(x)).then(x => {
        groupData = x.data
      })
      return groupData
    },

    async postCourse(body) {
      const course = new CoursesRequest();
      await course.postCourse(body).catch(x => console.log(x))
    },

    async getCourseId(id) {
      const course = new CoursesRequest()
      const getItem = {"id": id}
      await course.getCourse(getItem.id).catch(x => console.log(x)).then(x => {
        this.coursesData = x.data.lecture
        this.globalStartTime = x.data.startTime
        this.globalStartDate = this.formatDatetime(x.data.startDate)
        this.groupNumber = x.data.groupNumber
        this.studentList = this.studentList.concat(x.data.students);
        this.selectedStudents = x.data.students.map(student => student.id);
      })
    },

    async initialize() {
      this.groups = await this.getGroups();
      const item = this.groups.find(group => group.groupId === this.getGroupId)
      this.editedIndex = this.groups.indexOf(item)
      this.studentList = await this.getFreeUsers()
      this.teachers = await this.getEventsTeacher()
      if (this.editedIndex === -1) {
        await this.getCourseLast();
        this.lessons = this.coursesData.map(item => {
          return {
            id: item.id,
            title: item.title,
            startTime: item.startTime,
            endTime: item.endTime,
            lectureType: item.lectureType,
            activeUser: item.activeUser,
          };
        });
        const nextGroupNumber = this.groups.length + 1;
        this.editedItem.groups.title = `Группа №${nextGroupNumber}`;

      } else {
        await this.getCourseId(this.getGroupId);
        this.lessons = this.coursesData.map(item => {
          return {
            id: item.id,
            title: item.title,
            startTime: item.startTime,
            endTime: item.endTime,
            lectureType: item.lectureType,
            activeUser: item.activeUser,
          };
        });
        this.editedItem.groups = {
            groupId: item.groupId,
            title: item.title,
            startDate: this.globalStartDate,
            studentId: item.student,
            groupNumber: item.groupNumber,
        };
        this.updateSelectedStudentsIds()
      }
    },

    closeCanselChanges() {
      this.cancelSaveChanges = false
    },

    confirmCancelChanges() {
      this.close()
    },

    cancelChanges() {
      this.cancelSaveChanges = true
    },

    close() {
      const nextGroupNumber = this.groups.length + 1;
      this.$nextTick(() => {
        this.editedItem = {
          groups: {
            groupId: null,
            title: `Группа №${nextGroupNumber}`,
            startDate: null,
          },
          lecture: {
            id: null,
            title: '',
            startTime: null,
            endTime: null,
            activeUser: null,
            lectureType: null,
          },
        };
        this.editedIndex = -1;
      });
      this.selectedChips = []
      this.lessons = []
      this.studentList = []
      this.prev()
    },

    save: async function () {
      this.groupDisabled = true
      if (this.editedIndex > -1) {
        const body = {
          "title": this.editedItem.groups.title,
          "courseStartDate": this.editedItem.groups.startDate,
          "startTime": this.globalStartTime,
          'groupNumber': this.editedItem.groups.groupNumber,
          "groupId": this.editedItem.groups.groupId,
          "studentId": this.selectedStudentsIds,
          "lecture": this.lessons
        }
        await this.postCourse(body).finally(() => {
          this.groupDisabled = false
          this.lessons = []
        })
      } else {
        const body = {
          "title": this.editedItem.groups.title,
          "courseStartDate": this.editedItem.groups.startDate,
          "startTime": this.globalStartTime,
          'groupNumber': this.editedItem.groups.groupNumber,
          "groupId": this.editedItem.groups.groupId,
          "studentId": this.selectedStudentsIds,
          "lecture": this.lessons
        }
        await this.postCourse(body).finally(() => {
          this.groupDisabled = false
        })
      }
      this.close();
    },

    formatDatetime(timestamp) {
      if (!timestamp) return null;
      const date = new Date(timestamp);
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    updateGlobalStartTime(value) {
      this.globalStartTime = value;
      if (this.selectedChips.some(chip => chip === true)) {
        this.toggleSelectedChip(this.selectedChips);
      } else {
        this.toggleSelectedChip(0);
      }

    },

    updateGlobalStartDate(value) {
      this.globalStartDate = value;
      if (this.selectedChips.some(chip => chip === true)) {
        this.toggleSelectedChip(this.selectedChips);
      } else {
        this.toggleSelectedChip(0);
      }
    },

    updateSelectedStudentsIds() {
      this.selectedStudentsIds = this.selectedStudents.map(selectedStudent => {
        this.studentList.find(student => {
          const fullName = `${student.name} ${student.surname} ${student.middleName}`;
          return fullName === selectedStudent;
        });
        return selectedStudent;
      });
    },

    toggleSelectedChip(chip) {
      const dayOfWeekMapping = {
        'Пн': 0,
        'Вт': 1,
        'Ср': 2,
        'Чт': 3,
        'Пт': 4,
        'Сб': 5,
        'Вс': 6,
      };

      this.cursorDate = this.globalStartDate
      const index = this.selectedChips.indexOf(chip);
      if (index !== -1) {
        this.selectedChips.splice(index, 1);
      } else {
        this.selectedChips.push(chip);
      }
      if (this.selectedChips.length === 0) return

      const sortedSelectedDays = this.selectedChips.map(day => dayOfWeekMapping[day]);
      this.dateOfWeek = this.dateOfWeek.map((value, idx) => sortedSelectedDays.includes(idx));

      let [lectureStartHour, lectureStartMinutes] = this.globalStartTime.split(':').map(Number);

      this.lessons.forEach(item => {

        item.startTime = this.getNextDay().set({
          hour: lectureStartHour,
          minute: lectureStartMinutes,
        })
        const endTime = moment(item.startTime);
        const lectureLengthTimeInHours = 2
        endTime.add('hour', lectureLengthTimeInHours)

        Vue.set(item, 'endTime', endTime);

        Vue.set(item, 'startTime', item.startTime.format('YYYY-MM-DDTHH:mm'));
        Vue.set(item, 'endTime', item.endTime.format('YYYY-MM-DDTHH:mm'));
      })
      this.cursorDateOfWeek = 0
      this.cursorDate = moment(new Date())
    },

    getNextDay() {
      const nextWeekendIndex = this.getNextWeekendDayIndex()
      return this.getNextDayByWeekendDayIndex(nextWeekendIndex);
    },

    getNextWeekendDayIndex() {
      if (!this.areDatesOfWeekNotEmpty) return;
      while (true) {
        if (this.dateOfWeek[this.cursorDateOfWeek]) {
          this.cursorDateOfWeek++;
          return this.cursorDateOfWeek - 1;
        }
        this.cursorDateOfWeek++;
        if (this.cursorDateOfWeek > this.dateOfWeek.length - 1) {
          this.cursorDateOfWeek = 0;
        }
      }

    },

    getNextDayByWeekendDayIndex(dayOfWeek) {
      let day = dayOfWeek + 1;
      const date = moment(this.cursorDate).isoWeekday(day)
      if (date <= this.cursorDate) {
        this.cursorDate = moment(this.cursorDate).add(1, 'weeks').isoWeekday(day)
      } else {
        this.cursorDate = date
      }
      return this.cursorDate;
    },
  },


}
</script>
<style>
@import "@/assets/styles/dataTableStyles.css";

.theme--light.v-chip:not(.v-chip--active) {
  background: rgba(255, 255, 255, 0.7);
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  min-width: 210px;
}

.chips-container > .v-chip {
  margin-right: 8px;
  margin-bottom: 8px;
}

</style>