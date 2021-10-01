import DemoServices from './services/DemoServices';
import DemoEnums from './enums/DemoEnums';

/**
 * @param  {object} ctx
 *
 * @return {{ demos: DemoServices }}
 *
 */

const setupServices = ctx => {
  const { db } = ctx;
  const collection = db[DemoEnums.COLLECTION_NAME];

  // noinspection JSValidateTypes
  return {
    [DemoEnums.COLLECTION_NAME]: new DemoServices(collection),
  };
};

export default setupServices;
