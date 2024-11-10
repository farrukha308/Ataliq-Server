import mongoose, { Document, Model } from 'mongoose';
import { closeDbConnection, initDB } from '../config/db';

class MongooseWrapper<T extends Document> {
    private Model: Model<T>;

    constructor(modelName: any) {
        this.Model = modelName;
        // initDB()
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const doc = new this.Model(data);
            let createdDoc = await doc.save()
            closeDbConnection()
            return createdDoc
            // return await doc.save();
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error creating ${this.Model.modelName}: ${error.message}`);
        }
    }

    async bulkCreate(data: Partial<T>[]): Promise<any> {
        try {
            let createdDocs = await this.Model.insertMany(data);
            closeDbConnection();
            return createdDocs;
        } catch (error: any) {
            closeDbConnection();
            throw new Error(`Error bulk creating ${this.Model.modelName}: ${error.message}`);
        }
    }
    

    async findById(id: string): Promise<T | null> {
        try {
            return await this.Model.findById(id);
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding ${this.Model.modelName} by ID: ${error.message}`);
        }
    }

    async find(query: Object): Promise<T[]> {
        try {
            let Data = await this.Model.find({...query, 'isArchive': false});
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findOne(query: Object): Promise<T | null> {
        try {
            let Data = await this.Model
                .findOne({...query, 'isArchive': false})
                .sort({ createdAt: -1 });  // Sort by createdAt in descending order
                
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findOneLimit(query: Object, query1: Object): Promise<T | null> {
        try {
            let Data = await this.Model.findOne({...query, 'isArchive': false}).select({...query1});
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findUser(query: Object): Promise<T | null> {
        try {
            let Data = await this.Model.findOne({...query});
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findAll(): Promise<T[]> {
        try {
            let Data = await this.Model.find({'isArchive': false}).exec();
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findByPopulate(obj: object, populateAttr: string): Promise<T | null> {
        try {
            let Data = await this.Model.findById(obj).populate(populateAttr);
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findAllByPopulate(populateAttr: string): Promise<T[] | null> {
        try {
            let Data = await this.Model.find({'isArchive': false}).populate(populateAttr);
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
        }
    }

    async findAllWithArchive(): Promise<T[]> {
        try {
            let Data = await this.Model.find().exec();
            closeDbConnection()
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
        }
    }

    async loadCache(): Promise<T[]> {
        try {
            let Data = await this.Model.find({'isArchive': false}).exec();
            return Data
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error finding all ${this.Model.modelName}: ${error.message}`);
        }
    }

    async updateById(id: string, data: Partial<T>): Promise<T | null> {
        try {
            return await this.Model.findByIdAndUpdate(id, data, { new: true });
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error updating ${this.Model.modelName} by ID: ${error.message}`);
        }
    }

    async updateByQuery(query: Object, data: Partial<T>) {
        try {
            return await this.Model.updateOne(query, data, { new: true });
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error updating ${this.Model.modelName} by ID: ${error.message}`);
        }
    }


    async deleteById(id: string): Promise<T | null> {
        try {
            return await this.Model.findByIdAndUpdate(id, {isArchive: true}, { new: true });
            // return await this.Model.findByIdAndDelete(id);
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error deleting ${this.Model.modelName} by ID: ${error.message}`);
        }
    }

    async findOneAndDelete(data: Object): Promise<T | null> {
        try {
            return await this.Model.findOneAndDelete(data);
        } catch (error: any) {
            closeDbConnection()
            throw new Error(`Error deleting ${this.Model.modelName} by ID: ${error.message}`);
        }
    }
}

export default MongooseWrapper;
