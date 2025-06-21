import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { IBook } from "../../interfaces/books.interface";

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "Genre is not valid. got {VALUE}",
      },
      uppercase: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: [true, "Must be an Unique ISBN number"],
    },
    description: { type: String, trim: true },
    copies: { 
      type: Number, 
      required: true,
    min: [1, "You have to add minimum 1 copy"]
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Books = model("Books", BookSchema);
