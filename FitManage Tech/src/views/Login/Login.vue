<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class=" mt-14 mx-13 pa-3">
        <v-form @submit.prevent="handleLogin" class="form-login">

            <v-img 
                :width="252" aspect-ratio="16/9" cover 
                alt="Logotipo da FitManage Tech"
                src="/public/logotipo.png">
            </v-img>

            <div class="input-area">
                <input type="text" placeholder="Digite o e-mail" v-model="email">
                <span class="message-error">{{ this.errors.email }}</span>
            </div>

            <div class="input-area">
                <input type="password" placeholder="Digite a senha" v-model="password">
                <span class="message-error">{{ this.errors.password }}</span>
            </div>

            <button class="buttonLogin" type="submit">Entrar</button>


            <p> Ainda não tem conta? 
                <b><router-link :to="{ name: 'CadastroUsuario' }">Cadastre-se</router-link></b>
            </p>

        </v-form>
    </div>

    <v-snackbar v-model="snackbarSuccessLogin" :timeout="timeout">
        Login efetuado com sucesso.

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbarSuccessLogin = false">
        Fechar
      </v-btn>
    </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorLogin" :timeout="timeout">
        Houve uma falha ao fazer login.

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbarErrorLogin = false">
        Fechar
      </v-btn>
    </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorServer" :timeout="timeout">
        {{ errorServer}}

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackbarErrorServer = false">
        Fechar
      </v-btn>
    </template>
    </v-snackbar>

</template>
  
<script>
import * as yup from 'yup'
import { captureErrorYup } from "../../utils/captureErrorYup";
import axios from 'axios'

export default {
    data() {
        return {
            email: '',
            password: '',

            errors: {},
            errorServer: '',

            snackbarSuccessLogin: false,
            snackbarErrorLogin: false,
            snackbarErrorServer: false,
            timeout: 2000,
        }
    },
    methods: {
        handleLogin() {

            try {
                const schema = yup.object().shape({
                    email: yup.string().email('O e-mail não é válido.').required('O e-mail é obrigatório.'),
                    password: yup.string().required('A senha é obrigatória.'),
                })

                schema.validateSync({
                    email: this.email,
                    password: this.password,
                }, { abortEarly: false })

                axios({
                    url: 'http://localhost:3000/sessions',
                    method: 'POST',
                    data: {
                        email: this.email,
                        password: this.password,
                    }
                })
                    .then((response) => {
                        localStorage.setItem("user_name", response.data.name)
                        localStorage.setItem("user_token", response.data.token)

                        this.snackbarSuccessLogin = true
                        setTimeout(() => {
                            this.$router.push('/dashboard')
                        }, 2000)
                    })
                    .catch((error) => {
                        console.log(error)
                        if (error.response?.data?.error) {
                            this.errorServer = error.response.data.error
                            this.snackbarErrorServer = true
                        } else {
                            this.snackbarErrorLogin = true
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
.form-login {
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
.input-area {
    display: flex;
    flex-direction: column;

    width: 80%;
}

.input-area input {
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
.message-error {
    color: red;
    margin: 4px;
    font-size: small;
}
.buttonLogin {
    background-color: #db1672;
    color: white;

    font-size: 16px;

    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: none;
}
.buttonLogin:hover {
    background-color: #b6125e;
}

a,
p {
    color: #707b88;
    font-size: 14px;
}
</style>
