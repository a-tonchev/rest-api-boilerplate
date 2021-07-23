import mongodb from 'mongodb';
import DotN from 'mongo-dot-notation';

import DateHelper from '#modules/helpers/DateHelper';
import DatabaseHelpers from '#modules/db/DatabaseHelpers';

// eslint-disable-next-line no-unused-vars
const { Collection } = mongodb;

class ServicesBase {
  /** @member {Collection.prototype} */
  DB = null;

  constructor(DB) {
    this.DB = DB;
  }

  /** Document level helpers * */
  helpers = DatabaseHelpers;

  getHelpers() {
    return this.helpers;
  }

  async getAll(params = this.publicParams, options = {}) {
    const { methods = [], sort = [] } = options;
    const cursor = this.DB.find({}, params);

    methods.unshift(...sort.map(q => ({ name: 'sort', query: q })));

    methods.forEach(({ name: methodName = 'sort', query: methodQuery }) => {
      cursor[methodName](methodQuery);
    });

    return cursor.toArray();
  }

  async getById(id, params = this.publicParams) {
    const _id = this.helpers.getObjectId(id);
    if (!_id) return null;
    return this.DB.findOne({ _id }, params);
  }

  async getByIds(ids, params = this.publicParams) {
    const _ids = this.helpers.getObjectIds(ids);
    return this.DB.find({ _id: { $in: _ids } }, params).toArray();
  }

  async removeById(id) {
    const _id = this.helpers.getObjectId(id);
    return this.DB.deleteOne({
      _id,
    });
  }

  async getByField({
    fieldName, fieldValue, params = this.publicParams, multiple = false,
  }) {
    return multiple
      ? this.DB.find({ [fieldName]: fieldValue }, params).toArray()
      : this.DB.findOne({ [fieldName]: fieldValue }, params);
  }

  async removeByField({ fieldName, fieldValue, multiple = false }) {
    const query = { [fieldName]: fieldValue };
    return this.removeByQuery({ query, multiple });
  }

  async getByQuery({
    query, params = this.publicParams, multiple = false,
  }) {
    return multiple
      ? this.DB.find(query, params).toArray()
      : this.DB.findOne(query, params);
  }

  async removeByQuery({ query, multiple = false }) {
    return multiple ? this.DB.deleteOne(query) : this.DB.deleteMany(query);
  }

  async add(document) {
    return this.DB.insertOne({
      ...document,
      updatedAt: DateHelper.getNow(),
      createdAt: DateHelper.getNow(),
    });
  }

  async insertMany(insertArray) {
    return this.DB.insertMany(insertArray);
  }

  async update(document, options = {}) {
    if (!document) return;

    const {
      filterField = '_id',
      fieldsToExclude,
      upsert = false,
    } = options;

    const {
      _id,
      updatedAt,
      createdAt,
      ...documentRest
    } = document;

    let filterValue = this.helpers.getObjectId(_id);

    if (filterField !== '_id') {
      filterValue = document[filterField];
      delete documentRest[filterField];
    }

    if (fieldsToExclude?.length) {
      fieldsToExclude.forEach(fieldToExclude => {
        delete documentRest[fieldToExclude];
      });
    }

    const flattenDocument = DotN.flatten({
      ...documentRest,
      updatedAt: DateHelper.getNow(),
    });

    return this.DB.updateOne(
      {
        [filterField]: filterValue,
      },
      flattenDocument,
      {
        upsert,
      },
    );
  }

  async updateByQuery({ query, params, multiple = false }) {
    return multiple
      ? this.DB.updateMany(query, params)
      : this.DB.updateOne(query, params);
  }

  async switch(document1, document2, filterField = '_id') {
    return this.DB.bulkWrite([
      {
        updateOne:
          {
            filter: { [filterField]: document1[filterField] },
            update: {
              $set: {
                position: document2.position,
                updatedAt: DateHelper.getNow(),
              },
            },
          },
      },
      {
        updateOne:
          {
            filter: { [filterField]: document2[filterField] },
            update: {
              $set: {
                position: document1.position,
                updatedAt: DateHelper.getNow(),
              },
            },
          },
      },
    ]);
  }

  async aggregate(aggregationData) {
    return this.DB.aggregate(
      aggregationData,
    ).toArray();
  }

  async bulkWrite(bulkArray) {
    return this.DB.bulkWrite(bulkArray);
  }

  async count(query = {}) {
    return this.DB.countDocuments(query);
  }

  publicParams = {};
}

export default ServicesBase;
