import { Types } from "mongoose";

export interface IBorrowBooks{
    book: Types.ObjectId,
    quantity: number,
    dueDate: String
}