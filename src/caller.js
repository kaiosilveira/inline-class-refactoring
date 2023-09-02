import { Shipment } from './shipment/index.js';
import { TrackingInformation } from './tracking-information/index.js';

const aShipment = new Shipment();
const trackingInfo = new TrackingInformation();
aShipment.trackingInformation = trackingInfo;

aShipment.trackingInformation.shippingCompany = 'DHL';
aShipment.trackingInformation.trackingNumber = '1234567890';

console.log(aShipment.trackingInfo);
