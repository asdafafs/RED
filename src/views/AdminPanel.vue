<script>
  export default {
    data: () => ({
      test: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: 'ID', align: 'start', sortable: false, value: 'id' },
        {text: 'Имя', align: 'start', sortable: false, value: 'name' },
        {text: 'Фамилия', align: 'start', sortable: false, value: 'surname',},
        {text: 'Отчество', align: 'start', sortable: false, value: 'lastName',},
        {text: 'Действия', value: 'actions', sortable: false },
      ],
      persons: [],
      editedIndex: -1,
      deletedIndex: -1,
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
      async initialize() {
          const requestTest = {
            method: 'GET',
            headers: {'accept': 'text/plain'},
            query: 'Id=?'
          }

          this.test = await fetch('http://localhost:5105/api/User?Id=1', requestTest);
          let cal = await this.test.json()
          // console.log( cal)

        this.persons = cal;
      },

      editItem(item) {
        this.editedIndex = this.persons.indexOf(item);
        this.editedItem = {
          name: item.name,
          surname: item.surname,
          lastName: item.lastName,
          id: item.id,
        };

        this.dialog = true;
        console.log(this.editedItem)
      },

      deleteItem(item) {
        this.editedIndex = this.persons.indexOf(item);
        this.editedItem = { name: item.name };
        this.deletedIndex = item.id
        this.dialogDelete = true;
      },

      async deleteItemConfirm() {
        this.persons.splice(this.editedIndex, 1);
        this.closeDelete();
        const requestTest = {
          method: 'DELETE',
          headers: {'accept': 'text/plain', 'Content-Type' : 'application/json'},
          body: JSON.stringify({"id": this.deletedIndex})
        };
        await fetch('http://localhost:5105/api/User', requestTest)
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

      async save() {
        if (this.editedIndex > -1) {
          this.$set(this.persons, this.editedIndex, this.editedItem);
          const requestTest = {
          method: 'PUT',
          headers: {'accept': 'text/plain', 'Content-Type' : 'application/json'},
          body: JSON.stringify(this.editedItem,)
          }
          await fetch('http://localhost:5105/api/User', requestTest)
          this.close();
          console.log(0)
        }
        else {
          this.persons.push(this.editedItem);
          const requestTest = {
            method: 'POST',
            headers: {'accept': 'text/plain', 'Content-Type' : 'application/json'},
            body: JSON.stringify({
              "name" : this.editedItem.name,
              "surname" : this.editedItem.surname,
              "lastname": this.editedItem.lastName,
              "vkid": 0,
              "groupId": 2
            })
          }
          await fetch('http://localhost:5105/api/User', requestTest)
          this.close();
          console.log(1)
        }
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
      'prev-icon': 'mdi-chevron-left',
      'next-icon': 'mdi-chevron-right',
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
                      label="Имя"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.surname"
                      label="Фамилия"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Отчество"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.id"
                      label="ID"
                      v-if="formTitle !== 'Новый элемент'"
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
                Отмена
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Сносим?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
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