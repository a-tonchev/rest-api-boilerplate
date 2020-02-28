import UserSchema from './schema/UserSchema';
import UserEnums from './enums/UserEnums';

const setupCollection = async (mongoDb, createCollection) => {
  await createCollection(mongoDb, UserEnums.COLLECTION_NAME, UserSchema);
  const collection = mongoDb.collection(UserEnums.COLLECTION_NAME);
  await collection.createIndex({
    'email.address': 1,
  }, { unique: true });
};

export default setupCollection;
