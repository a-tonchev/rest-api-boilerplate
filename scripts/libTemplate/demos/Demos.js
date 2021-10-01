import DemoEnums from './enums/DemoEnums';
import setupCollection from './setupCollection';
import DemoSchema from './schema/DemoSchema';
import setupServices from './setupServices';
import DemoRoutes from './controller/DemoRoutes';

const Demos = {
  collectionName: DemoEnums.COLLECTION_NAME,
  setupCollection,
  schema: DemoSchema,
  setupServices,
  // Comment out or delete next line if collection API should not be used yet:
  routes: DemoRoutes,
};

export default Demos;
