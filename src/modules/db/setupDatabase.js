import Collections from './Collections';

const setupDatabase = db => {
  const dbCols = {};
  Collections.forEach(col => {
    dbCols[col.collectionName] = db.collection(col.collectionName);
  });
  return dbCols;
};

export default setupDatabase;
