<template>
  <div class="GetState">
     <a-drawer
    title="Estados"
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
        <a-input class="form-control"  v-model:value="search" @keypress.enter.exact="getState()" placeholder="Buscar..." />
    </div>
  </div>
      <a-modal v-model:visible="visibleInsert" :title="form.id ? 'Atualizar' : 'Inserir'" @ok="handleOk">
        <template #footer>
          <button class="btn btn-dark" v-show="!form.id" @click="clear">Limpar</button>
          <button key="submit" class="btn btn-dark" :loading="loading" style="margin-left: 10px;" html-type="submit" @click="save">Enviar</button>
        </template>
         <a-form>
        <a-spin tip="Loading..." :spinning="loading">
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
        </div>
        </a-spin>
        </a-form>
      </a-modal>
     <a-spin tip="Loading..." :spinning="loading">
     <a-table :dataSource="state" :columns="columns" :pagination="false" style="margin-top: 10px;">
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
  name: 'GetState',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
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
        state: [],
        columns: [
            {
              title: 'Estado',
              dataIndex: 'name',
              key: 'name',
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
            nameError: '',
            nameIsInvalid: 'form-control',
        },
    }
  },
  mounted () {
    this.getState();
  },
  methods: {
    getState() {
      this.loading = true
      this.$axios
        .get('state', {
          params: {
            search: this.search,
          }
        })
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
    edit(id, name) {
      if(!id || !name){
        return;
      }

      this.form.id = id;
      this.form.name = name;
      this.visibleInsert = true;
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
        .post('state/store', {
          name: this.form.name,
        })
        .then(() => {
          this.$toast.fire({
            icon: 'success',
            title: 'Estado criado com sucesso!'
          })
          this.clear();
        })
        .catch((error) => {
          this.$toast.fire({
            icon: 'error',
            title: 'Não foi possivel adicionar o estado.'
          })
          
          let errors = error.response.data.errors
          if(errors.name){
            this.form.nameError = errors.name[0]
            this.form.nameIsInvalid = 'form-control is-invalid'
          }
        })
        .finally(() => {
          this.getState();
          this.loading = false
        })
    },
    update() {
      this.loading = true
      this.$axios
        .put('state/'+this.form.id+'/update', {
          name: this.form.name,
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
          this.getState();
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
            .delete('state/' + id + '/delete')
            .then(() => {
              this.getState()
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
                  text: 'Não foi excluir o estado. Porque o mesmo está sendo utilizado por algumas cidades da base, Para excluir você precisa remover essas cidades.',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                return;
              }

              this.$swal.fire({
                title: 'Ops!',
                text: 'Não foi possível excluir o estado. Por favor entre em contato com o administrador do sistema',
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
