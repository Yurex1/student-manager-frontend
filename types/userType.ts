import SchoolType from "./schoolType";

export default interface UserType {
  id: string;
  login: string;
  name: string;
  isAdmin: boolean;
  school: SchoolType | null;
  schoolId: string | null;
  password: string;
}
