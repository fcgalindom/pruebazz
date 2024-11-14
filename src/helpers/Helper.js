export default class Helper {
    static formatNumber = (value) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(value);
    }

    static thousandSeparator = (value) => {
      if (!value) return '';
      value = String(value).replace(/\./g, '');
      console.log('value', value);
      

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    static formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
    
}

