import { createApp } from 'vue'
import api from './configs/api.js'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from "sweetalert2/dist/sweetalert2.js";
import 'sweetalert2/dist/sweetalert2.min.css';


const app = createApp(App);
app.config.globalProperties.$axios = api;
app.use(VueSweetalert2);
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
app.config.globalProperties.$toast = Toast
app.use(Antd).mount('#app');
