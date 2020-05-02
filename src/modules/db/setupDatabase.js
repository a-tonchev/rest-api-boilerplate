import { Config } from '../../Config';

const setupDatabase = mongoDb => {
  const dbCols = {};
  Config.collections.forEach(col => {
    dbCols[col.collectionName] = mongoDb.collection(col.collectionName);
  });
  return dbCols;
};

export default setupDatabase;
