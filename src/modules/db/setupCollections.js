import setupUserCollection from '../../api/users/services/setupUserCollection';
import setupAuthenticationCollection from '../../api/authentications/services/setupAuthenticationCollection';

const createCollection = async (db, name, schema) => {
  const existingCollection = await db.listCollections({ name }).next();
  if (existingCollection) {
    await db.command({
      collMod: name,
      validator: { $jsonSchema: schema },
      validationLevel: 'strict',
      validationAction: 'error',
    });
  } else {
    await db.createCollection(name, {
      validator: { $jsonSchema: schema },
      validationLevel: 'strict',
      validationAction: 'error',
    });
  }
};

const setupCollections = async (db) => {
  await setupUserCollection(db, createCollection);
  await setupAuthenticationCollection(db, createCollection);
};
export default setupCollections;
