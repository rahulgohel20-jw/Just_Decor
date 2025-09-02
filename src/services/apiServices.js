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
  GET(`/v1/api/countrymaster/getbyid?id=${id}`);

// State APIs
export const fetchStatesByCountry = (countryId, stateName = "") =>
  GET(
    `/statemaster/getbycountryid?countryId=${countryId}&stateName=${stateName}`
  );

export const fetchStateById = (id) =>
  GET(`/v1/api/statemaster/getbyid?id=${id}`);

//City APIs
export const fetchCitiesByState = (stateId, cityName = "") =>
  GET(`/citymaster/getbystateid?stateId=${stateId}&cityName=${cityName}`);

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
//Get all event
export const GetEventMaster = (Id) => {
  return GET(`/eventmaster/getallbyuserid?userId=${Id}`);
};
//edit event
export const UpdateEventMaster = (Id, data) => {
  return PUT(`/eventmaster/update?id=${Id}`, data);
};
//get event by id
export const GetEventMasterById = (Id) => {
  return GET(`/eventmaster/getbyid?eventId=${Id}`);
};
//Delete event
export const DeleteEventMaster = (Id) => {
  return DELETE(`/eventmaster/deleteeventbyid?eventId=${Id}`);
};
//get all manager and admin
export const Fetchmanager = (Id) => {
  return GET(`/user/getmanagerandadminusersbyclient?clientUserId=${Id}`);
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

// ✅ Get all users by UserId
export const getAllByUserId = (userId) => {
  return GET(`/user/getallbyuserid?userId=${userId}`);
};

// ✅ Get all users by RoleId all user
export const getAllByRoleId = (id) => {
  return GET(`/user/getallbyroleid?roleId=${2}`);
};

// ✅ Get user by Id in profile
export const getUserById = (id) => {
  return GET(`/user/getbyid?id=${id}`);
};

//Get category Type
export const GetAllCategory = (Id, isActive = true, searchQuery = "") => {
  return GET(
    `/menucategory/getallbyuserid?isActive=true&menuCategoryName=Welcome%20Drinks&userid=1`
  );
};

//Add category Type
export const AddCategory = (data) => {
  return POST(`/menucategory/add`, data);
};

//Edit category Type
export const editCategory = (Id, data) => {
  return PUT(`/menucategory/update?id=${Id}`, data);
};

//delete category Type
export const DeleteCategoryId = (Id) => {
  return PUT(`/menucategory/deletebyid?id=${Id}`);
};

//status category Type
export const UpdateStatus = (Id, status = true) => {
  return PUT(`/menucategory/updatestatus?id=${Id}$isActive=${status}`);
};

//Get Sub category Type
export const GetAllSubCategory = (Id, isActive = true, searchQuery = "") => {
  return GET(
    `/menusubcategory/getallbyuserid?userid=${Id}&isActive=${isActive}&menusubCategoryName=${searchQuery}`
  );
};

//Add category Type
export const AddSubCategory = (data) => {
  return POST(`/menusubcategory/add`, data);
};

//Edit category Type
export const editSubCategory = (Id, data) => {
  return PUT(`/menusubcategory/update?id=${Id}`, data);
};

//delete category Type
export const DeleteSubCategoryId = (Id) => {
  return DELETE(`/menusubcategory/deletebyid?id=${Id}`);
};

//status category Type
export const UpdateSubStatus = (Id, status = true) => {
  return PUT(`/menusubcategory/updatestatus?id=${Id}&isActive=${status}`);
};

//registration/signup
export const registerUser = (data) => {
  return POST(`/auth/add`, data);
};

export const updateusermaster = (Id) => {
  return PUT(`/auth/update?id=${Id}`);
};

//fetch user
export const FetchAllUser = (Id) => {
  return GET(`/user/getallbyuserid?userId=${Id}`);
};
