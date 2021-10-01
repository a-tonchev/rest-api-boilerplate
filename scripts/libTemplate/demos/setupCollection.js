import DemoSchema from './schema/DemoSchema';
import DemoEnums from './enums/DemoEnums';

const setupCollection = async (mongoDb, createCollection) => {
  await createCollection(mongoDb, DemoEnums.COLLECTION_NAME, DemoSchema);
  const collection = mongoDb.collection(DemoEnums.COLLECTION_NAME);
  await collection.createIndex({
    _id: 1,
  });
};

export default setupCollection;
