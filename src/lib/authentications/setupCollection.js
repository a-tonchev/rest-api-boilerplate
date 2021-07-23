import AuthenticationSchema from './schema/AuthenticationSchema';
import AuthenticationEnums from './enums/AuthenticationEnums';

const setupCollection = async (mongoDb, createCollection) => {
  await createCollection(mongoDb, AuthenticationEnums.COLLECTION_NAME, AuthenticationSchema);
  const collection = mongoDb.collection(AuthenticationEnums.COLLECTION_NAME);
  await collection.createIndex({
    userId: 1,
  });
  await collection.createIndex({
    lastActivity: 1,
  }, {
    expireAfterSeconds: 15552000,
  });
};

export default setupCollection;
