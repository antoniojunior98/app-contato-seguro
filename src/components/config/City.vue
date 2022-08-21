<template>
  <div class="GetCity">
    <a-drawer
    title="Cidade"
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
        <a-input class="form-control"  v-model:value="search" @keypress.enter.exact="getCity()" placeholder="Buscar..." />
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
            placeholder="Digite o nome do estado"
            v-model:value="form.name"
          />
          <div class="invalid-feedback">
            {{ form.nameError }}
          </div>
        </a-form-item>
        <a-form-item id="input-group">
            <a-select
              v-model:value="form.selectedState"
              :size="size"
              placeholder="Selecionar Estado"
              style="width: 200px; margin-top: 10px;"
              fieldNames=""
              @change="filterByState()"
              @popupScroll="popupScroll"
            >
              <a-select-option v-for="s in state" :key="s.id">
                       <p> {{ s.name }}</p>
                      </a-select-option>
            </a-select>
        </a-form-item>
        </div>
        </a-form>
        </a-spin>
      </a-modal>
     <a-spin tip="Loading..." :spinning="loading">
     <a-table :dataSource="city" :columns="columns" :pagination="false" style="margin-top: 10px;">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <button type="button" class="btn btn-dark" @click="edit(record.id, record.name)"><form-outlined /></button>
                <button type="button" class="btn btn-dark" @click="del(record.id)" style="margin-left: 10px;"><delete-outlined /></button>
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
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export default {
  name: 'GetCity',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined
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
        city: [],
        state: [],
        columns: [
            {
              title: 'Cidade',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Estado',
              dataIndex: 'state',
              key: 'state',
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
            selectedState: null,
            nameError: '',
            nameIsInvalid: 'form-control',
            state_idError: '',
            state_idIsInvalid: 'form-control',
        },
    }
  },
  watch: {
    'visible'(newValue) {
      if(newValue){
        this.getCity();
        this.getState();
      }
    }
  },
  mounted () {
    this.getCity();
    this.getState();
  },
  methods: {
    getCity() {
      this.loading = true
      this.$axios
        .get('city', {
          params: {
            search: this.search,
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
        .get('city/'+ id +'/show')
        .then((response) => {
          this.form.id = response.data.id
          this.form.name = response.data.name
          this.form.selectedState = response.data.state_id

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
        .post('city/store', {
          name: this.form.name,
          state_id: this.form.selectedState
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Cidade criada com sucesso!'
          })
          this.clear();
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possível adicionar a cidade.'
          })
          
          let errors = error.response.data.errors
          if(errors.name){
            this.form.nameError = errors.name[0]
            this.form.nameIsInvalid = 'form-control is-invalid'
          }
          if(errors.state_id){
            this.form.state_idError = errors.state_id[0]
            this.form.state_idIsInvalid = 'form-control is-invalid'
          }
        })
        .finally(() => {
          this.getCity();
          this.loading = false
        })
    },
    update() {
      this.loading = true
      this.$axios
        .put('city/'+this.form.id+'/update', {
          name: this.form.name,
           state_id: this.form.selectedState
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Estado atualizado com sucesso!'
          })
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possivel salvar!'
          })

          let errors = error.response.data.errors

          if(errors.name){
            this.form.nameError = errors.name[0]
            this.form.nameIsInvalid = 'form-control is-invalid'
          }
        })
        .finally(() => {
          this.getCity();
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
            .delete('city/' + id + '/delete')
            .then(() => {
              this.getCity()
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
                  text: 'Não foi possível excluir a cidade. Porque a mesma está sendo utilizada por alguns usuários da base, Para excluir você precisa retirar esses usuários dessa cidade.',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return;
              }
              this.$swal.fire({
                title: 'Ops!',
                text: 'Não foi possível excluir a cidade. Por favor entre em contato com o administrador do sistema',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
            })
          }
      })      
    },
    onClose() {
      this.$emit('onClose')
    },
    clear() {
     this.form = {
        id: null,
        name: null,
        nameError: '',
        nameIsInvalid: 'form-control',
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
