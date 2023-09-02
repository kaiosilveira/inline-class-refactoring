import { Shipment } from '.';

describe('Shipment', () => {
  it('should provide a readable text of its tracking info', () => {
    const shipment = new Shipment();

    shipment.shippingCompany = 'DHL';
    shipment.trackingNumber = '1234567890';

    expect(shipment.trackingInfo).toEqual('DHL: 1234567890');
  });
});
