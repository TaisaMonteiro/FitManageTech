<template>
    <v-layout>
        <v-app-bar color="pink" v-if="viewAppNavigation">
            <v-app-bar-title>
                <b>Lab Treinos</b>
            </v-app-bar-title>

            <v-btn variant="outlined" :to="{ name: 'Dashboard' }">Dashboard</v-btn>
            <v-btn class="mx-1" variant="outlined" :to="{ name: 'GerenciamentoExercicio' }">Exercícios</v-btn>
            <v-btn variant="outlined" :to="{ name: 'GerenciamentoAlunos' }">Alunos</v-btn>
            <v-btn class="mx-1" variant="outlined" :to="{ name: 'Login' }">Sair</v-btn>
        </v-app-bar>

        <v-main>
            <router-view> </router-view>
        </v-main>
    </v-layout>
</template>

<script>
export default {
    computed: {
        viewAppNavigation() {
            return this.$route.path !== '/' && this.$route.path !== '/cadastro/usuario'
        }
    }
}
</script>