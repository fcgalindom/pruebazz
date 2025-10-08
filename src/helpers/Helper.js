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
      if (!dateString) return '';

      // Handle both "yyyy-mm-dd" and ISO formats
      let date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      date = new Date(year, month - 1, day);
      } else {
      date = new Date(dateString);
      }
      if (isNaN(date.getTime())) return '';

      // Ajustar a la zona horaria GMT-5 (Colombia)
      const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() + 300) * 60000);

      const day = String(offsetDate.getDate()).padStart(2, '0');
      const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DIC"];
      const month = monthNames[offsetDate.getMonth()];
      const year = offsetDate.getFullYear();

      return `${day}-${month}-${year}`;
    }

    static formatDatePDF(dateString) {
      if (!dateString) return '';
      
      // Handle both "yyyy-mm-dd" and ISO formats
      let date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) return '';

      const dayStr = String(date.getDate()).padStart(2, '0');
      const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DIC"];
      const monthStr = monthNames[date.getMonth()];
      const yearStr = date.getFullYear();

      return `${dayStr}-${monthStr}-${yearStr}`;
    }

    static formatDateForm(date) {
        return date.toISOString().split('T')[0]
    }
    
    static formatDateTime(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["JAN", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DIC"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'pm' : 'am';
      return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
    }

}

