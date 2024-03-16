<template>
  <v-container class="px-0 pa-0 ma-0 " fluid>
    <div class="text-h5 font-weight-bold" style="">Мои успехи</div>
    <v-row class="flex-wrap py-2" no-gutters>
      <v-col v-for="(item, index) in items" :key="index">
        <div class="d-flex flex-column justify-center">
          <div class="text-center">{{ item.title }}</div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="item.hoursSpent"
                color="#8CED7C"
                class="ma-2 pa-2"
            >
              <div class="text-center">
                <div class="text-center text-h3 black--text">
                  <span class="text-lg-h2" style="color: #4E7AEC">{{ item.hoursSpent }}</span> из {{ item.totalHours }}
                </div>
                <div class="black--text">часов</div>
              </div>
            </v-progress-circular>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";

export default {
  name: 'progressBar',
  data: () => ({
    items: [
      {
        title: 'Пройдено теории',
        hoursSpent: 0,
        totalHours: 0,
      },
      {
        title: 'Осталось практик',
        hoursSpent: 0,
        totalHours: 0,
      },
      {
        title: 'Осталось доппрактик',
        hoursSpent: 0,
        totalHours: 0,
      }
    ],
    value: {
      generalHours: 0,
      generalHoursSpent: 0,
      additinalHours: 0,
      additinalHoursSpent: 0
    }
  }),

  computed: {
    getIdUser() {
      const {currentStudentID} = this.$route.params;
      return currentStudentID;
    },
  },

  methods: {
    async getLessonsStudent() {

      const student = new UsersRequest();
      const users = await student.getUsers();

      const studentId = this.getIdUser;
      let studentInfo = users.data.students
      studentInfo = studentInfo.find(student => parseInt(student.id) === parseInt(studentId));
      if (studentInfo) {

        this.items = [
          {
            title: 'Осталось лекций',
            hoursSpent: studentInfo.generalHoursSpent,
            totalHours: studentInfo.generalHours
          },
          {
            title: 'Осталось практик',
            hoursSpent: studentInfo.generalHoursSpent,
            totalHours: studentInfo.generalHours,
          },
          {
            title: 'Осталось доппрактик',
            hoursSpent: studentInfo.additinalHoursSpent,
            totalHours: studentInfo.additinalHours,
          }
          ]
      }
    }
    ,

    initialize() {
      this.getLessonsStudent()
    }
  },

  created() {
    this.initialize()
  }
}
</script>