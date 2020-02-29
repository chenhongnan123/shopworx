class AgGridService {
  getCellEditor(dataType) {
    switch (dataType) {
      case 'String':
        return null;
      case 'Integer':
        return null;
      case 'Double':
        return null;
      case 'Float':
        return null;
      case 'Boolean':
        return null;
      default:
        return null;
    }
  }

  getCellRenderer(dataType) {
    switch (dataType) {
      case 'String':
        return null;
      case 'Integer':
        return null;
      case 'Double':
        return null;
      case 'Float':
        return null;
      case 'Boolean':
        return null;
      default:
        return null;
    }
  }
}

export default new AgGridService();
