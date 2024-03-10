<template>
  <v-container class="px-4 pa-0 ma-0 " fluid>
    <div class="text-h5 font-weight-bold" style="">Мои успехи</div>
    <v-row class="flex-wrap py-2" no-gutters>
      <v-col class="">
        <div class=" d-flex flex-column justify-center">
          <div class="text-center">Пройдено теории
          </div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="value.generalHoursSpent"

                color="#8CED7C"
                class="ma-2 pa-2 "
            >
              <div class="text-center">
                <div class="text-center text-h3 black--text"> <span class="text-lg-h2" style="color: #4E7AEC">{{ value.generalHoursSpent }} </span>{{ "из" }}
                  {{ value.generalHours }}
                </div>
                <div class="black--text">часов</div>
              </div>

            </v-progress-circular>
          </div>
        </div>

      </v-col>
      <v-col>
        <div class=" d-flex flex-column justify-center">
          <div class="text-center">Осталось практик
          </div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="value.generalHoursSpent"

                color="#8CED7C"
                class="ma-2 pa-2"
            >
              <div class="text-center">
                <div class="text-center text-h3 black--text"> <span class="text-lg-h2" style="color: #4E7AEC">{{ value.generalHoursSpent }}</span> {{ "из" }}
                  {{ value.generalHoursSpent }}
                </div>
                <div class="black--text">часов</div>
              </div>
            </v-progress-circular>
          </div>
        </div>
      </v-col>
      <v-col>
        <div class=" d-flex flex-column justify-center">
          <div class="text-center">Осталось доппрактик
          </div>
          <div class="d-flex justify-center">
            <v-progress-circular
                :rotate="360"
                :size="240"
                :width="35"
                :model-value="value.additinalHoursSpent"

                color="#8CED7C"
                class="ma-2 pa-2"
            >
              <div class="text-center">
                <div class="text-center text-h3 black--text"> <span class="text-lg-h2" style="color: #4E7AEC">{{ value.additinalHoursSpent }}</span> {{ "из" }}
                  {{ value.additinalHours }}
                </div>
                <div class="black--text"> часов</div>
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