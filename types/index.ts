export type TaskStatus = 'todo' | 'inprog' | 'done' | 'delay';
export type UserRole   = 'manager' | 'employee';

export interface Task {
  _id: string;
  person: string;
  taskName: string;
  progress: number;
  status: TaskStatus;
  deadline: string;
  note: string;
  userId: string;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
