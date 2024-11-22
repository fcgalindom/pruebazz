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
import Badge  from 'primevue/badge';
import Avatar  from 'primevue/avatar';
import Drawer from 'primevue/drawer';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import 'primeicons/primeicons.css'
import DialogService from 'primevue/dialogservice';
import DynamicDialog from 'primevue/dynamicdialog';
import { useDialog } from 'primevue/usedialog';

export default {
    install(app) {
        app.use(PrimeVue, {
            theme: {
                preset: Aura,
                options: {
                    // cssLayer: {
                    //     name: 'primevue',
                    //     order: 'primevue, tailwind-base, tailwind-utilities'
                    // },
                    darkModeSelector: false,
                }
            }
        });
        // app.use(PrimeVue)
        app.component('Button', Button)
        app.component('Menu', Menu)
        app.component('Avatar', Avatar)
        app.component('Badge', Badge)
        app.component('Drawer', Drawer)
        app.component('Menubar', Menubar)
        app.component('Input', InputText)
        app.component('Select', Select)
        app.component('DatePicker', DatePicker)
        app.component('InputNumber', InputNumber)
        app.component('Dialog', Dialog)
        app.component('Textarea', Textarea)
     
      }
}