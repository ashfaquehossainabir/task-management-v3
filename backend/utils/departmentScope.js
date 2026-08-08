import User from "../models/User.js";

/**
 * Leaders are scoped to their own department; every other role (manager,
 * employee) sees everything. This mirrors the same rule across the
 * users, stats, and tasks endpoints so the restriction can't drift.
 */
export const isDepartmentScoped = (reqUser) => reqUser?.role === "leader";

/**
 * Names of every user that belongs to the given department. Tasks store
 * `assignedTo` as a plain name string (not a User ref), so filtering
 * tasks by department means first resolving the department's member
 * names, then matching tasks against that list.
 */
export const getDepartmentMemberNames = async (department) => {
  const members = await User.find({ department: department || "" }).select(
    "name"
  );
  return members.map((m) => m.name);
};
