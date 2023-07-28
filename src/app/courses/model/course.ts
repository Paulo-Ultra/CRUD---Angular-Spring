import { Lesson } from "./lesson";

export interface Course {
  _id: string;
  name: string;
  category: string;
  // Operador Elvis por conta do formato ?:, funciona mesmo se lessons for nulo
  lessons?: Lesson[];
}
