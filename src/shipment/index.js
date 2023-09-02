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

  get shippingCompany() {
    return this._trackingInformation.shippingCompany;
  }

  set shippingCompany(arg) {
    this._trackingInformation.shippingCompany = arg;
  }

  get trackingNumber() {
    return this._trackingInformation.trackingNumber;
  }

  set trackingNumber(arg) {
    this._trackingInformation.trackingNumber = arg;
  }
}
