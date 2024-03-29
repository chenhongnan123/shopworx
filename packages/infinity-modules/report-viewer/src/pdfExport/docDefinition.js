/* eslint-disable */
export default function getDocDefinition(
  printParams,
  agGridApi,
  agGridColumnApi,
) {
  const {
    PDF_HEADER_COLOR,
    PDF_INNER_BORDER_COLOR,
    PDF_OUTER_BORDER_COLOR,
    PDF_ODD_BKG_COLOR,
    PDF_EVEN_BKG_COLOR,
    PDF_HEADER_HEIGHT,
    PDF_ROW_HEIGHT,
    PDF_PAGE_ORITENTATION,
    PDF_WITH_CELL_FORMATTING,
    PDF_WITH_COLUMNS_AS_LINKS,
    PDF_SELECTED_ROWS_ONLY,
    PDF_WITH_HEADER_IMAGE,
    PDF_WITH_FOOTER_PAGE_COUNT,
    PDF_LOGO,
    PDF_REPORT_TITLE,
    PDF_REPORT_SUBTITLE,
    CUSTOMER,
    SITE,
  } = printParams;

  return (function () {
    const columnGroupsToExport = getColumnGroupsToExport();

    const columnsToExport = getColumnsToExport();

    const widths = getExportedColumnsWidths(columnsToExport);

    const rowsToExport = getRowsToExport(columnsToExport);

    const body = columnGroupsToExport
      ? [columnGroupsToExport, columnsToExport, ...rowsToExport]
      : [columnsToExport, ...rowsToExport];

    const headerRows = columnGroupsToExport ? 2 : 1;

    const header = PDF_WITH_HEADER_IMAGE
      ? {
        image: 'shopworx-logo',
        alignment: 'left',
        width: 100,
        margin: [20, 10, 0, 0],
      }
      : null;

    const footer = PDF_WITH_FOOTER_PAGE_COUNT
      ? function (currentPage, pageCount) {
        return {
          text: `${currentPage.toString()} of ${pageCount}`,
          margin: [20],
        };
      }
      : null;

    const title = {
			text: PDF_REPORT_TITLE,
      style: 'header',
		};

    const subtitle = {
			text: PDF_REPORT_SUBTITLE,
      style: 'subheader',
		};

    const { PDF_REPORT_CHART, reportChart } = getReportChart();

    const pageMargins = [
      10,
      PDF_WITH_HEADER_IMAGE ? 70 : 20,
      10,
      PDF_WITH_FOOTER_PAGE_COUNT ? 40 : 10,
    ];

    const heights = (rowIndex) => (rowIndex < headerRows ? PDF_HEADER_HEIGHT : PDF_ROW_HEIGHT);

    const fillColor = (rowIndex, node) => {
      if (rowIndex < node.table.headerRows) {
        return PDF_HEADER_COLOR;
      }
      return rowIndex % 2 === 0 ? PDF_ODD_BKG_COLOR : PDF_EVEN_BKG_COLOR;
    };

    const hLineWidth = (i, node) => (i === 0 || i === node.table.body.length ? 1 : 1);

    const vLineWidth = (i, node) => (i === 0 || i === node.table.widths.length ? 1 : 0);

    const hLineColor = (i, node) => (i === 0 || i === node.table.body.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR);

    const vLineColor = (i, node) => (i === 0 || i === node.table.widths.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR);

    const docDefintiion = {
      pageOrientation: PDF_PAGE_ORITENTATION,
      header: {
        alignment: 'right',
        columns: [{
          ...header,
        }, [
          {
            text: CUSTOMER,
            style: 'customer',
            margin: [0, 10, 10, 0],
          },
          { text: SITE,
            style: 'customer',
            margin: [0, 0, 10, 0],
          },
        ]],
      },
      footer,
      watermark: { text: 'ShopWorx', opacity: 0.1 },
      content: [
        title,
        subtitle,
        reportChart,
        {
          style: 'myTable',
          table: {
            headerRows,
            widths,
            body,
            heights,
          },
          layout: {
            fillColor,
            hLineWidth,
            vLineWidth,
            hLineColor,
            vLineColor,
          },
        },
      ],
      images: {
        'shopworx-logo': PDF_LOGO,
        'report-chart': PDF_REPORT_CHART,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 0],
        },
        subheader: {
          fontSize: 14,
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        customer: {
          fontSize: 14,
          alignment: 'right',
        },
        myTable: {
          margin: [0, 0, 0, 0],
        },
        tableHeader: {
          bold: true,
          margin: [0, PDF_HEADER_HEIGHT / 3, 0, 0],
        },
        tableCell: {
          // margin: [0, 15, 0, 0]
        },
      },
      pageMargins,
    };

    return docDefintiion;
  }());

  function getReportChart() {
    let url = '';
    const models = agGridApi.getChartModels();
    const chartModel = models[models.length - 1];
    if (chartModel) {
      url = chartModel.getChartImageDataURL({ type: 'image/png' });
    }
    return {
      PDF_REPORT_CHART: url,
      reportChart: {
        image: 'report-chart',
        alignment: 'center',
        width: 830,
        margin: [10, 10, 10, 10],
      }
    };
  }

  function getColumnGroupsToExport() {
    const displayedColumnGroups = agGridColumnApi.getAllDisplayedColumnGroups();

    const isColumnGrouping = displayedColumnGroups.some((col) => col.hasOwnProperty('children'));

    if (!isColumnGrouping) {
      return null;
    }

    const columnGroupsToExport = [];

    displayedColumnGroups.forEach((colGroup) => {
      const isColSpanning = colGroup.children.length > 1;
      let numberOfEmptyHeaderCellsToAdd = 0;

      if (isColSpanning) {
        const headerCell = createHeaderCell(colGroup);
        columnGroupsToExport.push(headerCell);
        // subtract 1 as the column group counts as a header
        numberOfEmptyHeaderCellsToAdd--;
      }

      // add an empty header cell now for every column being spanned
      colGroup.displayedChildren.forEach((childCol) => {
        const pdfExportOptions = getPdfExportOptions(childCol.getColId());
        if (!pdfExportOptions || !pdfExportOptions.skipColumn) {
          numberOfEmptyHeaderCellsToAdd++;
        }
      });

      for (let i = 0; i < numberOfEmptyHeaderCellsToAdd; i++) {
        columnGroupsToExport.push({});
      }
    });

    return columnGroupsToExport;
  }

  function getColumnsToExport() {
    const columnsToExport = [];

    agGridColumnApi.getAllDisplayedColumns().forEach((col) => {
      const pdfExportOptions = getPdfExportOptions(col.getColId());
      if (pdfExportOptions && pdfExportOptions.skipColumn) {
        return;
      }
      const headerCell = createHeaderCell(col);
      columnsToExport.push(headerCell);
    });

    return columnsToExport;
  }

  function getRowsToExport(columnsToExport) {
    const rowsToExport = [];

    agGridApi.forEachNodeAfterFilterAndSort((node) => {
      if (PDF_SELECTED_ROWS_ONLY && !node.isSelected()) {
        return;
      }
      const rowToExport = columnsToExport.map(({ colId }) => {
        const cellValue = agGridApi.getValue(colId, node);
        const tableCell = createTableCell(cellValue, colId);
        return tableCell;
      });
      rowsToExport.push(rowToExport);
    });

    return rowsToExport;
  }

  function getExportedColumnsWidths(columnsToExport) {
    return columnsToExport.map(() => `${100 / columnsToExport.length}%`);
  }

  function createHeaderCell(col) {
    const headerCell = {};

    const isColGroup = col.hasOwnProperty('children');

    if (isColGroup) {
      headerCell.text = col.originalColumnGroup.colGroupDef.headerName;
      headerCell.colSpan = col.children.length;
      headerCell.colId = col.groupId;
    } else {
      let { headerName } = col.colDef;

      if (col.sort) {
        headerName += ` (${col.sort})`;
      }
      if (col.filterActive) {
        headerName += ' [FILTERING]';
      }

      headerCell.text = headerName;
      headerCell.colId = col.getColId();
    }

    headerCell.style = 'tableHeader';

    return headerCell;
  }

  function createTableCell(cellValue, colId) {
    const tableCell = {
      text: cellValue !== undefined ? cellValue : '',
      // noWrap: PDF_PAGE_ORITENTATION === "landscape",
      style: 'tableCell',
    };

    const pdfExportOptions = getPdfExportOptions(colId);

    if (pdfExportOptions) {
      const { styles, createURL } = pdfExportOptions;

      if (PDF_WITH_CELL_FORMATTING && styles) {
        Object.entries(styles).forEach(
          ([key, value]) => (tableCell[key] = value),
        );
      }

      if (PDF_WITH_COLUMNS_AS_LINKS && createURL) {
        tableCell.link = createURL(cellValue);
        tableCell.color = 'blue';
        tableCell.decoration = 'underline';
      }
    }

    return tableCell;
  }

  function getPdfExportOptions(colId) {
    const col = agGridColumnApi.getColumn(colId);
    return col.colDef.pdfExportOptions;
  }
}
