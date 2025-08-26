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

export const fetchStateById = (id) =>
  GET(`/statemaster/getbyid?id=${id}`);

//City APIs 
export const fetchCitiesByState = (stateId, cityName = "") =>
  GET(`/citymaster/getbystateid?stateId=${stateId}&cityName=${cityName}`);

export const fetchCityById = (id) =>
  GET(`/citymaster/getbyid?id=${id}`);