# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.2.1](https://bitbucket.org/entrib/shopworx/compare/v4.2.0-alpha.3...v4.2.1) (2021-01-09)


### Bug Fixes

* **customer deployment:** fixed enable passwordless toggle ([e9d9e2e](https://bitbucket.org/entrib/shopworx/commits/e9d9e2ea19a020ba5046f187c475279781f78bf3))
* **customer-deployment:** added asset id to payload ([2213706](https://bitbucket.org/entrib/shopworx/commits/22137060bccc06f10d75893996c2dc4fec277add))
* **customer-deployment:** disable deploy button if instance is deploying ([2c6340a](https://bitbucket.org/entrib/shopworx/commits/2c6340acb3688058414545334f6852a9911ea3db))
* **customer-deployment:** enable instance actions only order not in progress ([e6c65dd](https://bitbucket.org/entrib/shopworx/commits/e6c65dd7a75931307f63796258ee9065fd3d3c17))
* **customer-deployment:** fallback foreign keys to NA ([ae0e1d7](https://bitbucket.org/entrib/shopworx/commits/ae0e1d7569e896445a51d417a442851e1bbd4a5c))
* **customer-deployment:** fix reconfiguration of instance ([e0795ba](https://bitbucket.org/entrib/shopworx/commits/e0795ba93ae7bcc266b42b2f9ff93276b769adfe))
* **customer-deployment:** fix reload on customer or site change ([58f1b1b](https://bitbucket.org/entrib/shopworx/commits/58f1b1bd9f18645d4173d6b02e1e319d1909c06a))
* **customer-deployment:** fixed debian install sse event display ([951e4af](https://bitbucket.org/entrib/shopworx/commits/951e4af20020d1f2170f56baa1239f225e5df20f))
* **customer-deployment:** fixed deployment logs display ([e0b53fd](https://bitbucket.org/entrib/shopworx/commits/e0b53fdcf6a77f0a0f536d66c1a6c0c60417e6ed))
* **customer-deployment:** fixed device selection ([b65787a](https://bitbucket.org/entrib/shopworx/commits/b65787a465ab216451d06f3f4d689cfad1caf9fd))
* **customer-deployment:** fixed device update ([cab1a92](https://bitbucket.org/entrib/shopworx/commits/cab1a92a476a5b788f55263563897a593bba02c1))
* **customer-deployment:** fixed display of deployment status for instances ([be8a74e](https://bitbucket.org/entrib/shopworx/commits/be8a74e1d4e7d775729cf6afb6733233f9171c8b))
* **customer-deployment:** fixed file name validations ([9627ce0](https://bitbucket.org/entrib/shopworx/commits/9627ce099db986bb58b3b3fdc808c33a10126bf1))
* **customer-deployment:** fixed form validations ([99ed7e9](https://bitbucket.org/entrib/shopworx/commits/99ed7e9771d6c8e517ad5fc4524440da7387165a))
* **customer-deployment:** fixed install debian ([c0c56a4](https://bitbucket.org/entrib/shopworx/commits/c0c56a4f1e2763874a8ea84582c3038075fea797))
* **customer-deployment:** fixed intance name validation ([d1225ce](https://bitbucket.org/entrib/shopworx/commits/d1225ce2397c1a706ebc1c83d581942753f23e95))
* **customer-deployment:** fixed passwordless device ([a6903f6](https://bitbucket.org/entrib/shopworx/commits/a6903f6f2deea7ea09051c6f3272407ffacdf8de))
* **customer-deployment:** fixed passwordless flow ([0dff569](https://bitbucket.org/entrib/shopworx/commits/0dff56954eb7bff98953eea841bb6d4e5208a107))
* **customer-deployment:** fixed reconfiguration sse event display ([9222fe0](https://bitbucket.org/entrib/shopworx/commits/9222fe077be8fbbe105cd9975a27570aefee69dc))
* **customer-deployment:** fixed sse event messages ([4b7ccc9](https://bitbucket.org/entrib/shopworx/commits/4b7ccc95ee0bfbdda1f88e5d4a835c322822a841))
* **customer-deployment:** inititate sse only after origin context setting ([be7d0c1](https://bitbucket.org/entrib/shopworx/commits/be7d0c13224164984f2f1f60083d6ca58b076f2c))
* **customer-deployment:** removed config validation ([547cca7](https://bitbucket.org/entrib/shopworx/commits/547cca77052d771abaf3a3c6fe0dacb6b77a1456))
* **customer-deployment:** update selected device state on event change ([3d50aa7](https://bitbucket.org/entrib/shopworx/commits/3d50aa752a1d5a85e273cb229f7475c128f4a0f1))
* **customer-deployment:** updated validations ([1b1a56f](https://bitbucket.org/entrib/shopworx/commits/1b1a56f07ab3a094212a19b9352da1eba7a0a63c))
* **customre-deployment:** fixed deploying state ([db88328](https://bitbucket.org/entrib/shopworx/commits/db88328e8cb91b5377ecdab9b1fcc759b4556cff))


### Features

* **customer-deployment:** added char limit to input fields ([a5a7108](https://bitbucket.org/entrib/shopworx/commits/a5a71087346290e0ab95cc987aafb0611e677684))
* **customer-deployment:** added deployment history ([14381e8](https://bitbucket.org/entrib/shopworx/commits/14381e8100c349e2cb1553011521ba748d7cdeb5))
* **customer-deployment:** added deployment settings for seed data ([f06c7bc](https://bitbucket.org/entrib/shopworx/commits/f06c7bcf2ced4b9743d98344bdf21ee82b978724))
* **customer-deployment:** added instance reconfiguration ([8b4e663](https://bitbucket.org/entrib/shopworx/commits/8b4e66330045714de707f3796223e7ce09385211))
* **customer-deployment:** added is deployed indication through colors ([6dc5efb](https://bitbucket.org/entrib/shopworx/commits/6dc5efbeb1b18d47adfdd2ee5bc4b2eb40f6a868))
* **customer-deployment:** added is deploying indication ([62149e2](https://bitbucket.org/entrib/shopworx/commits/62149e28c984f7018735b986254fa2264e4e4cf0))
* **customer-deployment:** added mmonitlink and isdeployed tags ([3b9e1b0](https://bitbucket.org/entrib/shopworx/commits/3b9e1b0a78ba7a45f38271bc2b18709c5388e054))
* **customer-deployment:** added monitored instances ([ee90c0e](https://bitbucket.org/entrib/shopworx/commits/ee90c0e1c81be351a44dc708d9f8b2fae859e76d))
* **customer-deployment:** added nodebot id to deloyment logs ([52d221c](https://bitbucket.org/entrib/shopworx/commits/52d221c804e8362f5a145f1913e68dfeaf502d17))
* **customer-deployment:** added operation column to dployment updates ([8e445d9](https://bitbucket.org/entrib/shopworx/commits/8e445d99fba4bd6d306705ff6e3f1e376fda50f9))
* **customer-deployment:** added option to register an unmapped device ([6096428](https://bitbucket.org/entrib/shopworx/commits/6096428817ab26754811f3e99257230766b931c0))
* **customer-deployment:** added option to toggle service active state ([b2337e0](https://bitbucket.org/entrib/shopworx/commits/b2337e0b7655ea556ee8d8f8aefece0510d41314))
* **customer-deployment:** added option to update nodebot debian ([cf122b1](https://bitbucket.org/entrib/shopworx/commits/cf122b19f882dac031fb8c97c9e31ecd1c2b2011))
* **customer-deployment:** added optoin to install debian ([56d31c7](https://bitbucket.org/entrib/shopworx/commits/56d31c7d13500423a562087d076cdf553f6f67ba))
* **customer-deployment:** added refresh instances button ([3407d41](https://bitbucket.org/entrib/shopworx/commits/3407d412d95f0dd66033652c59c52b38513321d4))
* **customer-deployment:** added remove and terminate instance actions ([aae8607](https://bitbucket.org/entrib/shopworx/commits/aae8607a50abef1a0ac26c0392e0406185f95a10))
* **customer-deployment:** added server side pagination ([83a0c23](https://bitbucket.org/entrib/shopworx/commits/83a0c23d85b788f9ab1c64ef85f6f97d11f70ae9))
* **customer-deployment:** added sse status ([8b5d57b](https://bitbucket.org/entrib/shopworx/commits/8b5d57bba501d9001909142d7291835dadad609d))
* **customer-deployment:** added view deployment order logs ([f0ce7ff](https://bitbucket.org/entrib/shopworx/commits/f0ce7ff158678903989a47ba1ce8643624352578))
* **customer-deployment:** auto parse package name and release from deb file ([b930d36](https://bitbucket.org/entrib/shopworx/commits/b930d36057a08034f5edd52663b694795e8c859f))
* **customer-deployment:** option to add M/Monit URL with deployment manager ([d394319](https://bitbucket.org/entrib/shopworx/commits/d394319cfc821c3f5e42e5bab6612174afec92d1))
* **customer-deployment:** updated deployment order tags to contain name ([1bca921](https://bitbucket.org/entrib/shopworx/commits/1bca92101c9d415e184c16abbfd78be6ed743da6))
* **deployment:** create required elements and tags on app startup ([2c97d3b](https://bitbucket.org/entrib/shopworx/commits/2c97d3b05a0d1a2d98032547777760f906deacfd))