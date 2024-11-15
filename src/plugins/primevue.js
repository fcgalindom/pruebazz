import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
// import Aura from '@primevue/themes/lara';
import Button from "primevue/button"
import Select from "primevue/select"
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
// import 'primevue/resources/themes/saga-blue/theme.css';
// import Editor from 'primevue/editor';

export default {
    install(app) {
        app.component('Button', Button)
        app.use(PrimeVue, {
            theme: {
                preset: Aura
            },
            options: {
                darkModeSelector: false,
            }
        });
        // app.use(PrimeVue)
        app.component('Button', Button)
        // app.component('Editor', Editor)
        app.component('Input', InputText)
        app.component('Select', Select)
        app.component('DatePicker', DatePicker)
        app.component('InputNumber', InputNumber)
        app.component('Dialog', Dialog)
        app.component('Textarea', Textarea)
      }
}