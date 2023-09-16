<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="d-flex align-center mt-7 mx-13 pa-3 "> 
        <v-icon color="info" size="70" class="mt-3 mr-2" icon="mdi-kettlebell"></v-icon>
        <h2 class="mt-5">Exercícios</h2>
    </div>

    <v-form ref="form" @submit.prevent="handleAddExercises">
        <div class="d-flex mx-16 mt-10 pa-sm justify-space-between align-center " style="height: 40px;">

            <v-text-field 
                label="Nome" 
                variant="outlined" 
                v-model="exerciseDescription"
                placeholder="Digite o nome do exerício." 
                required>
            </v-text-field>
            
            <v-btn class="ml-2 mb-5" variant="flat" color="success" type="submit">Cadastrar</v-btn>
        </div>

        <span class="message-error mx-16 mt-n4 mb-5">{{ errorInputExercises }}</span>
    </v-form>

    <div class="d-flex justify-left mx-2 mx-13 pa-3">
        <v-table class="mt-2 mx-2">
            <template v-slot:default>
                <thead>
                <tr>
                    <th scope="col" class="text-left">
                        <h2 style="color: black;"> Quantidade </h2>
                    </th>
                    
                    <th scope="col" class="text-left">
                        <h2 style="color: black;"> Lista de Exercícios </h2>
                    </th>
                </tr>
                </thead>

                <tbody>
                    <tr v-for="exercise in responseExercises" :key="exercise.id">
                        <td class="text-left">{{ exercise.id }}</td>
                        <td class="text-left">{{ exercise.description }}</td>
                    </tr>
                </tbody>
            </template>
        </v-table>
    </div>

    <v-snackbar v-model="snackbarAddExercises" :timeout="timeout">
        Exercício cadastrado com sucesso!

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorServer" :timeout="timeout">
        Houve uma falha ao carregar as informações dos treinos.

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorAddExercises" :timeout="timeout">
        Houve um erro ao realizar o cadastro do exercício.

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
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
            exerciseDescription: '',
            errorInputExercises: '',

            responseExercises: {},

            snackbarAddExercises: false,
            snackbarErrorServer: false,
            snackbarErrorAddExercises: false,
            timeout: 2000,
        }
    },
    mounted() {
        this.loadExercises()
        this.userName = localStorage.getItem('user_name');

        if (!this.userName) {
            this.$router.push('/');
            }
    },
    methods: {
        loadExercises() {
            const token = localStorage.getItem('user_token')

            axios({
                url: 'http://localhost:3000/exercises',
                method: 'GET',
                headers: {
                    Authorization: `Bearen ${token}`
                }
            })
                .then((response) => {
                    this.responseExercises = response.data
                })
                .catch(() => {
                    this.snackbarErrorServer = true
                })
        },
        handleAddExercises() {

            this.errorInputExercises = ''

            if (!this.exerciseDescription) this.errorInputExercises = 'O nome do exercício é obrigatório.'

            if (!this.errorInputExercises) {

                const token = localStorage.getItem('instagram_token')

                axios({
                    url: 'http://localhost:3000/exercises',
                    method: 'post',
                    data: {
                        description: this.exerciseDescription,
                    },
                    headers: {
                        Authorization: `Bearen ${token}`
                    }
                })
                    .then(() => {
                        this.snackbarAddExercises = true
                        this.exerciseDescription = ''
                        this.loadExercises()
                    })
                    .catch(() => {
                        this.snackbarErrorAddExercises = true
                    })
            }
        },
    }
}
</script>

<style scoped>
.message-error {
    color: red;
    font-size: small;
}
</style>