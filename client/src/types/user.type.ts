export interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;
  email: string;
  role: string;
}

export interface UserResponseType {
  status: string;
  data: {
    user: UserType;
  };
}
