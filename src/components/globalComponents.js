import BaseButton from './base/BaseButton.vue'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseError from './base/BaseError.vue'
import Select2 from 'vue-multiselect'
import Label from './base/Label.vue'
import Modal from './base/BaseModal.vue'

export default {
  install(app) {
    app.component('Button', BaseButton)
    app.component('Input', BaseInput)
    app.component('Select', BaseSelect)
    app.component('Error', BaseError)
    app.component('Label', Label)
    app.component('Modal', Modal)
    app.component('Select2', Select2)
  }
}