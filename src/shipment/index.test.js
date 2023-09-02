import { Shipment } from '.';
import { TrackingInformation } from '../tracking-information';

describe('Shipment', () => {
  it('should provide a readable text of its tracking info', () => {
    const shipment = new Shipment();
    const trackingInfo = new TrackingInformation();
    shipment.trackingInformation = trackingInfo;

    shipment.shippingCompany = 'DHL';
    shipment.trackingInformation.trackingNumber = '1234567890';

    expect(shipment.trackingInfo).toEqual('DHL: 1234567890');
  });
});
