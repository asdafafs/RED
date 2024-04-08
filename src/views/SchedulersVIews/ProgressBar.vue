<template>
  <v-container class="px-0 pa-0 ma-0 " fluid>
    <v-row class="flex-wrap py-2" no-gutters style="border-radius: 12px !important; border:1px solid #AAA7A6;">
      <v-col v-for="(item, index) in items" :key="index">
        <div class="d-flex flex-column justify-center">
          <div class="text-center custom-text-circular">{{item.title}}</div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :value="item.hoursSpentPercent"
                color="#8CED7C"
                class="ma-2 pa-2"
            >
              <div>
                <div class="custom-text-circular-title">
                  <span >{{item.hoursSpent}}</span>{{ " " }}
                  <span class="custom-text-circular">из {{item.totalHours}}</span>
                </div>
                <div class="custom-text-circular">часов</div>
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
        hoursSpentPercent: 0,
        totalHours: 0,
      },
      {
        title: 'Осталось практик',
        hoursSpent: 0,
        hoursSpentPercent: 0,
        totalHours: 0,
      },
      {
        title: 'Осталось доппрактик',
        hoursSpent: 0,
        hoursSpentPercent: 0,
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
            hoursSpentPercent: (studentInfo.generalHoursSpent/studentInfo.generalHours) * 100,
            totalHours: studentInfo.generalHours
          },
          {
            title: 'Осталось практик',
            hoursSpent: studentInfo.generalHoursSpent,
            hoursSpentPercent: (studentInfo.generalHoursSpent/studentInfo.generalHours) * 100,
            totalHours: studentInfo.generalHours,
          },
          {
            title: 'Осталось доппрактик',
            hoursSpent: studentInfo.additinalHoursSpent,
            hoursSpentPercent: (studentInfo.additinalHoursSpent/studentInfo.additinalHours) * 100,
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
<style>
.custom-text-circular {
  color: #000000;
  font-weight: 700 !important;
  font-size: 24px !important;
  line-height: 28px !important;
}

.custom-text-circular-title {
  color: #4E7AEC;
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 28px !important;
}
</style>