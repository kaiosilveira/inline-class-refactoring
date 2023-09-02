import { Shipment } from './shipment/index.js';

const aShipment = new Shipment();

aShipment.shippingCompany = 'DHL';
aShipment.trackingNumber = '1234567890';

console.log(aShipment.trackingInfo);
