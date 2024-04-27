<template>
  <v-container fluid>
    <v-row no-gutters align="center" class="spacer">
      <v-col lg="">
        <div class="big-title">
          <v-btn icon class="ma-0  align-self-center" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          {{ formTitle }}
        </div>
      </v-col>
      <v-col class="text-right col-auto" v-if="hasChanges">
        <v-btn class="template-course-button" @click="save" color="#4E7AEC"
               :disabled="isSaveButtonDisabled && blockButtonWhenRequest">
          <section class="d-flex flex-row align-center" style="padding: 8px 12px 8px 12px !important;">
            <span class="template-course-button-text white--text">Сохранить изменения</span>
          </section>
        </v-btn>
        <v-btn class="tab-button pa-0 rounded-lg ml-4" color="#2B2A29" @click="cancelChanges" style="min-width: 196px"
               outlined>
          <span class="black--text">Выйти без изменений</span>
        </v-btn>
      </v-col>
    </v-row>
    <hr>
        <v-row>
          <div style="font-size: 12px; font-weight: 400; line-height: 14px; color: #A6A8AA; padding: 20px 0 20px 12px">ОБЩИЕ
            СВЕДЕНИЯ
          </div>
        </v-row>
    <v-row class="flex-wrap" style="column-gap: 14px">
      <v-col style="max-width: min-content; padding:  0 0 0 12px">
        <v-text-field v-model="editedItem.groups.groupNumber" label="Номер группы" dense
                      class="text-field-group-template"
                      :rules="[groupNumberRules.required, groupNumberRules.integer]" outlined hide-details
                      @change="newGroupTitle"
                      style="border-radius: 12px !important; max-height: 32px !important; min-width: 115px !important; max-width: 115px !important;"/>
      </v-col>
      <v-col style="max-width: min-content; padding: 0">
        <v-text-field v-model="editedItem.groups.title" label="Название группы" dense
                      class="text-field-group-template"
                      style="border-radius: 12px !important; max-height: 32px !important;  min-width: 427px !important; max-width: 427px !important;"
                      :rules="[titleRules.required]" outlined hide-details disabled/>
      </v-col>
    </v-row>
        <v-row>
          <div style="font-size: 12px; font-weight: 400; line-height: 14px; color: #A6A8AA; padding: 20px 0 20px 12px">
            СТУДЕНТЫ
          </div>
        </v-row>
    <v-row class="flex-wrap">
      <v-col cols="12" class="py-0">
        <v-select
            v-model="selectedStudents"
            :value="editedItem.lecture.activeUser"
            :items="studentList"
            :item-text="item => `${item.surname} ${item.name} ${item.middleName} `"

            multiple
            hide-details
            persistent-hint
            no-data-text="Нет данных для отображения"
            item-value="id"
            @change="updateSelectedStudentsIds" dense height="32px">
          <template v-slot:selection="{ item, index }">
            <v-chip class="select-students-chips">
              <v-icon class="white--text" style="transform: rotate(45deg);" @click.stop="removeStudent(item)">mdi-plus</v-icon>
              <span class="pl-1 white--text">{{ `${item.surname} ${item.name} ${item.middleName} ` }}</span>
            </v-chip>
          </template>
        </v-select>
      </v-col>
    </v-row>
        <v-row>
          <div style="font-size: 12px; font-weight: 400; line-height: 14px; color: #A6A8AA; padding: 20px 0 20px 12px">
            ПЛАН ОБУЧЕНИЯ
          </div>
        </v-row>
    <v-row class="flex-wrap">
      <v-col style="max-width: min-content;">
        <v-text-field v-model="globalStartDate" label="Дата начала курса" dense
                      type="date" :rules="[startDateRules.required]"
                      class="text-field-date-template"
                      style="border-radius: 12px !important; max-height: 32px !important; min-width: 167px !important; max-width: 167px !important;"
                      @input="updateGlobalStartDate" :min="getTodayDate()" @change="newGroupTitle" outlined
                      hide-details/>
      </v-col>
      <v-col style="max-width: min-content;">
        <v-text-field dense
                      label="Выберите время начала занятий"
                      :value="globalStartTime"
                      type="time"
                      @input="updateGlobalStartTime"
                      :rules="[startTimeRules.required]"
                      outlined
                      hide-details
                      class="text-field-date-template"
                      style="border-radius: 12px !important; max-height: 32px !important; min-width: 100px !important; max-width: 100px !important;"/>
      </v-col>
      <v-col cols="lg-4 md-4 sm-8">
        <template>
          <div class="chips-container" style="display: flex; justify-content: space-around; width: 100%;">
            <v-chip
                v-for="(chip, index) in chips"
                :key="index"
                :class="{'daily-chips-unselected': !selectedChips.includes(chip),
                'white--text daily-chips-selected': selectedChips.includes(chip)}"
                :color="selectedChips.includes(chip) ? '#2B2A29' : null"
                @click="toggleSelectedChip(chip)"
            >
              <strong>{{ chip }}</strong>&nbsp;
            </v-chip>
          </div>
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <CoursesList :coursesData="lessons" :lectors="teachers" :initialData="initialData"
                     @courses-updated="handleCoursesUpdated"/>
      </v-col>
    </v-row>
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
import {successAlert, warningAlert} from "@/components/Alerts/alert";

