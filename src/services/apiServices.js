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
  return PUT(`/role_master/update-by-id/${roleId}/role_id`, data);
};

// Delete Role
export const deleteRole = (roleId) => {
  return DELETE(`/role_master/${roleId}/role_id`);
};

//Login api
export const LoginUser = (data) => {
  return POST("/auth/login", data);
};
//GET All customer
export const GetAllCustomer = (Id) => {
  return GET(`/partymaster/getallbyuserid?userId=${Id}`);
};
//Add customer
export const AddCustomerapi = (data) => {
  return POST("/partymaster/add", data);
};

//Edit customer
export const EditCustomerApi = (Id, data) => {
  return PUT(`/partymaster/update?id=${Id}`, data);
};
//Delete customer
export const DeleteCustomerApi = (Id) => {
  return DELETE(`/partymaster/deletebyid?id=${Id}`);
};

//search customer
export const SearchCustomerApi = (data, Id) => {
  return GET(
    `/partymaster/getallbyuserid?partyName=${data}&userId=${Id}`
  );
};
//GET All ContactCategory
export const GetAllContactCategory = () => {
  return GET("v1/api/contactcategory/getall");
};

//Add Meal Type
export const AddMealType = (data) => {
  return POST("/mealtype/add", data);
};
//Get Meal Type
export const GetMealType = (Id) => {
  return GET(`/mealtype/getallbyuserid?userId=${Id}`);
};
//Edit Meal Type
export const EditMealType = (Id, data) => {
  return PUT(`/mealtype/update?id=${Id}`, data);
};
//Delete Meal Type
export const DeleteMealType = (Id) => {
  return DELETE(`/mealtype/deletebyid?id=${Id}`);
};

export const GetAllPlans = () => {
  return GET(`/plans/getall`);
};

export const GetAllRole = () => {
  return GET(`/rolemaster/getall`);
};

export const AddFunction = (data) => {
  return POST(`/functionmaster/add`, data);
};

export const GetAllFunctionsByUserId = () => {
  return GET(`/functionmaster/getallbyuserid?userId=1`);
};

export const GetFunctionsByFunctionName = (functionName) => {
  return GET(
    `/functionmaster/getallbyuserid?userId=1&functionName=${functionName}`
  );
};

export const DeleteFunctionById = (id) => {
  return DELETE(`/functionmaster/deletebyid?id=${id}`);
};

export const UpdateFunctionById = (id, data) => {
  return PUT(`/functionmaster/updatebyid?id=${id}`, data);
};


export const EditFunctionById = (id, data) => {
  return PUT(`/functionmaster/updateid=${id}`, data);
};