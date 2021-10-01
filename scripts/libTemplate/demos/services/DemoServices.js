import ServicesBase from '#lib/base/services/ServicesBase';

import DemoHelpers from './DemoHelpers';

class DemoServices extends ServicesBase {
  helpers = {
    ...super.getHelpers(),
    ...DemoHelpers,
  }

  publicParams = {}
}

export default DemoServices;
