import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
interface productData extends Document {
    _id: string;
    name: String;
    price: number;
    description?: String;
    category: String;
    stock: Boolean;
    value: number;
    createdAt: Date;
    deleteStatus: Boolean;
}

const productSchema: Schema = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String, required: true },
        stock: { type: Boolean, required: true, default: false },
        value: { type: Number, required: true, default: 0 },
        createdAt: { type: Date, default: Date.now },
        deleteStatus: { type: Boolean, default: false }
    },
    { versionKey: false }
)

const Product = mongoose.model<productData>("Product", productSchema);
export default Product;