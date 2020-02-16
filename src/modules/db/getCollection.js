const getCollection = (collectionName, db) => {
  const dataBase = db;
  if (dataBase) return dataBase.collection(collectionName);
};

export default getCollection;
