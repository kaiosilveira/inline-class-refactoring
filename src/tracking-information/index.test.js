import { TrackingInformation } from '.';

describe('TrackingInformation', () => {
  it('should provide a readable display of its info', () => {
    const trackingInfo = new TrackingInformation();

    trackingInfo.shippingCompany = 'DHL';
    trackingInfo.trackingNumber = '1234567890';

    expect(trackingInfo.display).toEqual('DHL: 1234567890');
  });
});
