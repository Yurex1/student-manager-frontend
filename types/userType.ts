import SchoolType from "./schoolType";

export default interface UserType {
  id: string;
  login: string;
  name: string;
  isAdmin: boolean;
  school: SchoolType;
  schoolId: string;
  password: string;
}
