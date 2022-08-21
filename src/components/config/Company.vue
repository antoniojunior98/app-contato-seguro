<template>
  <div class="GetCompany">
     <a-drawer
    title="Empresas"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
  <div class="row">
    <div class="col-sm-3">
        <button type="button" class="btn btn-dark" @click="showModalInsert"><plus-outlined /></button>
    </div>
    <div class="col-sm-5">
        <a-input class="form-control"  v-model:value="search" @keypress.enter.exact="getCompanies()" placeholder="Buscar..." />
    </div>
  </div>
      <a-modal v-model:visible="visibleInsert" :title="form.id ? 'Atualizar' : 'Inserir'" @ok="handleOk">
        <template #footer>
          <button class="btn btn-dark" v-show="!form.id" @click="clear">Limpar</button>
          <button key="submit" class="btn btn-dark" :loading="loading" style="margin-left: 10px;" html-type="submit" @click="save">Enviar</button>
        </template>
         <a-form>
        <div class="text-muted col-sm-10">
        <a-form-item id="input-group">
          <label>Nome:</label>
          <a-input
            id="input"
            :class="form.nameIsInvalid"
            class="form-control"
            type="text"
            placeholder="Digite o nome da empresa"
            v-model:value="form.name"
          />
          <div class="invalid-feedback">
            {{ form.nameError }}
          </div>
        </a-form-item>
        <a-form-item id="input-group">
          <label>CNPJ:</label>
          <a-input
            id="input"
            :class="form.cnpjIsInvalid"
            class="form-control"
            type="text"
            placeholder="Digite o CNPJ"
            v-model:value="form.cnpj"
          />
          <div class="invalid-feedback">
            {{ form.cnpjError }}
          </div>
        </a-form-item>
        <a-form-item id="input-group">
            <label>Endereço:</label>
            <a-input
                  id="input"
                  :class="form.addressIsInvalid"
                  class="form-control"
                  type="text"
                  placeholder="Digite o endereço"
                  v-model:value="form.address"
                />
              <div class="invalid-feedback">
                {{ form.addressError }}
              </div>
        </a-form-item>
        </div>
        </a-form>
      </a-modal>
      <a-modal v-model:visible="infoCnpj.visible" title="Informações do CNPJ" @ok="handleOk">
        <template #footer></template>
        <p>Situação: {{infoCnpj.situation}}</p>
        <p>Nome da Empresa: {{infoCnpj.name}}</p>
        <p>Fantasia: {{infoCnpj.fantasy}}</p>
        <p>Porte: {{infoCnpj.size}}</p>
        <p>Abertura: {{infoCnpj.opening}}</p>
        <strong>Atividade Principal:</strong>
        <p v-for="activity in infoCnpj.main_activity" :key="activity">{{activity.text}}</p>
         <strong>Atividade Secundarias:</strong>
        <p v-for="activity in infoCnpj.secondary_activity" :key="activity">{{activity.text}}</p>
      </a-modal>
      <a-spin tip="Loading..." :spinning="loading">
     <a-table :dataSource="companies" :columns="columns" :pagination="false" style="margin-top: 10px;">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <button type="button" class="btn btn-dark" @click="edit(record.id)"><form-outlined /></button>
                <button type="button" class="btn btn-dark" @click="del(record.id)" style="margin-top: 5px;"><delete-outlined /></button>
                <button type="button" class="btn btn-dark" @click="checkCnpj(record.cnpj)" style="margin-top: 5px;"><ExclamationCircleOutlined /></button>
            </template>
        </template>
    </a-table>
    </a-spin>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
    </div>
  </a-drawer>
  </div>
</template>

