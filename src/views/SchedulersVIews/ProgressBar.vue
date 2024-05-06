<template>
  <v-container class="px-0 pa-0 ma-0 " fluid>
    <div class="d-flex flex-column justify-center" style="gap: 12px">
      <div class="custom-text-circular">Сведения о группе</div>
      <div>{{ groupTitle }}</div>
      <div class="custom-text-circular">Сведения о параметрах обучения</div>
      <div>
        <span class="education-info-title">Коробка передач </span>
        <span class="education-info-subtitle">{{ transmissionTypeEnum }}</span>
      </div>
      <div>
        <span class="education-info-title">Город </span>
        <span class="education-info-subtitle"> {{ city }} </span>
      </div>
      <div style="border-radius: 12px !important; border:1px solid #AAA7A6; padding: 32px 10px 32px 10px">
        <v-row class="flex-wrap py-2" no-gutters>
          <v-col v-for="(item, index) in items" :key="index">
            <div class="d-flex flex-column justify-center">
              <div class="text-center custom-text-circular" style="height: 56px">{{ item.title }}</div>
              <div class="d-flex justify-center">
                <v-progress-circular
                    :rotate="360"
                    :size="240"
                    :width="35"
                    :value="item.hoursSpentPercent"
                    :color="item.color"
                    class="ma-2 pa-2"
                >
                  <div>
                    <div class="custom-text-circular-title">
                      <span>{{ item.hoursSpent }}</span>{{ " " }}
                      <span class="custom-text-circular">из {{ item.totalHours }}</span>
                    </div>
                    <div class="custom-text-circular">часов</div>
                  </div>
                </v-progress-circular>
              </div>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex flex-row justify-center" style="gap: 40px">
          <div v-for="(item, index) in itemsPastPractices" :key="index" style="width: 225px !important;">
            <div class="d-flex flex-column justify-center" style="gap: 17px; width: fit-content">
              <div class="text-center custom-text-practice">{{ item.title }}</div>
              <div class="text-center custom-text-practice-subtitle">{{ item.totalHours }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import UsersRequest from "@/services/UsersRequest";
import GroupsRequest from "@/services/GroupsRequest";

export default {
  name: 'progressBar',
  data: () => ({
    items: [
      {
        title: 'Осталось лекций',
        hoursSpent: 0,
        hoursSpentPercent: 0,
        totalHours: 0,
        color: '#8CED7C',

      },
      {
        title: 'Остаток оплаченных практик',
        hoursSpent: 0,
        hoursSpentPercent: 0,
        totalHours: 0,
        color: '#8CED7C',
      },
      {
        title: 'Занятия в долг',
        hoursSpent: 0,
        hoursSpentPercent: 0,
        totalHours: 0,
        color: '#FF5055',
      }
    ],
    itemsPastPractices: [
      {
        title: 'Проведено практик',
        totalHours: 0
      },
      {
        title: 'Сгорело практик',
        totalHours: 0
      },
    ],
    groupTitle: '',
    transmissionTypeEnum: '',
    city: '',
    groupId: 0,
  }),


  methods: {
    formatCity(item) {
      const includes1 = item.includes(1);
      const includes2 = item.includes(2);
      if (includes1 && includes2) {
        return 'Северодвинск, Новодвинск';
      } else if (includes1) {
        return 'Северодвинск';
      } else if (includes2) {
        return 'Новодвинск';
      } else {
        return '';
      }
    },

    formatTransmissions(item) {
      const includes1 = item.includes(1);
      const includes2 = item.includes(2);
      if (includes1 && includes2) {
        return 'АКП, МКП';
      } else if (includes1) {
        return 'АКП';
      } else if (includes2) {
        return 'МКП';
      } else {
        return '';
      }
    },

    async getGroupNumber() {
      const group = new GroupsRequest();
      if (this.groupId !== 0 && this.groupId !== null) {
        const title = await group.getGroup(this.groupId)
            .then(group => {
              return group.data[0].title;
            })
            .catch(error => {
              console.log("Error fetching group:", error);
              return null;
            });
        return this.groupTitle = title
      } else return this.groupTitle = 'Вы пока не зачислены в группу'
    },

    async getFullDataStudent() {
      const student = new UsersRequest()
      let studentInfo = await student.getFullStudentInfo().catch(x => console.log(x))
      studentInfo = studentInfo.data.students[0]
      this.transmissionTypeEnum = this.formatTransmissions(studentInfo.transmissionTypeEnum)
      this.city = this.formatCity(studentInfo.city)
      this.items = [
        {
          title: 'Осталось лекций',
          hoursSpent: studentInfo.lectureHoursCurrent,
          hoursSpentPercent: (studentInfo.lectureHoursCurrent / studentInfo.lectureHoursMax) * 100,
          totalHours: studentInfo.lectureHoursMax,
          color: '#8CED7C',
        },
        {
          title: 'Остаток оплаченных практик',
          hoursSpent: studentInfo.generalHoursSpent,
          hoursSpentPercent: (studentInfo.generalHoursSpent / studentInfo.generalHours) * 100,
          totalHours: studentInfo.generalHours,
          color: '#8CED7C',
        },
        {
          title: 'Занятия в долг',
          hoursSpent: studentInfo.additinalHoursSpent,
          hoursSpentPercent: (studentInfo.additinalHoursSpent / studentInfo.additinalHours) * 100,
          totalHours: studentInfo.additinalHours,
          color: '#FF5055',
        }
      ]
      this.itemsPastPractices = [
        {
          title: 'Проведено практик',
          totalHours: studentInfo.closedPracticeCount
        },
        {
          title: 'Сгорело практик',
          totalHours: studentInfo.burntPracticeCount
        }
      ]
      this.groupId = studentInfo.groupId
    },

    initialize() {
      this.getFullDataStudent().then(() => {
        this.getGroupNumber()
      })

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

.custom-text-practice {
  color: #000000;
  font-weight: 700 !important;
  font-size: 24px !important;
  line-height: 28px !important;
  width: fit-content;
}

.custom-text-practice-subtitle {
  color: #4E7AEC;
  font-weight: 700 !important;
  font-size: 40px !important;
  line-height: 28px !important;
  width: fit-content;
}

.education-info-title {
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 600
}

.education-info-subtitle {
  font-size: 16px;
  line-height: 18.75px;
  font-weight: 400
}
</style>