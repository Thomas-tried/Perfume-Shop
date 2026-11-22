import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductConcentration,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productBrand: string;
  productPrice: number;
  productLeftCount: number;
  productConcentration: ProductConcentration;
  /** bottle size in ml */
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productBrand: string;
  productPrice: number;
  productLeftCount: number;
  productConcentration?: ProductConcentration;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productBrand?: string;
  productPrice?: number;
  productLeftCount?: number;
  productConcentration?: ProductConcentration;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
