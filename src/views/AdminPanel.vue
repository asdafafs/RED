<script>

  const generateRandomFullName = () => {
    const firstNames = ['Иван', 'Мария', 'Александр', 'Екатерина', 'Дмитрий'];
    const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнова', 'Козлов'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirstName} ${randomLastName}`;
  };

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'ФИО',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      persons: [],
      editedIndex: -1,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: '',
      },
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Новый элемент' : 'Редактировать элемент';
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },

    created() {
      this.initialize();
    },

    methods: {
      initialize() {
        this.persons = Array.from({ length: 10 }, () => ({
          name: generateRandomFullName(),
        }));
      },

      editItem(item) {
        this.editedIndex = this.persons.indexOf(item);
        this.editedItem = { name: item.name };
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.persons.indexOf(item);
        this.editedItem = { name: item.name };
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.persons.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = { name: '' };
          this.editedIndex = -1;
        });
      },

      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = { name: '' };
          this.editedIndex = -1;
        });
      },

      save() {
        if (this.editedIndex > -1) {
          this.$set(this.persons, this.editedIndex, this.editedItem);
        } else {
          this.persons.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<template>
  <v-data-table :headers="headers" :items="persons" class="elevation-1"
               :footer-props="{
      'items-per-page-text': 'Записей на странице:',
      'items-per-page-all-text': 'Все',
      'page-text': '{0}-{1} из {2}',
      'prev-icon': 'mdi-chevron-left', // замените на ваш иконка
      'next-icon': 'mdi-chevron-right', // замените на ваш иконка
      'prev-page-text': 'Предыдущая страница',
      'next-page-text': 'Следующая страница',
      'no-data-text': 'Нет данных для отображения'
    }" no-data-text="Нет данных для отображения"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Новый юзер
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="ФИО"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Сносим?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<style scoped>

</style>