<template>

</template>

<script>
import moment from "moment";

export default {
  name: "Test",
  data() {
    return {
      events: {
        courseStartDate: "2024-02-09",
        groupName: "Группа №22",
        startTime: 22,
        groupId: null,
        studentId: [],
        lecture: [
          {
            id: 1,
            title: "Урок 1 Вводное занятие",
            startTime: "2023-09-04T20:00:00",
            endTime: "2023-09-04T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 4,
            title: "Урок 4 Лекция ПДД 2 Обязанности водителей, пешеходов и пассажиров. РУЛЕЖКА",
            startTime: "2023-09-11T20:00:00",
            endTime: "2023-09-11T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 5,
            title: "Урок 5 Лекция ПДД 3 Разбор ДЗ, Знаки ПРЕДУПРЕЖДАЮЩИЕ. РУЛЕЖКА",
            startTime: "2023-09-13T20:00:00",
            endTime: "2023-09-13T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 6,
            title: "Урок 6 Лекция ПДД 4 Знаки ПРИОРИТЕТА. РУЛЕЖКА",
            startTime: "2023-09-15T20:00:00",
            endTime: "2023-09-15T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 7,
            title: "Урок 7 Лекция ПДД 5 Знаки ПРЕДПИСЫВАЮЩИЕ И ЗНАКИ ОСОБЫХ ПРЕДПИСАНИЙ",
            startTime: "2023-09-18T20:00:00",
            endTime: "2023-09-18T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 8,
            title: "Урок 8 Лекция ПДД 6 Знаки ЗАПРЕЩАЮЩИЕ, ИНФОРМАЦИОННЫЕ",
            startTime: "2023-09-20T20:00:00",
            endTime: "2023-09-20T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 9,
            title: "Урок 9 Лекция 1 Безопасность движения в городских условиях. Наблюдение. Движение прямо. Перестроение.Объезд. Приоритетность.",
            startTime: "2023-09-25T20:00:00",
            endTime: "2023-09-25T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 10,
            title: "Урок 10 Лекция ПДД 7 Знаки СЕРВИСА, знаки ДОП ИНФОРМАЦИИ, Разметка",
            startTime: "2023-09-22T20:00:00",
            endTime: "2023-09-22T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 11,
            title: "Урок 11 Лекция 2 Безопасность движения в городских условиях. Проезд пешеходных переходов и остановок МТС. Поворот направо. По возможности правее. Поворот налево",
            startTime: "2023-09-27T20:00:00",
            endTime: "2023-09-27T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 12,
            title: "Урок 12 Лекция ПДД 8 Начало движения, маневрирование. Расположение ТС на ПЧ",
            startTime: "2023-09-29T20:00:00",
            endTime: "2023-09-29T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 13,
            title: "Урок 13 Лекция 3 Безопасность движения в городских условиях. Поворот налево на 4 - полосной дороге. Поворот налево на перекрестках с разделительной полосой.",
            startTime: "2023-10-02T20:00:00",
            endTime: "2023-10-02T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 14,
            title: "Урок 14 Лекция ПДД 9 Сигналы свтофора и регулировщика, Применение спец сигналов, Применение аварийной сигнализации",
            startTime: "2023-10-04T20:00:00",
            endTime: "2023-10-04T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 15,
            title: "Урок 15 Лекция ПДД 10 Проезд перекрестков",
            startTime: "2023-10-06T20:00:00",
            endTime: "2023-10-06T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 16,
            title: "Урок 16 Лекция ПДД 11 Скорость движения, обгон, опережение, встречный разьезд, остановки, стоянки",
            startTime: "2023-10-09T20:00:00",
            endTime: "2023-10-09T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 17,
            title: "Урок 17 Лекция ПДД 12 Пешеходные переходы и места остановок МТС, Движение через Ж/Д пути, Движение по автомагистрали, Движение в жилых зонах, Приоритет МТС. Решение билетов.",
            startTime: "2023-10-11T20:00:00",
            endTime: "2023-10-11T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 18,
            title: "Урок 18 Лекция 6 Безопасность движения в городских условиях. Проезд нестандартных перекрестков. Часть 1.",
            startTime: "2023-10-13T20:00:00",
            endTime: "2023-10-13T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 19,
            title: "Урок 19 Лекция ПДД 13 Пользование внешними световыми проборами, Буксировка, Учебная езда, Перевозка людей, Перевозка грузов, Требования к велосипедистам и мопедам",
            startTime: "2023-10-16T20:00:00",
            endTime: "2023-10-16T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 20,
            title: "Урок 20 Лекция 4 Безопасность движения в городских условиях. Проезд круговых перекрестков. Часть 1. ",
            startTime: "2023-10-18T20:00:00",
            endTime: "2023-10-18T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 21,
            title: "Урок 21 Лекция ПДД 14 Трамваи, гужевые повозки РЕШЕНИЕ БИЛЕТОВ",
            startTime: "2023-10-20T20:00:00",
            endTime: "2023-10-20T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 22,
            title: "Урок 22 Лекция 5 Безопасность движения в городских условиях. Проезд нестандартных перекрестков. Часть 2.",
            startTime: "2023-10-23T20:00:00",
            endTime: "2023-10-23T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 23,
            title: "Урок 23 Лекция ПДД 15 Устройство ТС и допуск к эксплуатации.",
            startTime: "2023-10-25T20:00:00",
            endTime: "2023-10-25T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 24,
            title: "Урок 24 Лекция 7 Безопасность движения в городских условиях. Проезд круговых перекрестков. Часть 2.",
            startTime: "2023-10-27T20:00:00",
            endTime: "2023-10-27T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 26,
            title: "Урок 26 Лекция ПДД 16 Основы безопасности.",
            startTime: "2023-11-01T20:00:00",
            endTime: "2023-11-01T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 27,
            title: "Урок 27 Лекция 8 Безопасность движения в городских условиях. Развороты на перекрестках. Часть 1.",
            startTime: "2023-11-03T20:00:00",
            endTime: "2023-11-03T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 28,
            title: "Урок 28 Лекция ПДД 17 Юридическая ответственность. Решение экзаменационных билетов",
            startTime: "2023-11-06T20:00:00",
            endTime: "2023-11-06T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 29,
            title: "Урок 29 Лекция 9 Безопасность движения в городских условиях. Развороты на перекрестках. Часть 2.",
            startTime: "2023-11-08T20:00:00",
            endTime: "2023-11-08T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 30,
            title: "Урок 30 Лекция ПДД 18 Решение экзаменационных билетов",
            startTime: "2023-11-10T20:00:00",
            endTime: "2023-11-10T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 31,
            title: "Урок 31 Лекция 10 Безопасность движения в городских условиях. Развороты вне перекрестка. Часть 1.",
            startTime: "2023-11-13T20:00:00",
            endTime: "2023-11-13T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 3,
            title: "Урок 3 Лекция ПДД 1 Основные понятия, общие положения. РУЛЕЖКА",
            startTime: "2023-09-08T20:00:00",
            endTime: "2023-09-08T22:00:00",
            lectureType: 2,
            activeUser: null
          },
          {
            id: 32,
            title: "Урок 32 Лекция 11 Безопасность движения в городских условиях. Развороты вне перекрестка. Часть 2.",
            startTime: "2023-11-15T20:00:00",
            endTime: "2023-11-15T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 33,
            title: "Урок 33 Лекция 12 Безопасность движения в городских условиях. Решение ситуационных задач.",
            startTime: "2023-11-17T20:00:00",
            endTime: "2023-11-17T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 34,
            title: "Урок 34 Лекция 13 Безопасность движения в городских условиях. Мастер парковки, Трасса.",
            startTime: "2023-11-20T20:00:00",
            endTime: "2023-11-20T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 71,
            title: "Тестовый урок",
            startTime: "2024-01-11T22:24:00",
            endTime: "2024-01-11T22:24:00",
            lectureType: 3,
            activeUser: null
          },
          {
            id: 35,
            title: "Урок 35 Лекция 14 Безопасность движения в городских условиях. Подготовка к экзамену, автодром.",
            startTime: "2023-11-30T20:00:00",
            endTime: "2023-11-30T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 36,
            title: "Урок 36 Лекция 15 Пресс конференция",
            startTime: "2023-12-05T20:00:00",
            endTime: "2023-12-05T22:00:00",
            lectureType: 1,
            activeUser: null
          },
          {
            id: 37,
            title: "Урок 37 Лекция 1 Первая помощь при ДТП",
            startTime: "2023-11-28T20:00:00",
            endTime: "2023-11-28T22:00:00",
            lectureType: 3,
            activeUser: null
          },
          {
            id: 38,
            title: "Урок 38 Лекция 2 Первая помощь при ДТП",
            startTime: "2023-11-30T20:00:00",
            endTime: "2023-11-30T22:00:00",
            lectureType: 3,
            activeUser: null
          },
          {
            id: 39,
            title: "Урок 39 Лекция 3 Первая помощь при ДТП",
            startTime: "2023-12-02T20:00:00",
            endTime: "2023-12-02T22:00:00",
            lectureType: 3,
            activeUser: null
          },
          {
            id: 40,
            title: "Урок 40 Лекция 4 Первая помощь при ДТП",
            startTime: "2023-12-05T20:00:00",
            endTime: "2023-12-05T22:00:00",
            lectureType: 3,
            activeUser: null
          },
          {
            id: 2,
            title: "Урок 2 Психофизиология. Основы управления.",
            startTime: "2023-09-06T20:00:00",
            endTime: "2023-09-06T22:00:00",
            lectureType: 1,
            activeUser: 13
          }
        ]
      },
      dateOfWeek: [true, true, false, false, true, false, false],
      cursorDateOfWeek: 0,
      lectureStartHour: 20,
      lectureLengthTimeInHours: 2,
      cursorDate: moment(new Date())
    }
  },
  methods: {
    getNextDayByWeekendDayIndex(dayOfWeek) {

      let day = dayOfWeek + 1;

      const date = moment(this.cursorDate).isoWeekday(day)

      if (date < this.cursorDate) {
        this.cursorDate = moment(this.cursorDate).add(1, 'weeks').isoWeekday(day)
      } else {
        this.cursorDate = date
      }

      return this.cursorDate;
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
    getNextDay() {
      const nextWeekendIndex = this.getNextWeekendDayIndex()
      return this.getNextDayByWeekendDayIndex(nextWeekendIndex);
    }
  },
  computed: {
    areDatesOfWeekNotEmpty() {
      return this.dateOfWeek.some(item => item === true);
    }
  },
  mounted() {
    this.events.lecture.forEach(item => {
      if (item.redactedManually) {
        return;
      }

      //set day
      item.startTime = this.getNextDay().set({
        hour: this.lectureStartHour
      })

      const endTime = moment(item.startTime);
      endTime.add('hour', this.lectureLengthTimeInHours)

      item.endTime = endTime

      item.startTime = item.startTime.format('YYYY-MM-DD HH:mm')
      item.endTime = item.endTime.format('YYYY-MM-DD HH:mm')

      console.log('lecture 1')
      console.log(`start time ${item.startTime}`)
      console.log(`end time ${item.endTime}`)
    })
  }
}
</script>

<style scoped>

</style>