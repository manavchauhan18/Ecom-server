import mongoose, { Schema, Document } from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

interface productData extends Document {
    name: String;
    price: number;
    description?: String;
    category: String;
    stock: Boolean;
    createdAt: Date;
}

const productSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String, required: true },
        stock: { type: Boolean, required: true, default: 0 },
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
)

productSchema.plugin(AutoIncrement, { inc_field: "productId" });


const Product = mongoose.model<productData>("Product", productSchema);
export default Product;