import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { IBook } from "../../interfaces/books.interface";
import { Timestamp } from './../../../node_modules/bson/src/timestamp';

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    required: true,
    enum: [
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ],
  },
  isbn: { type: String, required: true, unique: true },
  description: String,
  copies: { type: Number, required: true },
  available: Boolean,
  
},
{
    timestamps: true
  });


export const Books = model('Books', BookSchema)
