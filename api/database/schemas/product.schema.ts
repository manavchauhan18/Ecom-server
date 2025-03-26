import mongoose, { Schema, Document } from "mongoose";
interface productData extends Document {
    name: String;
    price: number;
    description?: String;
    category: String;
    stock: Boolean;
    value: number;
    createdAt: Date;
}

const productSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String, required: true },
        stock: { type: Boolean, required: true, default: false },
        value: { type: Number, required: true, default: 0 },
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
)

const Product = mongoose.model<productData>("Product", productSchema);
export default Product;