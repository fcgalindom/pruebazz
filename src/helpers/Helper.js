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

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    static formatDate(dateString) {
      if(dateString === null || dateString === undefined || dateString === '') return '';
      const date = new Date(dateString + 'T00:00:00');
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    static formatDateForm(date) {
        return date.toISOString().split('T')[0]
    }
    
    static formatDateTime(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'pm' : 'am';
      return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
    }

}

