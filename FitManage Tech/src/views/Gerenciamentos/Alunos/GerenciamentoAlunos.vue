<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="d-flex align-center mt-7 mx-13 pa-3 ">
    <v-icon color="info" size="70" class="mt-3 mr-2" icon="mdi-account-supervisor"></v-icon>
    <h2 class="mt-5">Alunos</h2>
    <v-btn 
        class="ml-auto mt-5" 
        variant="flat" 
        color="orange" 
        type="submit"
        :to="{ name: 'CadastroNovoAluno' }">
        Novo
    </v-btn>
  </div>

  <v-form ref="form">
    <div class="d-flex mx-16 mt-10 pa-sm justify-space-between align-center " style="height: 40px;">

      <v-text-field 
        label="Nome" 
        variant="outlined" 
        v-model="studentSearch" 
        placeholder="Digite o nome do aluno."
        required>
      </v-text-field>
    </div>
  </v-form>

  <div class=" d-flex justify-center pa-3">
    <v-table class="mt-2">
      <template v-slot:default>
        <thead>
          <tr>
            <th scope="col" class="text-center">
              <h2 style="color: black;"> Nome </h2>
            </th>

            <th scope="col" class="text-center">
              <h2 style="color: black;"> Ações </h2>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="responseStudent in filteredStudents" :key="responseStudent.id">
            <td class="text-left" style="width: 30vw;">{{ responseStudent.name }}</td>
            <td class="text-left" style="width: 30vw;">
              <v-btn 
                variant="tonal" 
                color="teal"
                @click="() => createExercise(responseStudent.id, responseStudent.name)">
                Montar Treino
              </v-btn>

              <v-btn 
                variant="tonal" 
                color="teal" 
                class="ml-7"
                @click="() => showExercise(responseStudent.id, responseStudent.name)">
                Ver
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>

  <v-snackbar v-model="snackbarErrorServer" :timeout="timeout">
    Houve uma falha ao carregar as informações.

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbarErrorServer = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      studentSearch: '',
      responseStudents: [],

      snackbarErrorServer: false,
      timeout: 3000,
    }
  },
  mounted() {
    this.loadStudents()
    this.userName = localStorage.getItem('user_name');

        if (!this.userName) {
            this.$router.push('/');
            }
    },
  computed: {
    filteredStudents() {
      // Filtrar os alunos com base no valor de studentSearch
      const searchTerm = this.studentSearch.trim().toLowerCase()
      return this.responseStudents.filter(student => {
        return student.name.toLowerCase().includes(searchTerm)
      })
    },
  },
  methods: {
    loadStudents() {
      const token = localStorage.getItem('user_token')

      axios({
        url: 'http://localhost:3000/students',
        method: 'GET',
        headers: {
          Authorization: `Bearen ${token}`
        }
      })
        .then((response) => {
          this.responseStudents = response.data.students
        })
        .catch(() => {
          this.snackbarErrorServer = true
        })
    },
    createExercise(id, name) {
      localStorage.setItem("student_id", id)
      localStorage.setItem("student_name", name)

      this.$router.push('/cadastro/treino')
    },
    showExercise(id, name) {
      localStorage.setItem("student_id", id)
      localStorage.setItem("student_name", name)

      this.$router.push('/visualizacaotreinos')
    },
  }
}
</script>