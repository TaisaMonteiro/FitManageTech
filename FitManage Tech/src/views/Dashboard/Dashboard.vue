<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-app>
        <h2 class="mt-7 mx-13 pa-3">Bem vindo, {{ userName }}</h2>

        <v-container>
            <v-row class="d-flex pa-3 justify-space-between">
                <v-col cols="5">
                    <v-card>
                        <div class="d-flex py-3 justify-space-between">
                            <div>
                                <v-card-text>
                                    <h3> {{ responseDashboard.amount_students }} Aluno(s) </h3>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn variant="flat" color="success"
                                        :to="{ name: 'GerenciamentoAlunos' }">Adicionar
                                    </v-btn>
                                </v-card-actions>
                            </div>
                                <v-icon color="info" size="70" class="mt-3 mr-2" icon="mdi-account-supervisor"></v-icon>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="5">
                    <v-card>
                        <div class="d-flex py-3 justify-space-between">
                            <div>
                                <v-card-text>
                                    <h3> {{ responseDashboard.amount_exercises }} Exercício(s) </h3>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn variant="flat" color="success"
                                        :to="{ name: 'GerenciamentoExercicio' }">Adicionar
                                    </v-btn>
                                </v-card-actions>
                            </div>
                                <v-icon color="info" size="70" class="mt-3 mr-2" icon="mdi-arm-flex"></v-icon>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>

    <v-snackbar v-model="snackbarError" :timeout="timeout">
        <p>Houve uma falha ao carregar as informações.</p>
        <p>Por favor, atualize a página.</p>

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarError = false">
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
            userName: '',
            responseDashboard: {},

            snackbarError: false,
            timeout: 3500,
        }
    },
    mounted() {
        this.loadDashboard()
        this.userName = localStorage.getItem('user_name');

        if (!this.userName) {
            this.$router.push('/');
            }
    },
    methods: {
        loadDashboard() {
            const token = localStorage.getItem('user_token')

            axios({
                url: 'http://localhost:3000/dashboard',
                method: 'GET',
                headers: {
                    Authorization: `Bearen ${token}`
                }
            })
                .then((response) => {
                    this.responseDashboard = response.data
                })
                .catch(() => {
                    this.snackbarError = true
                })
        },
    }
}
</script>