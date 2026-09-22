import crypto from 'crypto';
import { getLocalCollection, saveLocalDb } from '../config/db.js';

export function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

export function matchesQuery(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, condition] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(condition)) {
      const matchedAny = condition.some((subQuery) => matchesQuery(doc, subQuery));
      if (!matchedAny) return false;
      continue;
    }

    const val = key === '_id' ? (doc._id || doc.id) : doc[key];

    if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
      if (condition.$regex) {
        const regex = new RegExp(condition.$regex, condition.$options || 'i');
        if (!regex.test(String(val || ''))) return false;
      }
      if (condition.$in && Array.isArray(condition.$in)) {
        if (!condition.$in.some((item) => String(item) === String(val))) return false;
      }
      if (condition.$gte !== undefined) {
        if (Number(val) < Number(condition.$gte)) return false;
      }
      if (condition.$lte !== undefined) {
        if (Number(val) > Number(condition.$lte)) return false;
      }
      if (condition.$ne !== undefined) {
        if (String(val) === String(condition.$ne)) return false;
      }
    } else {
      if (key === '_id' || key.endsWith('Id')) {
        if (String(val ?? '') !== String(condition ?? '')) return false;
      } else if (val !== condition) {
        return false;
      }
    }
  }
  return true;
}

export class BaseStoreModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collection() {
    return getLocalCollection(this.collectionName);
  }

  async find(query = {}) {
    const list = this.collection.filter((doc) => matchesQuery(doc, query));
    return new QueryBuilder(list.map((d) => ({ ...d })));
  }

  async findOne(query = {}) {
    const found = this.collection.find((doc) => matchesQuery(doc, query));
    return found ? { ...found } : null;
  }

  async findById(id) {
    if (!id) return null;
    const found = this.collection.find((doc) => String(doc._id || doc.id) === String(id));
    return found ? { ...found } : null;
  }

  async create(data) {
    const now = new Date();
    const doc = {
      _id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.collection.unshift(doc);
    saveLocalDb();
    return { ...doc };
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    const index = this.collection.findIndex((doc) => String(doc._id || doc.id) === String(id));
    if (index === -1) return null;

    const existing = this.collection[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.collection[index] = updated;
    saveLocalDb();
    return options.new ? { ...updated } : { ...existing };
  }

  async findOneAndUpdate(query, updateData, options = { new: true }) {
    const index = this.collection.findIndex((doc) => matchesQuery(doc, query));
    if (index === -1) return null;

    const existing = this.collection[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.collection[index] = updated;
    saveLocalDb();
    return options.new ? { ...updated } : { ...existing };
  }

  async findByIdAndDelete(id) {
    const index = this.collection.findIndex((doc) => String(doc._id || doc.id) === String(id));
    if (index === -1) return null;
    const deleted = this.collection.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  }

  async deleteOne(query) {
    const index = this.collection.findIndex((doc) => matchesQuery(doc, query));
    if (index === -1) return { deletedCount: 0 };
    this.collection.splice(index, 1);
    saveLocalDb();
    return { deletedCount: 1 };
  }

  async deleteMany(query) {
    const beforeLen = this.collection.length;
    const remaining = this.collection.filter((doc) => !matchesQuery(doc, query));
    const deletedCount = beforeLen - remaining.length;
    getLocalCollection(this.collectionName).length = 0;
    getLocalCollection(this.collectionName).push(...remaining);
    saveLocalDb();
    return { deletedCount };
  }

  async updateMany(query, updateData) {
    let modifiedCount = 0;
    for (let i = 0; i < this.collection.length; i++) {
      if (matchesQuery(this.collection[i], query)) {
        this.collection[i] = {
          ...this.collection[i],
          ...updateData,
          updatedAt: new Date(),
        };
        modifiedCount++;
      }
    }
    if (modifiedCount > 0) {
      saveLocalDb();
    }
    return { modifiedCount };
  }

  async countDocuments(query = {}) {
    return this.collection.filter((doc) => matchesQuery(doc, query)).length;
  }
}

class QueryBuilder {
  constructor(items) {
    this.items = items;
  }

  sort(sortCriteria) {
    if (typeof sortCriteria === 'object') {
      const [key, order] = Object.entries(sortCriteria)[0] || [];
      if (key) {
        this.items.sort((a, b) => {
          const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
          const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
          if (valA < valB) return order === -1 ? 1 : -1;
          if (valA > valB) return order === -1 ? -1 : 1;
          return 0;
        });
      }
    }
    return this;
  }

  limit(num) {
    if (typeof num === 'number') {
      this.items = this.items.slice(0, num);
    }
    return this;
  }

  // Thenable to allow direct `await Model.find(...)`
  then(resolve, reject) {
    return Promise.resolve(this.items).then(resolve, reject);
  }
}
