import mongoose, { model, Schema } from "mongoose";
import { IBorrowBooks } from "../../interfaces/borrowBook.interface";

const Borrowbooks = new Schema<IBorrowBooks>({
  book: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  dueDate: { type: String, required: true },
},
{
  timestamps: true
});


export const Borrowbook = model('Borrowbook', Borrowbooks)