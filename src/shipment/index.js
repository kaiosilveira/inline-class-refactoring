export class Shipment {
  get trackingInfo() {
    return this._trackingInformation.display;
  }

  get trackingInformation() {
    return this._trackingInformation;
  }

  set trackingInformation(aTrackingInformation) {
    this._trackingInformation = aTrackingInformation;
  }

  set shippingCompany(arg) {
    this._trackingInformation.shippingCompany = arg;
  }

  set trackingNumber(arg) {
    this._trackingInformation.trackingNumber = arg;
  }
}
