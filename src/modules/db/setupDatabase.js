import Collections from './Collections';

const setupDatabase = mongoDb => {
  const dbCols = {};
  Collections.forEach(col => {
    dbCols[col.collectionName] = mongoDb.collection(col.collectionName);
  });
  return dbCols;
};

export default setupDatabase;
