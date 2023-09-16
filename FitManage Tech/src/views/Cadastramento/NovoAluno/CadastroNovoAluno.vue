<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <v-form @submit.prevent="handleCreateNewStudent" class="my-5 form-createNewStudent">

        <div class="d-flex my-3">
            <h2 class="mt-2 mr-2">Cadastro de Aluno</h2>
            <v-icon color="info" size="42" icon="mdi-account-plus-outline"></v-icon>
        </div>

        <div class="form-element">
            <label for="name">Nome Completo:</label>
            <input class="form-input" type="text" id="name" v-model="name">
            <span class="message-error">{{ this.errors.name }}</span>
        </div>

        <div class="form-element">
            <label for="email">E-mail:</label>
            <input class="form-input" type="text" id="email" v-model="email">
            <span class="message-error">{{ this.errors.email }}</span>
        </div>

        <div class="form-element">
            <label for="contact">Contato:</label>
            <input class="form-input" type="text" id="contact" v-model="contact">
            <span class="message-error">{{ this.errors.contact }}</span>
        </div>

        <div class="form-element">
            <label for="date_birth">Data de nascimento:</label>
            <input class="form-input" type="date" id="date_birth" v-model="date_birth">
            <span class="message-error">{{ this.errors.date_birth }}</span>
        </div>

        <div class="form-element">
            <label for="cep">CEP:</label>
            <input class="form-input" type="text" id="cep" v-model="cep" @input="resultDataViaCep">
            <span class="message-error">{{ this.errors.cep }}</span>
        </div>

        <div class="form-element">
            <label for="street">Logradouro:</label>
            <input class="form-input" type="text" id="street" v-model="street">
            <span class="message-error">{{ this.errors.street }}</span>
        </div>

        <div class="form-element">
            <label for="number">Número:</label>
            <input class="form-input" type="number" id="number" v-model="number">
            <span class="message-error">{{ this.errors.number }}</span>
        </div>

        <div class="form-element">
            <label for="neighborhood">Bairro:</label>
            <input class="form-input" type="text" id="neighborhood" v-model="neighborhood">
            <span class="message-error">{{ this.errors.neighborhood }}</span>
        </div>

        <div class="form-element">
            <label for="city">Cidade:</label>
            <input class="form-input" type="text" id="city" v-model="city">
            <span class="message-error">{{ this.errors.city }}</span>
        </div>

        <div class="form-element">
            <label for="province">Estado:</label>
            <input class="form-input" type="text" id="province" v-model="province">
            <span class="message-error">{{ this.errors.province }}</span>
        </div>

        <div class="form-element">
            <label for="complement">Complemento:</label>
            <input class="form-input" type="text" id="complement" v-model="complement">
            <span class="message-error">{{ this.errors.complement }}</span>
        </div>

        <v-btn 
            type="submit" 
            class="buttonCreateNewStudent text-none text-subtitle-1" 
            variant="outlined">
                Cadastrar
        </v-btn>

        <v-btn 
            type="submit" 
            color="red" 
            class="buttonReturn text-none text-subtitle-1" 
            variant="tonal"
            :to="{ name: 'GerenciamentoAlunos' }">
                Voltar
        </v-btn>

    </v-form>

    <v-snackbar v-model="snackbarSuccessCreateNewStudent" :timeout="timeout">
        Aluno cadastrado com sucesso!

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarSuccessCreateNewStudent = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarErrorCreateNewStudent" :timeout="timeout">
        Não foi possível criar a conta nesse momento.

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbarErrorCreateNewStudent = false">
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
            contact: '',
            date_birth: 0,
            cep: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            province: '',
            complement: '',

            errors: {},
            errorServer: '',

            snackbarSuccessCreateNewStudent: false,
            snackbarErrorCreateNewStudent: false,
            snackbarErrorServer: false,
            timeout: 2500,
        }
    },
    mounted() {
        this.userName = localStorage.getItem('user_name');

        if (!this.userName) {
            this.$router.push('/');
            }
    },
    watch: {
        cep: function () {
            this.resultDataViaCep();
        },
    },
    methods: {
        async resultDataViaCep() {
            if (this.cep === "") {

                this.street = '';
                this.neighborhood = '';
                this.city = '';
                this.province = '';
            }
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${this.cep}/json/`);
                const data = response.data;

                this.street = data.logradouro || '';
                this.neighborhood = data.bairro || '';
                this.city = data.localidade || '';
                this.province = data.uf || '';

            } catch (error) {
                console.log(error);
            }
        },
        handleCreateNewStudent() {

            try {

                const schema = yup.object().shape({
                    name: yup.string().required('O nome é obrigatório.'),
                    email: yup.string().email('O e-mail não é válido.'),
                    contact: yup.string().required('O contato é obrigatório.'),
                    date_birth: yup.date().max(new Date(), 'A data não pode ser no futuro'),
                    cep: yup.string().min(8, "O CEP deve ter no mínimo 8 caracteres.").max(9, "O CEP deve ter entre 8-9 caracteres.").required('O CEP é obrigatório.'),
                    street: yup.string().required('O logradouro é obrigatório.'),
                    number: yup.string().required('O número é obrigatório.'),
                    neighborhood: yup.string().required('O bairro é obrigatório.'),
                    city: yup.string().required('A cidade é obrigatória.'),
                    province: yup.string().required('O estado é obrigatório.'),
                })

                schema.validateSync({
                    name: this.name,
                    email: this.email,
                    contact: this.contact,
                    date_birth: this.date_birth,
                    cep: this.cep,
                    street: this.street,
                    number: this.number,
                    neighborhood: this.neighborhood,
                    city: this.city,
                    province: this.province
                }, { abortEarly: false })

                axios({
                    url: 'http://localhost:3000/students',
                    method: 'POST',
                    data: {
                        name: this.name,
                        email: this.email,
                        contact: this.contact,
                        date_birth: this.date_birth,
                        cep: this.cep,
                        street: this.street,
                        number: this.number,
                        neighborhood: this.neighborhood,
                        city: this.city,
                        province: this.province,
                        complement: this.complement,
                    }
                })
                    .then(() => {
                        this.snackbarSuccessCreateNewStudent = true
                        this.name = ''
                        this.email = ''
                        this.contact = ''
                        this.date_birth = 0
                        this.cep = ''
                        this.street = ''
                        this.number = ''
                        this.neighborhood = ''
                        this.city = ''
                        this.province = ''
                        this.complement = ''
                        this.errors = ''
                    })
                    .catch((error) => {
                        console.log(error)
                        if (error.response?.data?.error) {
                            this.errorServer = error.response.data.error
                            this.snackbarErrorServer = true
                        } else {
                            this.snackbarErrorCreateNewStudent = true
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
.form-createNewStudent {
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
.message-error {
    color: red;
    margin: 4px;
    font-size: small;
}

.buttonCreateNewStudent {
    background-color: #4bb4f8;
    color: white;

    font-size: 16px;

    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: none;
}

.buttonCreateNewStudent:hover {
    background-color: #2985c2;
}

.buttonReturn {
    font-size: 16px;

    height: 40px;
    width: 80%;

    border-radius: 8px;
    border: none;
}
</style>