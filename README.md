[![Continuous Integration](https://github.com/kaiosilveira/inline-class-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/inline-class-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Inline Class

<table>
<thead>
<tr>
<th>Before</th>
<th>After</th>
</tr>
</thread>
<tobdy>
<tr>
<td>

```javascript
class Person {
  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }

  get officeNumber() {
    return this._telephoneNumber.number;
  }
}

class TelephoneNumber {
  get areaCode() {
    return this._areaCode;
  }

  get number() {
    return this._number;
  }
}
```

</td>

<td>

```javascript
class Person {
  get officeAreaCode() {
    return this._officeAreaCode;
  }

  get officeNumber() {
    return this._officeNumber;
  }
}
```

</td>

</tr>
</tobdy>
</table>

**Inverse of: [Extract class](https://github.com/kaiosilveira/inline-class-refactoring)**

As a result of the flexibility we have in healthy codebases, we often move things around to test new ideas, to better isolate responsibilities, and/or to reallocate behavior throughout our layers. Sometimes, though, we go too far. This refactoring helps in these cases where we want to merge two or more classes into a single unit.

## Working example

Our starting point for this example is a `Shipment` class, which holds a reference to a `TrackingInformation` instance that holds its tracking data. We want to inline `TrackingInformation`, so all the tracking-related data is part of `Shipment`.

### Supporting test suite

To make sure our refactoring steps don't break anything, we have the following supporting test suite:

```javascript
describe('Shipment', () => {
  it('should provide a readable text of its tracking info', () => {
    const shipment = new Shipment();

    shipment.shippingCompany = 'DHL';
    shipment.trackingNumber = '1234567890';

    expect(shipment.trackingInfo).toEqual('DHL: 1234567890');
  });
});
```

It basically covers the most complex functionality in our system: printing the tracking info of a shipment, which delegates to the `TrackingInformation.display` method for this work.

### Steps

To start things up, we introduce a delegate to `shippingCompany` at `Shipment`. This will help us moving the field later:

```diff
diff --git a/src/caller.js b/src/caller.js
@@ -5,7 +5,7 @@ const aShipment = new Shipment();
 const trackingInfo = new TrackingInformation();
 aShipment.trackingInformation = trackingInfo;

-aShipment.trackingInformation.shippingCompany = 'DHL';
+aShipment.shippingCompany = 'DHL';
 aShipment.trackingInformation.trackingNumber = '1234567890';

 console.log(aShipment.trackingInfo);

diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -10,4 +10,8 @@
export class Shipment {
   set trackingInformation(aTrackingInformation) {
     this._trackingInformation = aTrackingInformation;
   }
+
+  set shippingCompany(arg) {
+    this._trackingInformation.shippingCompany = arg;
+  }
 }

diff --git a/src/shipment/index.test.js b/src/shipment/index.test.js
@@ -7,7 +7,7 @@
describe('Shipment', () => {
     const trackingInfo = new TrackingInformation();
     shipment.trackingInformation = trackingInfo;

-    shipment.trackingInformation.shippingCompany = 'DHL';
+    shipment.shippingCompany = 'DHL';
     shipment.trackingInformation.trackingNumber = '1234567890';

     expect(shipment.trackingInfo).toEqual('DHL: 1234567890');
```

By the same token, we introduce a delegate to `trackingNumber`:

```diff

diff --git a/src/caller.js b/src/caller.js
@@ -6,6 +6,6 @@ const trackingInfo = new TrackingInformation();
 aShipment.trackingInformation = trackingInfo;

 aShipment.shippingCompany = 'DHL';
-aShipment.trackingInformation.trackingNumber = '1234567890';
+aShipment.trackingNumber = '1234567890';

 console.log(aShipment.trackingInfo);
diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -14,4 +14,8 @@
export class Shipment {
   set shippingCompany(arg) {
     this._trackingInformation.shippingCompany = arg;
   }
+
+  set trackingNumber(arg) {
+    this._trackingInformation.trackingNumber = arg;
+  }
 }

diff --git a/src/shipment/index.test.js b/src/shipment/index.test.js
@@ -8,7 +8,7 @@
describe('Shipment', () => {
     shipment.trackingInformation = trackingInfo;

     shipment.shippingCompany = 'DHL';
-    shipment.trackingInformation.trackingNumber = '1234567890';
+    shipment.trackingNumber = '1234567890';

     expect(shipment.trackingInfo).toEqual('DHL: 1234567890');
   });
```

Then, we can start moving things. We introduce a getter for `shippingCompany` at `Shipment`

```diff
diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -11,6 +11,10 @@
export class Shipment {
     this._trackingInformation = aTrackingInformation;
   }

+  get shippingCompany() {
+    return this._trackingInformation.shippingCompany;
+  }
+
   set shippingCompany(arg) {
     this._trackingInformation.shippingCompany = arg;
   }
```

...and a getter for `trackingNumber`:

```diff
diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -19,6 +19,10 @@
export class Shipment {
     this._trackingInformation.shippingCompany = arg;
   }

+  get trackingNumber() {
+    return this._trackingInformation.trackingNumber;
+  }
+
   set trackingNumber(arg) {
     this._trackingInformation.trackingNumber = arg;
   }
```

Finally, we can start inlining things. We first inline `trackingInformation.display` into `Shipment.trackingInfo`:

```diff
diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -1,6 +1,6 @@
 export class Shipment {
   get trackingInfo() {
-    return this._trackingInformation.display;
+    return `${this.shippingCompany}: ${this.trackingNumber}`;
   }

   get trackingInformation() {
```

And then we move the `shippingCompany` field:

```diff
diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -12,11 +12,11 @@
export class Shipment {
   }

   get shippingCompany() {
-    return this._trackingInformation.shippingCompany;
+    return this._shippingCompany;
   }

   set shippingCompany(arg) {
-    this._trackingInformation.shippingCompany = arg;
+    this._shippingCompany = arg;
   }

   get trackingNumber() {
```

Finally, we move the `trackingNumber` field:

```diff

diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -20,10 +20,10 @@
export class Shipment {
   }

   get trackingNumber() {
-    return this._trackingInformation.trackingNumber;
+    return this._trackingNumber;
   }

   set trackingNumber(arg) {
-    this._trackingInformation.trackingNumber = arg;
+    this._trackingNumber = arg;
   }
 }
```

And now we can stop using `TrackingInformation`:

```diff
diff --git a/src/caller.js b/src/caller.js
@@ -1,9 +1,6 @@
 import { Shipment } from './shipment/index.js';
-import { TrackingInformation } from './tracking-information/index.js';

 const aShipment = new Shipment();
-const trackingInfo = new TrackingInformation();
-aShipment.trackingInformation = trackingInfo;

 aShipment.shippingCompany = 'DHL';
 aShipment.trackingNumber = '1234567890';

diff --git a/src/shipment/index.js b/src/shipment/index.js
@@ -3,14 +3,6 @@
export class Shipment {
     return `${this.shippingCompany}: ${this.trackingNumber}`;
   }

-  get trackingInformation() {
-    return this._trackingInformation;
-  }
-
-  set trackingInformation(aTrackingInformation) {
-    this._trackingInformation = aTrackingInformation;
-  }
-
   get shippingCompany() {
     return this._shippingCompany;
   }

diff --git a/src/shipment/index.test.js b/src/shipment/index.test.js
@@ -1,11 +1,8 @@
 import { Shipment } from '.';
-import { TrackingInformation } from '../tracking-information';

 describe('Shipment', () => {
   it('should provide a readable text of its tracking info', () => {
     const shipment = new Shipment();
-    const trackingInfo = new TrackingInformation();
-    shipment.trackingInformation = trackingInfo;

     shipment.shippingCompany = 'DHL';
     shipment.trackingNumber = '1234567890';
```

To clean things up, we can now safely delete `TrackingInformation`:

```diff
diff --git a/src/tracking-information/index.js b/src/tracking-information/index.js
deleted file mode 100644
index d108113..0000000
--- a/src/tracking-information/index.js
+++ /dev/null
@@ -1,21 +0,0 @@
-export class TrackingInformation {
-  get shippingCompany() {
-    return this._shippingCompany;
-  }
-
-  set shippingCompany(arg) {
-    this._shippingCompany = arg;
-  }
-
-  get trackingNumber() {
-    return this._trackingNumber;
-  }
-
-  set trackingNumber(arg) {
-    this._trackingNumber = arg;
-  }
-
-  get display() {
-    return `${this.shippingCompany}: ${this.trackingNumber}`;
-  }
-}

diff --git a/src/tracking-information/index.test.js b/src/tracking-information/index.test.js
deleted file mode 100644
index 2ba2416..0000000
--- a/src/tracking-information/index.test.js
+++ /dev/null
@@ -1,12 +0,0 @@
-import { TrackingInformation } from '.';
-
-describe('TrackingInformation', () => {
-  it('should provide a readable display of its info', () => {
-    const trackingInfo = new TrackingInformation();
-
-    trackingInfo.shippingCompany = 'DHL';
-    trackingInfo.trackingNumber = '1234567890';
-
-    expect(trackingInfo.display).toEqual('DHL: 1234567890');
-  });
-});
```

And that's it!

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                          | Message                                                           |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [8e9ec1f](https://github.com/kaiosilveira/inline-class-refactoring/commit/8e9ec1f1f322477c228308c93c493850b2631482) | introduce delegate to `shippingCompany` at `Shipment`             |
| [df6db45](https://github.com/kaiosilveira/inline-class-refactoring/commit/df6db45ad38849ae50be937a8ce0d26e7d39a4c1) | introduce delegate to `trackingNumber` at `Shipment`              |
| [79d6a0d](https://github.com/kaiosilveira/inline-class-refactoring/commit/79d6a0d80b2c60839f1909f31b71fe5d46534174) | introduce getter for `shippingCompany` at `Shipment`              |
| [07dd9e3](https://github.com/kaiosilveira/inline-class-refactoring/commit/07dd9e329274622849bcc3c7dbede13a9c7fc534) | introduce getter `trackingNumber` at `Shipment`                   |
| [ffc8c87](https://github.com/kaiosilveira/inline-class-refactoring/commit/ffc8c8742032d143466395f6004e923d23fc21f5) | inline `trackingInformation.display` into `Shipment.trackingInfo` |
| [510c1cb](https://github.com/kaiosilveira/inline-class-refactoring/commit/510c1cb671e2b60ca85dd66493e726262adc62f2) | move `shippingCompany` field to `Shipment`                        |
| [7c254eb](https://github.com/kaiosilveira/inline-class-refactoring/commit/7c254eb8c8109b164b8eb3943358db055cbfd4c5) | move `trackingNumber` field to `Shipment`                         |
| [c5f7f7c](https://github.com/kaiosilveira/inline-class-refactoring/commit/c5f7f7c10670ac1cf04c309ced542c2214d2a857) | stop using `TrackingInformation` at `Shipment`                    |
| [b38c7d5](https://github.com/kaiosilveira/inline-class-refactoring/commit/b38c7d52e62aea191469b530795c7994ae05c77a) | delete `TrackingInformation`                                      |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/inline-class-refactoring/commits/main).
