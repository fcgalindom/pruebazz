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
import MultiSelect from 'primevue/multiselect';
import 'primeicons/primeicons.css'
import DialogService from 'primevue/dialogservice';
import DynamicDialog from 'primevue/dynamicdialog';
import { useDialog } from 'primevue/usedialog';
import Chart from 'primevue/chart';
import ToggleSwitch from 'primevue/toggleswitch';
import AutoComplete from 'primevue/autocomplete';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

import Paginator from 'primevue/paginator';



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
        app.component('DataTable', DataTable)
        app.component('Column', Column)
        app.component('Paginator', Paginator)
        app.component('ColumnGroup', ColumnGroup)
        app.component('Row', Row)
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
        app.component('MultiSelect', MultiSelect)
        app.component('Chart', Chart)
        app.component('ToggleSwitch', ToggleSwitch)
        app.component('AutoComplete', AutoComplete)
     
      }
}