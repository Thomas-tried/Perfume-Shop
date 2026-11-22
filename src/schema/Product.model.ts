import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductConcentration,
  ProductStatus,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productBrand: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productConcentration: {
      type: String,
      enum: ProductConcentration,
      default: ProductConcentration.EAU_DE_PARFUM,
    },

    // bottle size in ml
    productVolume: {
      type: Number,
      default: 50,
      min: 1,
    },

    productDesc: {
      type: String,
    },

    productImages: {
      type: [String],
      default: [],
    },

    productViews: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

// the same perfume can exist in different brands, concentrations and sizes
productSchema.index(
  {
    productName: 1,
    productBrand: 1,
    productConcentration: 1,
    productVolume: 1,
  },
  { unique: true },
);

export default mongoose.model("Product", productSchema);
