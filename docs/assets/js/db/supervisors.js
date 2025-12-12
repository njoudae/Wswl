// src/js/data/supervisors.js
export const supervisors = [
  {
    id: 301,
    userId: 3, // links to users table
    name: "أ. صالح محمد",
    avatarUrl: "assets/images/avatar-male.png",
    title: "مشرف حافلات",
    department: "قسم النقل الجامعي",
  },
];

export function findSupervisorByUserId(userId) {
  return supervisors.find((s) => s.userId === userId) || null;
}