export default {
  name: 'Item',
  components: {CoursesList},
  data: () => ({
    globalStartTime: null,
    coursesData: null,
    studentList: null,
    globalStartDate: null,
    originalLessons: [],
    lessons: [],
    initialData: [],
    selectedChips: [],
    selectedStudents: [],
    selectedStudentsIds: [],
    teachers: [],
    blockButtonWhenRequest: false,
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
        groupNumber: 0,
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
      required: value => !!value,
      integer: value => Number.isInteger(Number(value)) || 'Введите целое число',
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
      return this.editedItem.groups.title
    },

    hasChanges() {
      return JSON.stringify(this.lessons) !== JSON.stringify(this.originalLessons);
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    removeStudent(item) {
      const index = this.selectedStudents.find(student => student.id === item)
      if (index !== -1) {
        this.selectedStudents.splice(index, 1);
      }
    },

    prev() {
      this.$router.push({name: 'admin-groups'})
    },

    newGroupTitle() {
      let startDate = this.editedItem.groups.startDate;
      let parts = startDate.split('-');
      let rearranged = [parts[2], parts[1], parts[0]].join('.');
      return this.editedItem.groups.title = `Группа №${this.editedItem.groups.groupNumber} Старт ${rearranged}`;
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
        this.initialData = this.coursesData.map(item => {
          return {
            id: item.id,
            title: item.title,
            startTime: item.startTime,
            endTime: item.endTime,
            lectureType: item.lectureType,
            activeUser: item.activeUser,
          };
        });
        this.editedItem.groups.title = `Группа №0`;

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
        this.initialData = this.coursesData.map(item => {
          return {
            id: item.id,
            title: item.title,
            startTime: item.startTime,
            endTime: item.endTime,
            lectureType: item.lectureType,
            activeUser: item.activeUser,
          };
        });
        this.selectedDays()
        this.updateSelectedStudentsIds()
      }
      this.originalLessons = JSON.parse(JSON.stringify(this.lessons))
    },

    selectedDays() {
      const dayOfWeekMap = {
        'Monday': 'Пн',
        'Tuesday': 'Вт',
        'Wednesday': 'Ср',
        'Thursday': 'Чт',
        'Friday': 'Пт',
        'Saturday': 'Сб',
        'Sunday': 'Вс'
      };
      let daysOfWeekArray = [];
      if (this.lessons && this.lessons.length > 0) {
        this.lessons.forEach(event => {
          const dayOfWeekEnglish = moment(event.startTime).format('dddd');
          const dayOfWeekRussian = dayOfWeekMap[dayOfWeekEnglish];
          if (dayOfWeekRussian) {
            daysOfWeekArray.push(dayOfWeekRussian);
          }
        });
      }

      daysOfWeekArray = daysOfWeekArray.filter((x, i, a) => a.indexOf(x) === i)
      this.selectedChips = daysOfWeekArray
    },

    cancelChanges() {
      warningAlert('Изменения не сохранены', 5000)
      this.close()
    },

    close() {
      this.blockButtonWhenRequest = false
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
      this.blockButtonWhenRequest = true
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
        await this.postCourse(body).then(() => {
          successAlert('Изменения сохранены успешно', 5000);
          this.close();
        })
      } else {
        const body = {
          "title": this.editedItem.groups.title,
          "courseStartDate": this.globalStartDate,
          "startTime": this.globalStartTime,
          'groupNumber': this.editedItem.groups.groupNumber,
          "groupId": this.editedItem.groups.groupId,
          "studentId": this.selectedStudentsIds,
          "lecture": this.lessons
        }
        await this.postCourse(body).then(() => {
          successAlert('Группа успешно создана', 5000);
          this.close();
        })
      }
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


.select-students-chips {
  border-radius: 4px !important;
  background-color: black !important;
  margin: 0 0 0 0 !important;
}

.daily-chips-selected {
  border-radius: 4px !important;
  background-color: black !important;
}

.daily-chips-unselected {
  border-radius: 4px !important;
  background: rgba(255, 255, 255, 0.7) !important;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 318px;
}

.text-field-group-template {
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

.text-field-date-template {
  .v-input__control {
    .v-input__slot {
      display: flex !important;
      align-items: center !important;
      min-height: 32px !important;
      //padding: 0 !important;
    }
  }

  .v-input__prepend-inner {
    margin: 0 !important;
  }

  .v-input__icon {
    height: 32px !important;
  }
}

.template-course-button {
  text-transform: none !important;
  border-radius: 12px !important;
  height: 32px !important;
  min-width: 196px;

  &-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    margin-left: 8px !important;
    line-height: 18.75px !important;
  }
}
</style>