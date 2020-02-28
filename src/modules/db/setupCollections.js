import Collections from './Collections';

// Create a collection if not exist, and add validations to it.
// Else - update collection validations

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
  const colPromises = Collections.map(
    col => (
      col.setupCollection
        ? col.setupCollection(db, createCollection)
        : null
    ),
  );
  return Promise.all(colPromises);
};
export default setupCollections;
