import ElementService from './element.service';

class WMSService {
  constructor() {
    this.request = ElementService;
  }
  /**
   * Create Inbound Record
   * (1) create bulk record
   * (2) update current stock
   * @param
  */
  async createInboundRecord(warehouse, location, part, type, quantity, createdby, createdtime, assetid) {
    const { warehousecode, warehousename } = warehouse;
    const { locationcode, locationname } = location;
    const { partnumber, partname } = part;
    const { key, type: typename, description } = type;
    let query = `?query=partnumber=="${partnumber}"`;
    if (warehousecode) {
      query += `%26%26warehousecode=="${warehousecode}"`;
    }
    if (locationcode) {
      query += `%26%26locationcode=="${locationcode}"`;
    }
    const record = await ElementService.getRecords('currentstock', query);
    if (record && record.data) {
      const stock = record.data.results.length ? record.data.results[0] : null;
      const totalquantity = stock ? stock.quantity : 0;
      const bulkpayload = {
        type: Number(key),
        typedescrition: description,
        typename: typename,
        warehousecode,
        warehousename,
        locationcode,
        locationname,
        partnumber,
        partname,
        quantity,
        createdby,
        createdtime
      };
      const created = await ElementService.postRecord('bulkrecord', bulkpayload);
      if (created) {
        const putpayload = {
          type,
          warehousecode,
          warehousename,
          locationcode,
          locationname,
          partnumber,
          partname,
          quantity: quantity + totalquantity,
          assetid,
        };
        let upsert = false;
        if (stock) {
          upsert = await ElementService.updateRecordByQuery('currentstock', query, putpayload);
        } else {
          upsert = await ElementService.postRecord('currentstock', putpayload);
        }
        if (upsert) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async createOutboundRecord(warehouse, location, part, type, quantity, createdby, createdtime) {
    const { warehousecode, warehousename } = warehouse;
    const { locationcode, locationname } = location;
    const { partnumber, partname } = part;
    const { key, type: typename, description } = type;
    let query = `?query=partnumber=="${partnumber}"`;
    if (warehousecode) {
      query += `%26%26warehousecode=="${warehousecode}"`;
    }
    if (locationcode) {
      query += `%26%locationcode=="${locationcode}"`;
    }
    const record = await ElementService.getRecords('currentstock', query);
    if (record && record.data && record.data.results.length) {
      const stock = record.data.results[0];
      const totalquantity = stock.quantity || 0;
      if (totalquantity - quantity < 0) {
        return false;
      } else {
        const bulkpayload = {
          type: Number(key),
          typedescrition: description,
          typename: typename,
          warehousecode,
          warehousename,
          locationcode,
          locationname,
          partnumber,
          partname,
          quantity,
          createdby,
          createdtime
        };
        const created = await ElementService.postRecord('bulkrecord', bulkpayload);
        if (created) {
          const putpayload = {
            type,
            warehousecode,
            warehousename,
            locationcode,
            locationname,
            partnumber,
            partname,
            quantity: totalquantity - quantity,
          };
          const puted = await ElementService.updateRecordByQuery('currentstock', query, putpayload);
          if (puted) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  async checkStock(warehouse, location, part, quantity) {
    const { warehousecode } = warehouse;
    const { locationcode } = location;
    const { partnumber } = part;
    let query = `?query=partnumber=="${partnumber}"`;
    if (warehousecode) {
      query += `%26%26warehousecode=="${warehousecode}"`;
    }
    if (locationcode) {
      query += `%26%26locationcode=="${locationcode}"`;
    }
    query += `%26%26quantity>=${quantity}`
    const record = await ElementService.getRecords('currentstock', query);
    if (record && record.data && record.data.results.length) {
      return true;
    } else {
      return false;
    }
  }
}

export default new WMSService();