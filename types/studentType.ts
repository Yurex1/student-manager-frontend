import SchoolType from "./schoolType";

export default interface StudentType {
  id: string;
  fullName: string;
  locationOfLiving: string;
  dateOfBirth: Date;
  specialCategory: string;
  sex: string;
  formOfStudy: string;
  schoolId: string;
  school: SchoolType;
}
