<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <v-form @submit.prevent="handleCreateAccount" class="my-5 form-createAccount">

        <v-img :width="252" aspect-ratio="16/9" cover 
        alt="Logotipo da FitManage Tech" 
        src="/public/logotipo.png"></v-img>

        <h2 class="my-3">Crie sua conta</h2>

        <div class="form-element">
            <label for="name">Nome:</label>
            <input class="form-input" type="text" id="name" v-model="name">
            <span class="message-error">{{ this.errors.name }}</span>
        </div>

        <div class="form-element">
            <label for="email">E-mail:</label>
            <input class="form-input" type="text" id="email" v-model="email">
            <span class="message-error">{{ this.errors.email }}</span>
        </div>

        <div class="form-element">
            <label for="password">Senha:</label>
            <input class="form-input" type="password" id="password" v-model="password">
            <span class="message-error">{{ this.errors.password }}</span>
        </div>

        <div class="form-element">
            <label for="confirmPassword">Confirme a senha:</label>
            <input class="form-input" type="password" id="confirmPassword" v-model="confirmPassword">
            <span class="message-error">{{ this.errors.confirmPassword }}</span>
        </div>

        <div class="form-element">
            <label for="type_plan">Qual plano?</label>
            <select class="form-select" id="type_plan" v-model="type_plan">
                <option value="bronze">Bronze</option>
                <option value="silver">Prata</option>
                <option value="gold">Ouro</option>
            </select>
        </div>

        <v-btn 
            type="submit" 
            class="buttonCreateAccount text-none text-subtitle-1" 
            variant="outlined">
                Cadastrar
        </v-btn>

        <v-btn 
            type="submit" 
            color="red" 
            class="buttonLogoff text-none text-subtitle-1" 
            variant="tonal"
            :to="{ name: 'Login' }">
                Voltar
        </v-btn>
    </v-form>

    <v-snackbar v-model="snackbarSuccessCreateAccount" :timeout="timeout">
        Usuário cadastrado com sucesso.

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarSuccessCreateAccount = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorCreateAccount" :timeout="timeout">
        Não foi possível criar a conta nesse momento.

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarErrorCreateAccount = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorServer" :timeout="timeout">
        {{ errorServer }}

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarErrorServer = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>
</template>
  
<script>
import * as yup from 'yup'
import { captureErrorYup } from "../../../utils/captureErrorYup";
import axios from 'axios'

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            type_plan: 'bronze',

            errors: {},
            errorServer: '',

            snackbarSuccessCreateAccount: false,
            snackbarErrorCreateAccount: false,
            snackbarErrorServer: false,
            timeout: 2000,
        }
    },
    mounted() {
        this.userName = localStorage.getItem('user_name');

        if (!this.userName) {
            this.$router.push('/');
            }
    },
    methods: {
        handleCreateAccount() {

            try {

                const schema = yup.object().shape({
                    name: yup.string().required('O nome é obrigatório.'),
                    email: yup.string().email('O e-mail não é válido.').required('O e-mail é obrigatório.'),
                    password: yup.string().min(8, "A senha deve ter no mínimo 8 caracteres.").max(20, "A senha deve ter entre 8-20 caracteres.").required('A senha é obrigatória.'),
                    confirmPassword: yup.string().required('A confirmação da senha é necessária.').oneOf([yup.ref('password')], 'As senhas devem coincidir.'),
                    type_plan: yup.string().required('O plano é obrigatório.'),
                })

                schema.validateSync({
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    confirmPassword: this.confirmPassword,
                    type_plan: this.type_plan,
                }, { abortEarly: false })

                axios({
                    url: 'http://localhost:3000/users',
                    method: 'POST',
                    data: {
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        type_plan: this.type_plan,
                    }
                })
                    .then(() => {
                        this.snackbarSuccessCreateAccount = true
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 2000)
                    })
                    .catch((error) => {
                        console.log(error)
                        if (error.response?.data?.error) {
                            this.errorServer = error.response.data.error
                            this.snackbarErrorServer = true
                        } else {
                            this.snackbarErrorCreateAccount = true
                        }
                    })
            } catch (error) {
                if (error instanceof yup.ValidationError) {
                    this.errors = captureErrorYup(error)
                }
            }
        },
    },
}
</script>
  
<style scoped>
.form-createAccount {
    margin: 0 auto;
    width: 40%;

    border-radius: 4px;
    border: 2px solid #f2f2f2;

    display: flex;
    flex-direction: column;
    gap: 16px;

    align-items: center;
    padding: 12px;
}

.form-element {
    display: flex;
    flex-direction: column;

    width: 80%;
}

.form-element input {
    width: 100%;
}

input {
    background-color: #fafafa;
    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: 1px solid #f2f2f2;

    outline: none;
}

.form-select {
    height: 40px;
    background-color: #fafafa;
    width: 100%;

    border-radius: 8px;
    border: 1px solid #f2f2f2;

    outline: none;
}

.message-error {
    color: red;
    margin: 4px;
    font-size: small;
}

.buttonCreateAccount {
    background-color: #db1672;
    color: white;

    font-size: 16px;

    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: none;
}

.buttonCreateAccount:hover {
    background-color: #b6125e;
}

.buttonLogoff {
    font-size: 16px;

    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: none;
}

a,
p {
    color: #707b88;
    font-size: 14px;
}</style>
