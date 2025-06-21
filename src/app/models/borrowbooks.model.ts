import mongoose, { model, Schema } from "mongoose";
import {
  IBorrowBooks,
  IUpdateAvailableStatusStaticMethod,
} from "../../interfaces/borrowBook.interface";
import { Books } from "./books.model";

const Borrowbooks = new Schema<
  IBorrowBooks,
  IUpdateAvailableStatusStaticMethod
>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { 
      type: Number, 
      required: true,
      min: [1, "Quantity must be a positive number"]
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

Borrowbooks.static(
  "updateAvailableStatus",
  async function updateAvailableStatus(book: string, available: boolean) {
    const updatedAvailable = {
      available: false,
    };
    return await Books.findByIdAndUpdate(book, updatedAvailable);
  }
);

export const Borrowbook = model<IBorrowBooks, IUpdateAvailableStatusStaticMethod>("Borrowbook", Borrowbooks);
