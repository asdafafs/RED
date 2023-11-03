<template>
    <JqxScheduler ref="myScheduler"
        :width="getWidth" :height="600" :source="dataAdapter" :date="date" :showLegend="true" :view="'weekView'"
        :appointmentDataFields="appointmentDataFields" :resources="resources" :views="views" :localization="localization"
    />
</template>
<script>
    import JqxScheduler from 'jqwidgets-scripts/jqwidgets-vue3/vue_jqxscheduler.vue';
    export default {
        components: {
            JqxScheduler
        },
        data: function () {
            return {
                getWidth: '100%',
                date: new jqx.date(),
                appointmentDataFields:
                {
                    from: 'start',
                    to: 'end',
                    id: 'id',
                    description: 'description',
                    location: 'location',
                    subject: 'subject',
                    resourceId: 'calendar'
                },
                resources:
                {
                    colorScheme: 'scheme05',
                    dataField: 'calendar',
                    source: new jqx.dataAdapter(this.source)
                },
                views:
                [
                    { type: 'dayView', timeRuler: { formatString: 'HH:mm' } },
                    { type: 'weekView', timeRuler: { formatString: 'HH:mm' } },
                    { type: 'monthView' }

                ]
              ,
                localization:
                    {
                      // separator of parts of a date (e.g. '/' in 11/05/1955)
                      '/': '/',
                      // separator of parts of a time (e.g. ':' in 05:44 PM)
                      ':': ':',
                      // the first day of the week (0 = Sunday, 1 = Monday, etc)
                      firstDay: 1,
                      days: {
                        // full day names
                        names: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                        // abbreviated day names
                        namesAbbr: ['Вс', 'Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Суб'],
                        // shortest day names
                        namesShort: ['Вс', 'Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Суб']
                      },
                      months: {
                        // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
                        names: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', ''],
                        // abbreviated month names
                        namesAbbr: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', '']
                      },
                      dayViewString: 'День',
                      weekViewString: 'Неделя',
                      monthViewString: 'Месяц',

                      editDialogCreateTitleString: 'Создать новую встречу',
                      contextMenuCreateAppointmentString: 'Создать новую встречу',
                      editDialogTimeZoneString: 'Временной пояс',
                      editDialogSelectTimeZoneString: 'Выберите временной пояс',
                      editDialogSubjectString: 'Название',
                      editDialogLocationString: 'Расположение',
                      editDialogFromString: 'От',
                      editDialogToString: 'До',
                      editDialogAllDayString: 'Весь день',
                      editDialogRepeatString: 'Повторить',
                      editDialogDescriptionString: 'Описание',
                      editDialogColorString: 'Цвет',
                      editDialogColorPlaceHolderString: 'Выберите цвет',
                      editDialogRepeatNeverString: 'Никогда',
                      editDialogRepeatDailyString: 'Ежедневно',
                      editDialogRepeatWeeklyString: 'Еженедельно',
                      editDialogRepeatMonthlyString: 'Ежемесячно',
                      editDialogRepeatYearlyString: 'Ежегодно',
                      editDialogStatusString: 'Статус встречи',
                      editDialogStatuses:
                    {
                        free: 'Свободный',
                        tentative: 'Тестовый',
                        busy: 'Занят',
                        outOfOffice: 'Типа отменено'
                    },
                      editDialogResourceIdString:'Владелец',
                      editDialogSaveString: 'Сохранить',
                      editDialogCancelString: 'Отменить',
                    }
            }
        },
        beforeCreate: function () {
            const generateAppointments =  function () {
                const appointments = new Array();
                const appointment1 = {
                    id: 'id1',
                    description: 'George brings projector for presentations.',
                    location: '',
                    subject: 'Quarterly Project Review Meeting',
                    calendar: 'Room 1',
                    start: new Date(2023, 11, 3, 9, 0, 0),
                    end: new Date(2023, 11, 3, 16, 0, 0)
                };
                const appointment2 = {
                    id: 'id2',
                    description: '',
                    location: '',
                    subject: 'IT Group Mtg.',
                    calendar: 'Room 2',
                    start: new Date(2023, 11, 3, 10, 0, 0),
                    end: new Date(2023, 11, 3, 15, 0, 0)
                };
                const appointment3 = {
                    id: 'id3',
                    description: '',
                    location: '',
                    subject: 'Course Social Media',
                    calendar: 'Room 3',
                    start: new Date(2023, 11, 3, 11, 0, 0),
                    end: new Date(2023, 11, 3, 13, 0, 0)
                };
                const appointment4 = {
                    id: 'id4',
                    description: '',
                    location: '',
                    subject: 'New Projects Planning',
                    calendar: 'Room 2',
                    start: new Date(2023, 11, 23, 16, 0, 0),
                    end: new Date(2023, 11, 23, 18, 0, 0)
                };
                const appointment5 = {
                    id: 'id5',
                    description: '',
                    location: '',
                    subject: 'Interview with James',
                    calendar: 'Room 1',
                    start: new Date(2023, 11, 25, 15, 0, 0),
                    end: new Date(2023, 11, 25, 17, 0, 0)
                };
                const appointment6 = {
                    id: 'id6',
                    description: '',
                    location: '',
                    subject: 'Interview with Nancy',
                    calendar: 'Room 4',
                    start: new Date(2023, 11, 26, 14, 0, 0),
                    end: new Date(2023, 11, 26, 16, 0, 0)
                };
                appointments.push(appointment1);
                appointments.push(appointment2);
                appointments.push(appointment3);
                appointments.push(appointment4);
                appointments.push(appointment5);
                appointments.push(appointment6);
                return appointments;
            }
            this.source =
                {
                    dataType: 'array',
                    dataFields: [
                        { name: 'id', type: 'string' },
                        { name: 'description', type: 'string' },
                        { name: 'location', type: 'string' },
                        { name: 'subject', type: 'string' },
                        { name: 'calendar', type: 'string' },
                        { name: 'start', type: 'date' },
                        { name: 'end', type: 'date' }
                    ],
                    id: 'id',
                    localData: generateAppointments()
                };
            this.dataAdapter = new jqx.dataAdapter(this.source);
        },
        mounted: function () {
            this.$refs.myScheduler.ensureAppointmentVisible('id1');
        }
    }
</script>