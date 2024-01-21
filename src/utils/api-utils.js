const url = process.env.REACT_APP_BASE_URL;

export const urlAllProjects = (username) => {
  // Include username in the URL for filtering projects
  return username
    ? `${url}/api/projects/user/${username}`
    : `${url}/api/projects`;
};

export const urlProjectById = (id) => {
  return `${url}/api/projects/${id}`;
};

export const urlAllTasks = () => {
  return `${url}/api/tasks`;
};

export const urlTaskById = (id) => {
  return `${url}/api/tasks/${id}`;
};

export const urlProjectTasks = (projectId) => {
  return `${url}/api/projects/${projectId}/tasks`;
};

export const urlUserExistsResponse = () => {
  return `${url}/api/auth/signup/checkUserExists`;
};

export const urlSignUp = () => {
  return `${url}/api/auth/signup`;
};

export const urlLogin = () => {
  return `${url}/api/auth/login`;
};

export const urlProjectsByUser = () => {
  // Use this function to fetch projects specific to the logged-in user
  const loggedInUsername = localStorage.getItem("loggedInUsername");
  return urlAllProjects(loggedInUsername);
};