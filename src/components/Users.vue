<template>
<div class="GetUsers">
<div class="row">
        <div class="col-sm-4">
        <button type="button" class="btn btn-dark" @click="showModalInsert"><plus-outlined /></button>
          <a-popover v-model:visible="visible" title="Filtros" trigger="click">
          <template #content>
            <a-select
              v-model:value="selectedCompany"
              mode="multiple"
              :size="size"
              placeholder="Filtrar por Empresa"
              style="width: 200px"
              fieldNames=""
              @change="getUsers()"
              @popupScroll="popupScroll"
            >
              <a-select-option v-for="company in companies" :key="company.id">
                       <p> {{ company.name }}</p>
                      </a-select-option>
            </a-select>
            <br/>
            <a-select
              v-model:value="selectedState"
              mode="multiple"
              :size="size"
              placeholder="Filtrar por Estado"
              style="width: 200px; margin-top: 10px;"
              fieldNames=""
              @change="filterByState()"
              @popupScroll="popupScroll"
            >
              <a-select-option v-for="s in state" :key="s.id">
                       <p> {{ s.name }}</p>
                      </a-select-option>
            </a-select>
            <br/>
            <a-select
              v-model:value="selectedCity"
              mode="multiple"
              :size="size"
              placeholder="Filtrar por Cidade"
              style="width: 200px; margin-top: 10px;"
              fieldNames=""
              @change="getUsers()"
              @popupScroll="popupScroll"
            >
              <a-select-option v-for="c in city" :key="c.id">
                       <p> {{ c.name }}</p>
                      </a-select-option>
            </a-select>
          </template>
          <button type="button" class="btn btn-dark" style="margin-left: 10px;">Filtros</button>
          </a-popover>

           <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1" @click="showCompany()">
            <UserOutlined />
            Empresas
          </a-menu-item>
          <a-menu-item key="2" @click="showState()">
            <UserOutlined />
            Estados
          </a-menu-item>
          <a-menu-item key="3" @click="showCity()">
            <UserOutlined />
            Cidade
          </a-menu-item>
        </a-menu>
      </template>
      <a-button style="height: 40px; margin-left: 10px;" class="btn btn-dark">
        <setting-outlined />
        <DownOutlined />
      </a-button>
    </a-dropdown>

          <company :visible="showDrawerCompany" @onClose="onCloseCompany"></company>
          <state :visible="showDrawerState" @onClose="onCloseState"></state>
          <city :visible="showDrawerCity" @onClose="onCloseCity"></city>

        </div>
        <div class="col-sm-5">
            <a-input class="form-control"  v-model:value="search" @keypress.enter.exact="getUsers()" placeholder="Buscar..." />
        </div>
        <div class="col-sm-2">
          <Multiselect
            v-model="searchIn.selected"
            :options="searchIn.options"
            label="label"
            :track-by="'value'"
          />
        </div>
      </div>
      <a-modal v-model:visible="visibleInsert" :title="form.id ? 'Atualizar' : 'Inserir'" @ok="handleOk">
        <template #footer>
          <button class="btn btn-dark" v-show="!form.id" @click="clear">Limpar</button>
          <button key="submit" class="btn btn-dark" :loading="loading" style="margin-left: 10px;" html-type="submit" @click="save">Enviar</button>
        </template>
        <a-spin tip="Loading..." :spinning="loading">
        <a-form>
        <div class="text-muted col-sm-10">
        <a-form-item id="input-group">
          <label>Nome:</label>
          <a-input
            id="input"
            :class="form.nameIsInvalid"
            class="form-control"
            type="text"
            placeholder="Digite o nome"
            v-model:value="form.name"
          />
          <div class="invalid-feedback">
            {{ form.nameError }}
          </div>
        </a-form-item>
        <a-form-item id="input-group">
          <label>E-mail:</label>
          <a-input
            id="input"
            :class="form.emailIsInvalid"
            class="form-control"
            type="email"
            placeholder="Digite o E-mail"
            v-model:value="form.email"
          />
          <div class="invalid-feedback">
            {{ form.emailError }}
          </div>
        </a-form-item>
         <a-form-item id="input-group">
          <div class="row">
            <div class="col-sm-6">
              <label>Telefone:</label>
                <a-input
                  id="input"
                  :class="form.telephoneIsInvalid"
                  class="form-control"
                  type="number"
                  placeholder="Digite o Telefone"
                  v-model:value="form.telephone"
                />
              <div class="invalid-feedback">
                {{ form.telephoneError }}
              </div>
              </div>
              <div class="col-sm-6">
              <label>Data de nascimento:</label>
                <a-input
                  id="input"
                  :class="form.birthdayIsInvalid"
                  class="form-control"
                  type="date"
                  v-model:value="form.birthday"
                />
              <div class="invalid-feedback">
                {{ form.birthdayError }}
              </div>
            </div>
            </div>
        </a-form-item>
        <a-form-item id="input-group">
          <div class="row">
              <div class="col-sm-6">
              <label>Cidade:</label>
              <a-select
                v-model:value="form.selectedCity"
                :size="size"
                placeholder="Seleciona Cidade"
                style="width: 200px;"
                fieldNames=""
                @popupScroll="popupScroll"
              >
                <a-select-option v-for="c in city" :key="c.id">
                         <p> {{ c.name }}</p>
                        </a-select-option>
              </a-select>
            </div>
            </div>
        </a-form-item>
        <a-form-item id="input-group">
               <a-select
              v-model:value="form.selectedCompany"
              mode="multiple"
              :class="form.companiesIsInvalid"
              :size="size"
              placeholder="Seleciona Empresa"
              style="width: 250px"
              fieldNames=""
              @change="getUsers()"
              @popupScroll="popupScroll"
            >
              <a-select-option v-for="company in companies" :key="company.id">
                       <p> {{ company.name }}</p>
                      </a-select-option>
            </a-select>
            <div class="invalid-feedback">
                {{ form.companiesError }}
              </div>
        </a-form-item>
        </div>
        </a-form>
        </a-spin>
      </a-modal>
      <a-modal v-model:visible="visibleInfo" title="Informações do CNPJ" @ok="handleOk">
        <template #footer></template>
        <p>Nome: {{form.name}}</p>
        <p>E-mail: {{form.email}}</p>
        <p>Telefone: {{form.telephone}}</p>
        <p>Nascimento: {{form.birthday}}</p>
        <p>Cidade: {{form.selectedCity}}</p>
        <strong>Empresas:</strong>
        <p v-for="company in form.selectedCompany" :key="company">{{company.name}}</p>
      </a-modal>
      <a-spin tip="Loading..." :spinning="loading">
      
              <a-table :dataSource="users" :columns="columns" :pagination="false" style="margin-top: 10px;">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <button type="button" class="btn btn-dark" @click="edit(record.id)"><form-outlined /></button>
                <button type="button" class="btn btn-dark" @click="del(record.id)" style="margin-left: 10px;"><delete-outlined /></button>
                 <button type="button" class="btn btn-dark" @click="show(record.id)" style="margin-left: 10px;"><ExclamationCircleOutlined /></button>
            </template>
          </template>
        </a-table>
      </a-spin>
        <nav id="pagination" aria-label="..." style="margin-top: 15px;">
          <ul class="pagination">
            <li class="page-item" :class="{disabled: current_page == 1}">
              <a class="page-link" href="#"
                @click="backPage()">Anterior</a
              >
            </li>
            <li v-for="page in pages" :key="page" class="page-item" :class="{active: current_page == page}">
              <a class="page-link" @click="getUsers(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{disabled: current_page == last_page}">
              <a class="page-link" href="#"  @click="nextPage()">Próximo</a>
            </li>
          </ul>
        </nav>
        
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import { PlusOutlined, FormOutlined, DeleteOutlined, SettingOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import Company from './config/Company.vue';
import State from './config/State.vue';
import City from './config/City.vue';

export default {
  name: 'GetUsers',
  components: {
    Multiselect,
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    SettingOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    Company,
    State,
    City
},
  data() {
    return {
      visibleInsert: false,
      visibleInfo: false,
      visible: false,
      loading: false,
      showDrawerCompany: false,
      showDrawerState: false,
      showDrawerCity: false,
      pages: null,
      current_page: null,
      last_page: null,
      search: null,
      searchIn: {
        selected: 'name',
        options:[
          {
            label: 'Nome',
            value: 'name',
          },
          {
            label: 'Email',
            value: 'email',
          },
          {
            label: 'Telefone',
            value: 'telephone',
          },
        ]
      },      
      users: [],
      columns: [
        {
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'E-mail',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Telefone',
          dataIndex: 'telephone',
          key: 'telephone',
        },
        {
          title: 'Nascimento',
          dataIndex: 'birthday',
          key: 'birthday',
        },
        {
          title: 'Cidade',
          dataIndex: 'city',
          key: 'city',
        },
        {
          title: 'Ações',
          dataIndex: 'action',
          key: 'action',
        }
      ],
      form: {
        id: null,
        selectedCity: null,
        selectedCompany: [],
        name: null,
        email: null,
        telephone: null,
        birthday: null,
        nameError: '',
        nameIsInvalid: 'form-control',
        emailError: '',
        emailIsInvalid: 'form-control',
        telephoneError: '',
        telephoneIsInvalid: 'form-control',
        birthdayError: '',
        birthdayIsInvalid: 'form-control',
        cityError: '',
        cityIsInvalid: 'form-control',
        companiesError: '',
        companiesIsInvalid: 'form-control'
      },
      companies: [],
      selectedCompany: [],
      state: [],
      selectedState: [],
      city: [],
      selectedCity: [],
      errorMessage: {
        title: {
          required: 'O campo nome é obrigatorio!',
        },
        description: {
          required: 'O campo descrição é obrigatorio!',
          min: 'A Descrição deve conter pelo menos 10 caracteres!'
        }, 
        delivery_date: {
          required: 'O campo descrição é obrigatorio!'
        }
      },
    }
  },
   methods: {
    getUsers(page = 1) {
      this.loading = true
      this.$axios
        .post('users?page=' + page, {
          search: this.search,
          search_in: this.searchIn.selected,
          company: this.selectedCompany,
          state: this.selectedState,
          city: this.selectedCity
        })
        .then((response) => {
          this.users = response.data.data
          this.pages = response.data.last_page
          this.current_page = response.data.current_page
          this.last_page = response.data.last_page
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });  
        })
        .finally(() => {
          this.loading = false
        })
    },
    backPage() {
      let page = this.current_page-1 
      this.getUsers(page)
    },
    nextPage() {
      let page = this.current_page+1 
      this.getUsers(page)
    },
    edit(id) {
      if(!id){
        return;
      }

      this.loading = true
      this.$axios
        .get('user/'+ id +'/show')
        .then((response) => {
          this.form.id = response.data.id
          this.form.name = response.data.name
          this.form.email = response.data.email
          this.form.telephone = response.data.telephone
          this.form.birthday = response.data.birthday
          this.form.selectedCity = response.data.city_id;
          this.form.selectedCompany = response.data.companies.map(function(company){
            return company.id;
          });
          this.getCompanies();
          this.getCity();
          this.visibleInsert = true;
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });  
        })
        .finally(() => {
          this.loading = false
        })
    },
    show(id) {
      if(!id){
        return;
      }

      this.loading = true
      this.$axios
        .get('user/'+ id +'/show')
        .then((response) => {
          this.form.id = response.data.id
          this.form.name = response.data.name
          this.form.email = response.data.email
          this.form.telephone = response.data.telephone
          this.form.birthday = response.data.birthday
          this.form.selectedCity = response.data.city.name
          this.form.selectedCompany = response.data.companies
          this.visibleInfo = true;
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });  
        })
        .finally(() => {
          this.loading = false
        })
    },
    save(event){
      event.preventDefault()
      if(this.form.id){
        this.update();
      } else{
        this.add();
      }
    },
    add() {
      this.loading = true
      this.$axios
        .post('user/store', {
          name: this.form.name,
          email: this.form.email,
          telephone: this.form.telephone,
          birthday: this.form.birthday,
          companies: this.form.selectedCompany,
          city: this.form.selectedCity
        })
        .then(() => {
          this.clear()
          this.$toast.fire({
            icon: 'success',
            title: 'Usuário criado com sucesso!'
          })
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possivel criar o usuário'
          })
          
          let errors = error.response.data.errors

          for(error in errors){
            switch (error) {
              case 'name':
                this.form.nameError = errors.name[0]
                this.form.nameIsInvalid = 'form-control is-invalid'
                break;
              case 'email':
                this.form.emailError = errors.email[0]
                this.form.emailIsInvalid = 'form-control is-invalid'
                break;
              case 'telephone':
                this.form.telephoneError = errors.telephone[0]
                this.form.telephoneIsInvalid = 'form-control is-invalid'
                break;
              case 'birthday':
                this.form.birthdayError = errors.birthday[0]
                this.form.birthdayIsInvalid = 'form-control is-invalid'
                break;
              case 'companies':
                this.form.companiesError = errors.companies[0]
                this.form.companiesIsInvalid = 'is-invalid'
                break;
              default:
                break;
            }
          }
        })
        .finally(() => {
          this.getUsers();
          this.loading = false
        })
    },
    update() {
      this.loading = true
      this.$axios
        .put('user/'+this.form.id+'/update', {
          name: this.form.name,
          email: this.form.email,
          telephone: this.form.telephone,
          birthday: this.form.birthday,
          companies: this.form.selectedCompany,
          city: this.form.selectedCity
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Usuário atualizado com sucesso!'
          })
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possivel salvar!'
          })

          let errors = error.response.data.errors

          for(error in errors){
            switch (error) {
              case 'name':
                this.form.nameError = errors.name[0]
                this.form.nameIsInvalid = 'form-control is-invalid'
                break;
              case 'email':
                this.form.emailError = errors.email[0]
                this.form.emailIsInvalid = 'form-control is-invalid'
                break;
              case 'telephone':
                this.form.telephoneError = errors.telephone[0]
                this.form.telephoneIsInvalid = 'form-control is-invalid'
                break;
              case 'birthday':
                this.form.birthdayError = errors.birthday[0]
                this.form.birthdayIsInvalid = 'form-control is-invalid'
                break;
              case 'companies':
                this.form.companiesError = errors.companies[0]
                this.form.companiesIsInvalid = 'is-invalid'
                break;
              default:
                break;
            }
          }
        })
        .finally(() => {
          this.getUsers();
          this.loading = false
        })
    },
    getCompanies() {
      this.loading = true
      this.$axios
        .get('company')
        .then((response) => {
          this.companies = response.data
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });  
        })
        .finally(() => {
          this.loading = false
        })
    },
    getState() {
      this.loading = true
      this.$axios
        .get('state')
        .then((response) => {
          this.state = response.data
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });  
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCity() {
      this.loading = true
      this.$axios
        .get('city', {
          params: {
            state: this.selectedState
          }
        })
        .then((response) => {
          this.city = response.data
        })
        .catch(() => {
            this.$swal.fire({
                title: 'Ops!',
                text: 'Ocorreu um erro inesperado. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
            });        
        })
        .finally(() => {
          this.loading = false
        })
    },
    del(id) {
      this.$swal.fire({
        title: 'Tem certeza?',
        text: "Você não será capaz de reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!'
      }).then((result) => {
          if (result.isConfirmed) {
            this.$axios
            .delete('user/' + id + '/delete')
            .then(() => {
              this.getUsers(this.current_page)
              this.$swal.fire(
              'Excluido!',
              'Excluido com sucesso.',
              'success'
              )
            })
            .catch(() => {
              this.$swal.fire({
                title: 'Ops!',
                text: 'Não foi excluir o usuário. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
            })
          }
      })      
    },
    filterByState() {
      this.getCity();
      this.getUsers();
    },
    showModalInsert () {
      this.clear();
      this.getCompanies();
      this.getCity();
      this.visibleInsert = true;
    },
    showCompany () {
      this.showDrawerCompany = true;
    },
    onCloseCompany() {
      this.showDrawerCompany = false
    },
    showState () {
      this.showDrawerState = true;
    },
    onCloseState() {
      this.showDrawerState = false
    },
    showCity () {
      this.showDrawerCity = true;
    },
    onCloseCity() {
      this.showDrawerCity = false
    },
    hide () {
      this.visible = false;
    },
    clear() {
     this.form = {
        id: null,
        selectedCity: null,
        selectedCompany: [],
        name: null,
        email: null,
        telephone: null,
        birthday: null,
        nameError: '',
        nameIsInvalid: 'form-control',
        emailError: '',
        emailIsInvalid: 'form-control',
        telephoneError: '',
        telephoneIsInvalid: 'form-control',
        birthdayError: '',
        birthdayIsInvalid: 'form-control',
        cityError: '',
        cityIsInvalid: 'form-control',
        companiesError: '',
        companiesIsInvalid: ''
      }
    },
  },
  mounted () {
    this.getUsers()
    this.getCompanies()
    this.getState()
    this.getCity()
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
