// Core user table used for login + role resolution.
// In a real backend, this would come from a DB.
// We keep passwords in plain text ONLY because this is a front-end mock.
export const users = [
  {
    id: 1,
    idNumber: "admin",
    password: "123456",
    role: "admin",
    // admin does not necessarily map to a domain entity
    personType: null,
    personId: null
  },
  {
    id: 2,
    idNumber: "driver1",
    password: "123456",
    role: "driver",
    personType: "driver",
    personId: 201
  },
  {
    id: 3,
    idNumber: "supervisor1",
    password: "123456",
    role: "supervisor",
    personType: "supervisor",
    personId: 301
  },
  {
    id: 4,
    idNumber: "passenger1",
    password: "123456",
    role: "passenger",
    personType: "passenger",
    personId: 401
  }
];

// Look up a user by credentials.
// In a real app, this would be an async call to a backend.
export function findUserByCredentials(idNumber, password) {
  const normalizedUser = idNumber.trim().toLowerCase();
  return users.find(
    (u) =>
      u.idNumber.toLowerCase() === normalizedUser &&
      u.password === password
  ) || null;
}

// Optionally, helper for finding user by id.
export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}
