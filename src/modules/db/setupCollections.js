import { Config } from '../../Config';

// Create a collection if not exist, and add validations to it.
// Else - update collection validations

const createCollection = async (mongoDb, name, schema) => {
  const existingCollection = await mongoDb.listCollections({ name }).next();
  if (existingCollection) {
    await mongoDb.command({
      collMod: name,
      validator: { $jsonSchema: schema },
      validationLevel: 'strict',
      validationAction: 'error',
    });
  } else {
    await mongoDb.createCollection(name, {
      validator: { $jsonSchema: schema },
      validationLevel: 'strict',
      validationAction: 'error',
    });
  }
};

const setupCollections = async (mongoDb) => {
  const colPromises = Config.collections.map(
    col => (
      col.setupCollection
        ? col.setupCollection(mongoDb, createCollection)
        : null
    ),
  );
  return Promise.all(colPromises);
};
export default setupCollections;
