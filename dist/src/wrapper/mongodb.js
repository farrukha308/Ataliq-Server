"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class MongooseWrapper {
    constructor(modelName) {
        this.Model = modelName;
        // initDB()
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = new this.Model(data);
                let createdDoc = yield doc.save();
                (0, db_1.closeDbConnection)();
                return createdDoc;
                // return await doc.save();
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error creating ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    bulkCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let createdDocs = yield this.Model.insertMany(data);
                (0, db_1.closeDbConnection)();
                return createdDocs;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error bulk creating ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.findById(id);
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding ${this.Model.modelName} by ID: ${error.message}`);
            }
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.find(Object.assign(Object.assign({}, query), { 'isArchive': false }));
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model
                    .findOne(Object.assign(Object.assign({}, query), { 'isArchive': false }))
                    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findOneLimit(query, query1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.findOne(Object.assign(Object.assign({}, query), { 'isArchive': false })).select(Object.assign({}, query1));
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.findOne(Object.assign({}, query));
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.find({ 'isArchive': false }).exec();
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findByPopulate(obj, populateAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.findById(obj).populate(populateAttr);
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findAllByPopulate(populateAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.find({ 'isArchive': false }).populate(populateAttr);
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    findAllWithArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.find().exec();
                (0, db_1.closeDbConnection)();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    loadCache() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Data = yield this.Model.find({ 'isArchive': false }).exec();
                return Data;
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
            }
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.findByIdAndUpdate(id, data, { new: true });
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error updating ${this.Model.modelName} by ID: ${error.message}`);
            }
        });
    }
    updateByQuery(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.updateOne(query, data, { new: true });
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error updating ${this.Model.modelName} by ID: ${error.message}`);
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.findByIdAndUpdate(id, { isArchive: true }, { new: true });
                // return await this.Model.findByIdAndDelete(id);
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error deleting ${this.Model.modelName} by ID: ${error.message}`);
            }
        });
    }
    findOneAndDelete(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Model.findOneAndDelete(data);
            }
            catch (error) {
                (0, db_1.closeDbConnection)();
                throw new Error(`Error deleting ${this.Model.modelName} by ID: ${error.message}`);
            }
        });
    }
}
exports.default = MongooseWrapper;
//# sourceMappingURL=mongodb.js.map