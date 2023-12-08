import mongodb from 'mongodb';

const { ObjectId } = mongodb;
const DatabaseHelpers = {
  newObjectId() {
    return new ObjectId();
  },

  getObjectId(hash) {
    if (typeof hash === 'string') {
      if (ObjectId.isValid(hash)) {
        return new ObjectId(hash);
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
