<template>
  <v-container class="px-4 pa-0 ma-0 " fluid>
    <div class="text-h5 font-weight-bold" style="">Мои успехи</div>
    <v-row class="flex-wrap" no-gutters>
      <v-col cols="12" class="justify-center">
        <div class=" d-flex flex-column justify-center">
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="value.generalHoursSpent"

                color="#4E7AEC"
                class="ma-2 pa-2 "
            >
              <div class="text-center">
                <div class="text-center text-h3"> {{ value.generalHoursSpent / value.generalHours * 100 }}%</div>
                <div> пройдено</div>
              </div>

            </v-progress-circular>
          </div>
          <div class="text-center">Осталось {{ 100.0 - value.generalHoursSpent / value.generalHours * 100 }}% практик</div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="value.additinalHoursSpent"

                color="#E31E24"
                class="ma-2 pa-2"
            >
              <div class="text-center">
                <div class="text-center text-h3"> {{ value.additinalHoursSpent / value.additinalHours * 100 }}%</div>
                <div> пройдено</div>
              </div>
            </v-progress-circular>
          </div>
          <div class="text-center">Осталось {{ value.additinalHours - value.additinalHoursSpent  }} дополнительных
            практик
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
    value: {
      generalHours: 0,
      generalHoursSpent: 0,
      additinalHours: 0,
      additinalHoursSpent: 0
    }
  }),

  mounted() {

  },
  beforeMount() {

  },


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
        this.value = {
          generalHours: studentInfo.generalHours,
          generalHoursSpent: studentInfo.generalHoursSpent,
          additinalHours: studentInfo.additinalHours,
          additinalHoursSpent: studentInfo.additinalHoursSpent
        };
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