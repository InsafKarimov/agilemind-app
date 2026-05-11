const USERS_KEY = 'agilemind_users';
const CURRENT_USER_KEY = 'agilemind_current_user';

export const saveUser = (user) => {
  const users = loadAllUsers();
  const existing = users.find(u => u.name === user.name);
  if (!existing) {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const loadCurrentUser = () => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const loadAllUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUserProjects = (userName, projects) => {
  localStorage.setItem(`agilemind_projects_${userName}`, JSON.stringify(projects));
};

export const loadUserProjects = (userName) => {
  const data = localStorage.getItem(`agilemind_projects_${userName}`);
  return data ? JSON.parse(data) : [];
};