<script>
import { PlusOutlined, FormOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default {
  name: 'GetCompany',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  },
  props: {
    visible: { 
        default: false
    }
  },
  data () {
    return {
        loading: false,
        visibleInsert: false,
        search: [],
        companies: [],
        columns: [
            {
              title: 'Empresa',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'CNPJ',
              dataIndex: 'cnpj',
              key: 'cnpj',
            },
            {
              title: 'Endereço',
              dataIndex: 'address',
              key: 'telephone',
            },
            {
              title: 'Ações',
              dataIndex: 'action',
              key: 'action',
            }
        ],
        form: {
            id: null,
            name: null,
            cnpj: null,
            address: null,
            nameError: '',
            nameIsInvalid: 'form-control',
            cnpjError: '',
            cnpjIsInvalid: 'form-control',
            addressError: '',
            addressIsInvalid: 'form-control',
        },
        infoCnpj: {
            visible: false,
            situation: '',
            name: '',
            fantasy: '',
            size: '',
            opening: '',
            main_activity: [],
            secondary_activity: []
      },
    }
  },
  mounted () {
    this.getCompanies();
  },
  methods: {
    getCompanies() {
      this.loading = true
      this.$axios
        .get('company', {
          params: {
            search: this.search,
          }
        })
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
    showModalInsert () {
      this.clear()
      this.visibleInsert = true;
    },
    edit(id) {
      if(!id){
        return;
      }

      this.loading = true
      this.$axios
        .get('company/'+ id +'/show')
        .then((response) => {
          this.form.id = response.data.id
          this.form.name = response.data.name
          this.form.cnpj = response.data.CNPJ
          this.form.address = response.data.address
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
        .post('company/store', {
          name: this.form.name,
          cnpj: this.form.cnpj,
          address: this.form.address
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Empresa criada com sucesso!'
          })
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possivel criar a empresa'
          })
          
          let errors = error.response.data.errors

          for(error in errors){
            switch (error) {
              case 'name':
                this.form.nameError = errors.name[0]
                this.form.nameIsInvalid = 'form-control is-invalid'
                break;
              case 'cnpj':
                this.form.cnpjError = errors.cnpj[0]
                this.form.cnpjIsInvalid = 'form-control is-invalid'
                break;
              case 'address':
                this.form.addressError = errors.address[0]
                this.form.addressIsInvalid = 'form-control is-invalid'
                break;
              default:
                break;
            }
          }
        })
        .finally(() => {
          this.getCompanies();
          this.loading = false
        })
    },
    update() {
      this.loading = true
      this.$axios
        .put('company/'+this.form.id+'/update', {
          name: this.form.name,
          cnpj: this.form.cnpj,
          address: this.form.address
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Empresa atualizada com sucesso!'
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
              case 'cnpj':
                this.form.cnpjError = errors.cnpj[0]
                this.form.cnpjIsInvalid = 'form-control is-invalid'
                break;
              case 'address':
                this.form.addressError = errors.address[0]
                this.form.addressIsInvalid = 'form-control is-invalid'
                break;
              default:
                break;
            }
          }
        })
        .finally(() => {
          this.getCompanies();
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
            .delete('company/' + id + '/delete')
            .then(() => {
              this.getCompanies()
              this.$swal.fire(
              'Excluido!',
              'Excluido com sucesso.',
              'success'
              )
            })
            .catch((error) => {
              if(error.response.status == 422){
                this.$swal.fire({
                  title: 'Ops!',
                  text: 'Não foi possível excluir a empresa. Porque a mesma está sendo utilizada por alguns usuários da base, Para excluir você precisa retirar esses usuários dessa empresa.',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return;
              }
              this.$swal.fire({
                title: 'Ops!',
                text: 'Não foi possível excluir a empresa. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
            })
          }
      })      
    },
    checkCnpj(cnpj) {
      if(!cnpj){
        return;
      }
      this.$axios
        .get('company/validate_cnpj', {
          params: {
            cnpj: cnpj
          }
        })
        .then((response) => {
          this.infoCnpj.situation = response.data.situation
          this.infoCnpj.name = response.data.name
          this.infoCnpj.fantasy = response.data.fantasy
          this.infoCnpj.size = response.data.size
          this.infoCnpj.opening = response.data.opening
          this.infoCnpj.main_activity = response.data.main_activity
          this.infoCnpj.secondary_activity = response.data.secondary_activity
          this.infoCnpj.visible = true
        })
        .catch((error) => {
          if(error.response.status == 429){
            this.$swal.fire({
            title: 'Ops!',
            text: 'Espere 60 segundos, para consultar novamente!',
            icon: 'error',
            confirmButtonText: 'Ok'
            });
            return
          }
          
          this.$swal.fire({
            title: 'Ops!',
            text: 'Não foi possivel encontrar informações sobre o CNPJ, tente novamente mais tarde.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$emit('onClose')
    },
    clear() {
     this.form = {
        id: null,
        name: null,
        cnpj: null,
        address: null,
        nameError: '',
        nameIsInvalid: 'form-control',
        cnpjError: '',
        cnpjIsInvalid: 'form-control',
        addressError: '',
        addressIsInvalid: 'form-control',
     }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #48bfdb;
}
.home{
  margin-top: 80px;
  margin-bottom: 200px;
}
</style>
