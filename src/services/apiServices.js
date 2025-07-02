import { POST, GET, PUT, DELETE } from "./axiosInstance";

// Create Role
export const createRole = (data) => {
  return POST("/role_master/save-single-or-multiple", data);
};

// Get All Roles
export const getAllRoles = (data) => {
  return GET("/role_master", data);
};

// Update Role
export const updateRole = (roleId, data) => {
  return PUT(
    `/role_master/update-by-id/${roleId}/role_id?select=&deep=&upsert=false&returnDocument=after&throwErrorIfRecordNotFound=false`,
    data
  );
};

// Delete Role
export const deleteRole = (roleId) => {
  return DELETE(
    `/role_master/${roleId}/role_id?select=&deep=&throwErrorIfRecordNotFound=false`
  );
};
