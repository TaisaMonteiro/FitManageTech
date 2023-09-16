import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login/Login.vue'
import CadastroUsuario from '../views/Cadastramento/Usuario/CadastroUsuario.vue'
import Dashboard from '../views/Dashboard/Dashboard.vue'
import GerenciamentoExercicio from '../views/Gerenciamentos/Exercicio/GerenciamentoExercicio.vue'
import GerenciamentoAlunos from '../views/Gerenciamentos/Alunos/GerenciamentoAlunos.vue'
import CadastroNovoAluno from '../views/Cadastramento/NovoAluno/CadastroNovoAluno.vue'
import CadastroTreino from '../views/Cadastramento/Treino/CadastroTreino.vue'
import VisualizacaoTreinos from '../views/VisualizacaoTreinos/VisualizacaoTreinos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/cadastro/usuario',
      name: 'CadastroUsuario',
      component: CadastroUsuario
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/gerenciamento/exercicio',
      name: 'GerenciamentoExercicio',
      component: GerenciamentoExercicio
    },
    {
      path: '/gerenciamento/alunos',
      name: 'GerenciamentoAlunos',
      component: GerenciamentoAlunos
    },
    {
      path: '/cadastro/novoaluno',
      name: 'CadastroNovoAluno',
      component: CadastroNovoAluno
    },
    {
      path: '/cadastro/treino',
      name: 'CadastroTreino',
      component: CadastroTreino
    },
    {
      path: '/visualizacaotreinos',
      name: 'VisualizacaoTreinos',
      component: VisualizacaoTreinos
    },
  ]
})

export default router
