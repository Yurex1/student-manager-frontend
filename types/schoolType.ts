import StudentType from "./studentType";

export default interface SchoolType {
  id: string;
  name: string;
  type: string;
  students: StudentType[];
}
