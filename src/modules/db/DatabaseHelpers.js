import mongodb from 'mongodb';

const { ObjectId } = mongodb;
const DatabaseHelpers = {
  newObjectId() {
    return ObjectId();
  },

  getObjectId(hash) {
    if (typeof hash === 'string') {
      if (ObjectId.isValid(hash)) {
        return ObjectId(hash);
      }
      return null;
    }
    return hash;
  },

  getObjectIds(ids) {
    return ids.map(id => DatabaseHelpers.getObjectId(id));
  },

  getIdAsString(doc) {
    return doc._id.toString();
  },
};

export default DatabaseHelpers;
