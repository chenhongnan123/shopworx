<template>
  <div style="display: none;"></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import printDoc from '../pdfExport/printDoc';

export default {
  name: 'PdfExportPanel',
  data() {
    return {
      PDF_HEADER_COLOR: '#f8f8f8',
      PDF_INNER_BORDER_COLOR: '#dde2eb',
      PDF_OUTER_BORDER_COLOR: '#babfc7',
      PDF_LOGO: 'data:image/png;base64,',
      PDF_PAGE_ORITENTATION: 'landscape',
      PDF_WITH_HEADER_IMAGE: true,
      PDF_WITH_FOOTER_PAGE_COUNT: true,
      PDF_HEADER_HEIGHT: 20,
      PDF_ROW_HEIGHT: 15,
      PDF_ODD_BKG_COLOR: '#fcfcfc',
      PDF_EVEN_BKG_COLOR: '#ffffff',
      PDF_WITH_CELL_FORMATTING: true,
      PDF_WITH_COLUMNS_AS_LINKS: true,
      PDF_SELECTED_ROWS_ONLY: false,
      PDF_REPORT_TITLE: '',
      PDF_REPORT_SUBTITLE: '',
      CUSTOMER: '',
      SITE: '',
    };
  },
  computed: {
    ...mapGetters('user', ['customer', 'currentSite']),
    ...mapGetters('reports', ['reportTitle']),
    ...mapState('reports', ['reportMapping', 'dateRange']),
    aggType() {
      return this.reportMapping ? this.$i18n.t(`${this.reportMapping.aggregationType}`) : '';
    },
  },
  methods: {
    submitFormHandler({ agGridApi, agColumnApi }) {
      const printParams = this.$data;
      const fileName = `${this.reportTitle}_${this.aggType}-${new Date().toLocaleString()}`;
      printDoc(printParams, fileName, agGridApi, agColumnApi);
    },
  },
  watch: {
    reportMapping() {
      this.PDF_REPORT_TITLE = `${this.aggType} ${this.reportTitle}`;
    },
    reportTitle() {
      this.PDF_REPORT_TITLE = `${this.aggType} ${this.reportTitle}`;
    },
    dateRange() {
      const [start, end] = this.dateRange;
      this.PDF_REPORT_SUBTITLE = `${start} to ${end}`;
    },
    currentSite() {
      this.SITE = this.currentSite;
    },
    customer() {
      this.CUSTOMER = this.customer;
    },
  },
  mounted() {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    // eslint-disable-next-line
    img.src = require('@shopworx/assets/logo/shopworx-light.png');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      this.PDF_LOGO = canvas.toDataURL('image/png');
    };
    this.PDF_REPORT_TITLE = `${this.aggType} ${this.reportTitle}`;
    const [start, end] = this.dateRange;
    this.PDF_REPORT_SUBTITLE = `${start} to ${end}`;
    this.CUSTOMER = this.customer;
    this.SITE = this.currentSite;
  },
};
</script>
