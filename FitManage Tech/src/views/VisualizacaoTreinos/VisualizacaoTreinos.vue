<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>

    <div class="containerTitle my-4 mx-8">
      <v-icon color="info" size="42" icon="mdi-weight-lifter"></v-icon>
      <h2>Treinos do Aluno - {{ student_name }}</h2>
    </div>

    <!-- Renderize checkboxes para os treinos do dia atual -->
    <div v-if="currentDayWorkouts.length > 0">
      <div class="d-flex flex-column mx-10">
        <h3>Hoje</h3>
        <v-checkbox v-for="workout in currentDayWorkouts" 
          :key="workout.id" v-model="workout.selected"
          :label="`${workout.exercise_description} | ${workout.weight} kg | ${workout.repetitions} repetições | ${workout.break_time} de pausa`"
          class="mb-n11" 
          @change="handleCheckboxChange(workout)"></v-checkbox>
      </div>
    </div>
    <div v-else>
      <h3 class="mx-10">Não há treinos para o dia atual.</h3>
    </div>

    <div class="d-flex justify-center mb-4">
      <div class="mt-11 mx-2">
        <v-btn class="mx-1" variant="outlined" @click="selectDay(1)" :color="isSelected(1) ? 'info' : ''">Segunda</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(2)" :color="isSelected(2) ? 'info' : ''">Terça</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(3)" :color="isSelected(3) ? 'info' : ''">Quarta</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(4)" :color="isSelected(4) ? 'info' : ''">Quinta</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(5)" :color="isSelected(5) ? 'info' : ''">Sexta</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(6)" :color="isSelected(6) ? 'info' : ''">Sábado</v-btn>
        <v-btn class="mx-1" variant="outlined" @click="selectDay(7)" :color="isSelected(7) ? 'info' : ''">Domingo</v-btn>

        <v-table class="mt-2 mx-2">
          <template v-slot:default>
            <thead>
              <tr>
                <th scope="col" class="text-center">Informações do treino - Selecione o dia da semana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedDayData" :key="item.id">
                <td class="text-left">
                  {{ item.exercise_description }} |
                  {{ item.weight }} kg |
                  {{ item.repetitions }} repetições |
                  {{ item.break_time }} de pausa </td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      selectedDay: null,
      student_id: '',
      student_name: '',
      responseWorkoutsStudent: [],
      selectedDayData: [],
      currentDayWorkouts: [],
    }
  },
  mounted() {
    this.loadViewExercise()
    this.userName = localStorage.getItem('user_name');

    if (!this.userName) {
        this.$router.push('/');
        }
  },
  created() {
    const today = new Date().getDay();
    this.selectedDay = today;
    this.showInfo(today);
  },
  computed: {
    isAnyWorkoutTodays() {
      return this.currentDayWorkouts.length > 0;
    },
  },
  methods: {
    selectDay(day) {
      this.selectedDay = day; // Define o dia selecionado quando um botão é clicado.
      this.showInfo(day); // Chama a função showInfo com o dia selecionado.
    },
    isSelected(day) {
      return this.selectedDay === day; // Verifica se o botão deve estar destacado
    },
    showInfo(selectedDay) {
      // Filtra os dados com base no dia selecionado
      const daysOfWeek = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
      const selectedDayName = daysOfWeek[selectedDay - 1]; // Ajuste para o índice do array

      this.selectedDayData = this.responseWorkoutsStudent.filter(item => {
        return item.day === selectedDayName;
      });
    },
    loadDayWorkouts() {
      const today = new Date().getDay();
      const daysOfWeek = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
      const selectedDayName = daysOfWeek[today - 1];

      this.currentDayWorkouts = this.responseWorkoutsStudent.filter(item => {
        return item.day === selectedDayName;
      }).map(item => {
        item.selected = false;
        return item;
      });
    },
    loadViewExercise() {
      const token = localStorage.getItem('user_token')
      this.student_id = localStorage.getItem('student_id')
      this.student_name = localStorage.getItem('student_name')

      axios({
        url: `http://localhost:3000/workouts?student_id=${this.student_id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearen ${token}`
        }
      })
        .then((response) => {
          this.responseWorkoutsStudent = response.data.workouts

          this.loadDayWorkouts()

          console.log(response.data.workouts);
        })
        .catch(() => {
          alert('Houve uma falha ao carregar as informações.')
        })
    },
    handleCheckboxChange(workout) {
      const today = new Date().getDay();
      const daysOfWeek = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
      const selectedDayName = daysOfWeek[today - 1];

      if (workout.selected) {
        const token = localStorage.getItem('user_token');
        axios({
          url: 'http://localhost:3000/workouts/check',
          method: 'POST',
          data: {
            workout_id: workout.id,
            student_id: this.student_id,
            day_of_week: selectedDayName,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            alert('Treino cadastrado com sucesso.');
          })
          .catch(() => {
            alert('Houve um erro ao marcar o treino.');
          });
      }
    },
  }
}
</script>

<style>
.containerTitle {
  display: flex;
  align-items: center;
  justify-items: start;
  width: 90vw;
}
</style>