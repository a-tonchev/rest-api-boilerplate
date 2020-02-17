import UserSchema from '../schema/UserSchema';
import UserEnums from '../enums/UserEnums';

const setupUserCollection = async (db, createCollection) => {
  await createCollection(db, UserEnums.COLLECTION_NAME, UserSchema);
  const collection = db.collection(UserEnums.COLLECTION_NAME);
  await collection.createIndex({
    'email.address': 1,
  }, { unique: true });
};

export default setupUserCollection;
