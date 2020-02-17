import AuthenticationSchema from '../schema/AuthenticationSchema';
import AuthenticationEnums from '../enums/AuthenticationEnums';

const setupAuthenticationCollection = async (db, createCollection) => {
  await createCollection(db, AuthenticationEnums.COLLECTION_NAME, AuthenticationSchema);
  const collection = db.collection(AuthenticationEnums.COLLECTION_NAME);
  await collection.createIndex({
    userId: 1,
    lastActivity: 1,
  });
};

export default setupAuthenticationCollection;
