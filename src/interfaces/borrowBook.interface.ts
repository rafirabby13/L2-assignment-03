import { Model, Types } from "mongoose";

export interface IBorrowBooks {
  book: Types.ObjectId;
  quantity: number;
  dueDate: string;
}

export interface IUpdateAvailableStatusStaticMethod
  extends Model<IBorrowBooks> {
  updateAvailableStatus(book: string, available: boolean): any;
}
