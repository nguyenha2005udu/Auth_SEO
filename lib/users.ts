import 'server-only';
import type { Role } from './permissions';
export const users: {id:string;email:string;name:string;role:Role;passwordHash:string}[] = [
  {
    "id": "admin-1",
    "email": "admin@example.com",
    "name": "Quản trị viên",
    "role": "admin",
    "passwordHash": "$2b$12$8DLjIcB1hSprF7NQj2C3XuX46TkMTp7RG9WNQ2rIIZOztLNIajLgu"
  },
  {
    "id": "user-1",
    "email": "user@example.com",
    "name": "Học viên",
    "role": "user",
    "passwordHash": "$2b$12$iwp3VgmbQhHbvX.UH3ofVusADzh27SxRGWtSdA0U9.muVLfwd0iHC"
  }
];
