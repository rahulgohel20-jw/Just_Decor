import { POST, GET, PUT, DELETE } from "./axiosInstance";

// Create Role
export const createRole = (data) => {
  return POST("/role_master/save-single-or-multiple", data);
};

// Get All Roles
export const getAllRoles = () => {
  return GET("/role_master");
};

// Update Role
export const updateRole = (roleId, data) => {
  return PUT(`/role_master/update-by-id/${roleId}`, data);
};

// Delete Role
export const deleteRole = (roleId) => {
  return DELETE(`/role_master/${roleId}`);
};

//Country APIs
export const fetchCountries = (countryName = "") =>
  GET(`/countrymaster/getall?countryName=${countryName}`);

export const fetchCountryById = (id) =>
  GET(`/countrymaster/getbyid?id=${id}`);

// State APIs
export const fetchStatesByCountry = (countryId, stateName = "") =>
  GET(`/statemaster/getbycountryid?countryId=${countryId}&stateName=${stateName}`);
// State APIs
// export const fetchStatesByCountry = (countryId, stateName = "") =>
//   GET(
//     `/statemaster/getbycountryid?countryId=${countryId}&stateName=${stateName}`
//   );

export const fetchStateById = (id) =>
  GET(`/statemaster/getbyid?id=${id}`);
// export const fetchStateById = (id) => GET(`/statemaster/getbyid?id=${id}`);

//City APIs 
export const fetchCitiesByState = (stateId, cityName = "") =>
  GET(`/citymaster/getbystateid?stateId=${stateId}&cityName=${cityName}`);
//City APIs
// export const fetchCitiesByState = (stateId, cityName = "") =>
//   GET(`/citymaster/getbystateid?stateId=${stateId}&cityName=${cityName}`);

// export const fetchCityById = (id) =>
//   GET(`/citymaster/getbyid?id=${id}`);
//   return DELETE(`/role_master/${roleId}/role_id`);

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
  return GET(`/partymaster/getallbyuserid?partyName=${data}&userId=${Id}`);
};
//GET All ContactCategory
export const GetAllContactCategory = (Id) => {
  return GET(`/contactcategory/getallbyuserid?userId=${Id}`);
};
//search ContactCategory
export const SearchContactCategory = (data, Id) => {
  return GET(
    `/contactcategory/getallbyuserid?categoryName=${data}&userId=${Id}`
  );
};

//Add ContactCategory
export const Addcontactcategory = (data) => {
  return POST(`/contactcategory/add`, data);
};
//Edit ContactCategory
export const EditContactCategory = (Id, data) => {
  return PUT(`/contactcategory/update?id=${Id}`, data);
};
//Delete ContactCategory
export const DeleteContactCategory = (Id) => {
  return DELETE(`/contactcategory/deletebyid?id=${Id}`);
};
//Add Meal Type
export const AddMealType = (data) => {
  return POST("/mealtype/add", data);
};
//Get Meal Type
export const GetMealType = (Id) => {
  return GET(`/mealtype/getallbyuserid?userId=${Id}`);
};
//search Mealtype
export const SearchMealtype = (data, Id) => {
  return GET(`/mealtype/getallbyuserid?mealTypeName=${data}&userId=${Id}`);
};
//Edit Meal Type
export const EditMealType = (Id, data) => {
  return PUT(`/mealtype/update?id=${Id}`, data);
};
//Delete Meal Type
export const DeleteMealType = (Id) => {
  return DELETE(`/mealtype/deletebyid?id=${Id}`);
};
//Get Event Type
export const GetEventType = (Id) => {
  return GET(`/eventtype/getallbyuserid?userId=${Id}`);
};
//search Event Type
export const SearchEventType = (data, Id) => {
  return GET(`/eventtype/getallbyuserid?eventTypeName=${data}&userId=${Id}`);
};
//Add Event Type
export const Addeventtype = (data) => {
  return POST(`/eventtype/add`, data);
};
//Edit Event Type
export const EditEventType = (Id, data) => {
  return PUT(`/eventtype/update?id=${Id}`, data);
};

//Delete Event Type
export const DeleteEventType = (Id) => {
  return DELETE(`/eventtype/deletebyid?id=${Id}`);
};

//Create Event master
export const CreateEventMaster = (data) => {
  return POST(`/eventmaster/add`, data);
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

export const DeleteFunctionType = (Id) => {
  return DELETE(`/functionmaster/deletebyid?id=${Id}`);
};

export const EditFunctionById = (id, data) => {
  return PUT(`/functionmaster/update?id=${id}`, data);
};

// master
export const fetchAllUsers = () => GET("/user/getall");



