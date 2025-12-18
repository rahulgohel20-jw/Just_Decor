import { POST, GET, PUT, DELETE, UPLOAD } from "./axiosInstance";
import axios from "./axiosInstance";
export const GetMenuCategoryByUserId = (Id) => {
  return GET(`/menucategory/getallbyuserid?userid=${Id}`);
};
export const GetMenuCategoryByUserIdmenuitem = (userId) => {
  return GET(`/menucategory/getallbyuserid?userid=${userId}`);
};

export const GetQuotation = (id) => {
  return GET(`/quotation/getbyeventid?eventId=${id}`);
};

export const UpdateQuotation = (id, data) => {
  return PUT(`/quotation/update?id=${id}`, data);
};

export const DeleteQuotation = (id) => {
  return DELETE(`/quotation/deletebyquotationitemid?quotationItemId=${id}`);
};

//Country APIs
export const fetchCountries = (countryName = "") =>
  GET(`/countrymaster/getall?countryName=${countryName}`);

export const fetchCountryById = (id) => GET(`/countrymaster/getbyid?id=${id}`);

// State APIs
export const fetchStatesByCountry = (countryId, stateName = "") =>
  GET(
    `/statemaster/getbycountryid?countryId=${countryId}&stateName=${stateName}`
  );

export const fetchStateById = (id) => GET(`/statemaster/getbyid?id=${id}`);

//City APIs
export const fetchCitiesByState = (stateId, cityName = "") =>
  GET(`/citymaster/getbystateid?stateId=${stateId}&cityName=${cityName}`);

//Login api
export const LoginUser = (data) => {
  return POST("/auth/login", data);
};

export const LoginOutUser = (email, eventtype) => {
  return GET(
    `/user-logs/logout-notification?email=${email}&eventType=${eventtype}`
  );
};

//GET All customer
export const GetAllCustomer = (Id) => {
  return GET(`/partymaster/getallbyuserid?userId=${Id}`);
};

//get customer by id by cat id
export const GetPartyMasterByCatId = (catTypeId, userId) => {
  return GET(
    `/partymaster/getallbycontcatid?contCatId=${catTypeId}&userId=${userId}`
  );
};

//Add customer
export const AddCustomerapi = (formData) => {
  return POST("/partymaster/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
export const GetAllContactCategorybycontacttype = (concatId, Id) => {
  return GET(
    `/contactcategory/getallbycatid?conCatId=${concatId}&userId=${Id}`
  );
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

//Contact Type
export const GetAllContactType = (Id) => {
  return GET(`/contacttype/getallbyuserid?userId=${Id}`);
};

export const GetAllContactTypeById = (Id) => {
  return GET(`contacttype/getbyid?id=${Id}`);
};

// Add Contact Type
export const AddContactMasterType = (data) => {
  return POST("/contacttype/add", data);
};

// Delete Contact Type
export const DeleteContactTypeMaster = (Id) => {
  return DELETE(`/contacttype/delete?id=${Id}`);
};

//Edit Contact Type
export const EditContactType = (Id, data) => {
  return PUT(`/contacttype/update?id=${Id}`, data);
};

// Update Status of Contact Type
export const updateContactTypeStatus = (Id, statusId) => {
  return PUT(`/contacttype/updatestatus?id=${Id}&isActive=${statusId}`);
};

// Get All Raw Material
export const GetAllRawMaterial = (Id) => {
  return GET(
    `rawmaterial/getallbyuserid?pageNo=1&pageSize=10000&rawMateriaCatlId=0&unitid=0&userid=${Id}`
  );
};
export const DeleteRole = (Id) => {
  return DELETE(`/rolemaster/deletebyid?id=${Id}`);
};

export const GetUnitData = (Id) => {
  return GET(`/unit/getallbyuserid?isActive=true&userid=${Id}`);
};


export const GetUnitById = (Id) => {
  return GET(`/unit/getbyid?id=${Id}`);
};

export const GetSuplier = (id) => {
  return GET(
    `/partymaster/getallbyuserid?partyName=Supplier%20(Vendor)&userId=${id}`
  );
};
export const GetAllQuotation = (id) => {
  return GET(`/quotation/getallbyfilter?userid=${id}`);
};

export const GetAllQuotationByFilter = (enddate, startdate, id) => {
  return GET(
    `/quotation/getallbyfilter?endDate=${enddate}&startDate=${startdate}&userid=${id}`
  );
};

export const GetRawmaterialwithcatID = (catID, id) => {
  return GET(
    `/rawmaterial/getallbyuserid?rawMateriaCatlId=${catID}&unitid=0&userid=${id}`
  );
};
export const SelectedRawMenuallocation = (data) => {
  return POST(`/menuallocation/addorupdatemenuitemrawmat`, data);
};

export const GetRawmaterialforitem = (userid) => {
  return GET(`/rawmaterial/getbyuserid?isActive=true&userid=${userid}`);
};

// Get All Supllier Vendors

export const GetAllSupllierVendors = (Id) => {
  return GET(
    `/partymaster/getallbyuserid?partyName=supplier (Vendor)&userId=${Id}`
  );
};

//Raw Material Allocation
export const GetAllRawMaterialAllocationCategory = (eventId) => {
  return GET(`/rawmaterialcategory/getbyeventid?eventId=${eventId}`);
};

export const GetAllRawMaterialAllocationItems = (categoryId, eventId) => {
  return GET(
    `event-raw-material/getbyevent?eventId=${eventId}&rawMateriaCatlId=${categoryId}`
  );
};

export const RawMaterialallocation = (data) => {
  return POST("/event-raw-material/add-update", data);
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

export const RawMaterialName = (Id, name) => {
  return GET(
    `/contactcategory/getallbyuserid?categoryName=${name}&userId=${Id}`
  );
};

export const SelectedItemNameMenuAllocation = (eventfunctionid, menuitemid) => {
  return GET(
    `/menuallocation/getrawmaterialbyitem?eventFunctionId=${eventfunctionid}&menuItemId=${menuitemid}`
  );
};
export const ContactNameItem = (Id, name) => {
  return GET(`/partymaster/getallbyuserid?partyName=${name}&userId=${Id}`);
};
export const OutsideContactName = (cattypeid, userid) => {
  return GET(
    `/partymaster/getallbycattypeid?catTypeId=${cattypeid}&userId=${userid}`
  );
};

export const StatusChange = (Id, name) => {
  return PUT(`/eventmaster/changeeventstatus?eventId=${Id}&status=${name}`);
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
export const MenuAllocationSave = (data) => {
  return POST(`/menuallocation/add-update`, data);
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
export const GetMenuAllocation = (eventid, Id) => {
  return GET(
    `/menuallocation/getmenuallocation?eventFunctionId=${Id}&eventId=${eventid}`
  );
};
//Delete event
export const DeleteEventMaster = (Id) => {
  return DELETE(`/eventmaster/deleteeventbyid?eventId=${Id}`);
};

// Update Status of Event
export const UpdateEventStatus = (Id, statusId) => {
  return PUT(`/eventmaster/updatestatus?id=${Id}&statusId=${statusId}`);
};

//get all manager and admin
export const Fetchmanager = (Id) => {
  return GET(`/user/getmanagerandadminusersbyclient?clientUserId=${Id}`);
};

export const GetAllPlans = () => {
  return GET(`/plans/getall`);
};

export const GeteventQuoataiondata = (id) => {
  return GET(`/eventmaster/getallbypartyid?partyId=${id}`);
};

export const GetAllRole = (id) => {
  return GET(`/rolemaster/getallbyuserid?userId=${id}`);
};

export const GetUsersByRoleId = (roleId = 2) => {
  return GET(`/user/getallbyroleid?roleId=${roleId}`);
};

// Add Role

export const Addrole = (data) => {
  return POST(`/rolemaster/add`, data);
};
export const GetPages = () => {
  return GET(`/user-rights/getPages`);
};

export const GetRightsBYroleId = (roleId) => {
  return GET(`/user-rights/getByRole?roleId=${roleId}`);
};

export const AddRights = (data) => {
  return POST(`/user-rights/addRights`, data);
};

// GetRolebyId

export const GetRoleById = (id) => {
  return GET(`/rolemaster/getbyid?id=${id}`);
};

export const AddFunction = (data) => {
  return POST(`/functionmaster/add`, data);
};

export const GetAllFunctionsByUserId = (id) => {
  return GET(`/functionmaster/getallbyuserid?userId=${id}`);
};

export const DeleteEventFunctionById = (id) => {
  return DELETE(`/eventfunction/deleteeventfunction?id=${id}`);
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

// profile userbyid

export const getUserById = (id) => {
  return GET(`/user/getbyid?id=${id}`);
};

// ALL Member
export const GetAllMemberByUserId = (id) => {
  return GET(`/user/getallbyuserid?userId=${id}`);
};

// Add Member

export const AddMember = (data) => {
  return POST(`/auth/add`, data);
};

// Delete Member
export const DeleteMember = (Id) => {
  return DELETE(`/user/deletebyid?id=${Id}`);
};

// Edit Member

export const UpdateMember = (id, data) => {
  return PUT(`/auth/update?id=${id}`, data);
};

//Get category Type
export const GetAllCategory = (data) => {
  return GET(`/menucategory/getallbyuserid`, data);
};
//Get category Type
export const GetAllCategoryformenu = (id) => {
  return GET(`/menucategory/getallbyuserid?isActive=true&userid=${id}`);
};

export const Getmenusubcategory = (menucategoryid, userId) => {
  return GET(
    `/menusubcategory/getallbyuserid?isActive=true&menuCategoryId=${menucategoryid}&userid=${userId}`
  );
};

//Get menu preparation items
export const Getmenuprep = (
  eventFunId,
  itemname,
  menuCatId,
  pageNo,
  TotalRecord,
  UserId
) => {
  return GET(
    `/menupreparation/getmenupreparationitems?eventFunctionId=${eventFunId}&itemName=${itemname}&menuCategoryId=${menuCatId}&pageNo=${pageNo}&totalRecord=${TotalRecord}&userId=${UserId}`
  );
};

// get menu items
export const Getmenuitems = (pageno, size, UserId) => {
  return GET(
    `/menuitems/getallbyuserid?page=${pageno}&size=${size}&userId=${UserId}`
  );
};

export const Getmenuitemsusingcatid = (pageno, size, UserId, catid) => {
  return GET(
    `/menuitems/getallbyuserid?menuCatId=${catid}&page=${pageno}&size=${size}&userId=${UserId}`
  );
};

//Get menu preparation items
export const Deleteiteminmenu = (itemId, menuCatId, MenuprepId) => {
  return DELETE(
    `/menupreparation/deletemenupreparationitem?itemId=${itemId}&menuCategoryId=${menuCatId}&menuPreparationId=${MenuprepId}`
  );
};
//Get menu preparation items
export const AddMenuprep = (data) => {
  return POST(`/menupreparation/addOrUpdate`, data);
};

export const UpdateEventPax = (eventId, data) => {
  return PUT(`/eventmaster/updatealleventfunction?id=${eventId}`, data);
};

//Add category Type
export const AddCategory = (data) => {
  return POST(`/menucategory/add`, data);
};

//Add category Type
export const MenuReportData = (
  eventFunctionId,
  eventId,
  catImg,
  catIns,
  catSlogan,
  itemSlogan,
  itemIns,
  lang
) => {
  return GET(
    `/menupreparation/generateexclusivereport2?eventFunctionId=${eventFunctionId}&eventId=${eventId}&isCategoryImage=${catImg}&isCategoryInstruction=${catIns}&isCategorySlogan=${catSlogan}&isItemInstruction=${itemIns}&isItemSlogan=${itemSlogan}&lang=${lang}`
  );
};

//Edit category Type
export const editCategory = (Id, data) => {
  return PUT(`/menucategory/update?id=${Id}`, data);
};

//delete category Type
export const DeleteCategoryId = (Id) => {
  return DELETE(`/menucategory/deletebyid?id=${Id}`);
};

//status category Type
export const UpdateStatus = (Id, status = true) => {
  return PUT(`/menucategory/updatestatus?id=${Id}&isActive=${status}`);
};

// Get Sub category Type
export const GetAllSubCategory = (data) => {
  return GET(`/menusubcategory/getallbyuserid`, data);
};
//for menu item
export const GetAllSubCategorymenuitem = (userId) => {
  return GET(`/menusubcategory/getallbyuserid?userid=${userId}`); // 👈 'userid' (all lowercase)
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

// Registration
export const registerUser = (data) => {
  return POST(`/auth/add`, data);
};

// profile data
export const FetchAllUser = (id) => {
  return GET(`/user/getallbyuserid?userId=${id}`);
};

//update usermaster // also in profile
export const updateusermaster = (id, data) => {
  return PUT(`/auth/update?id=${id}`, data);
};
// all user
export const getAllByRoleId = () => {
  return GET(`/user/getallbyroleid?roleId=${2}`);
};

export const updateStatusApprove = (id) => {
  return PUT(`/auth/isapproved?isApprove=true&userId=${id}`);
};

// Kitchen Area
export const GetAllKitchenAreaById = (id) => {
  return GET(`/kitchenarea/getallbyuserid?userId=${id}`);
};

// addkitechenarea
export const AddKitchenArea = (data) => {
  return POST(`/kitchenarea/add`, data);
};

//updatekitchenarea
export const UpdateKitchenArea = (id, data) => {
  return PUT(`/kitchenarea/update?id=${id}`, data);
};

// deletekitchenarea
export const DeleteKitchenArea = (id) => {
  return DELETE(`/kitchenarea/deletebyid?id=${id}`);
};

//upadtestatuskitecharea
// ✅ services/apiServices.js
export const UpdateStatusKitchenArea = (id, isActive = true) => {
  return PUT(`/kitchenarea/updatestatus?id=${id}&isActive=${isActive}`);
};

// file upload
export const uploadFile = (data) => {
  return UPLOAD(`/file/uploadfile`, data);
};

export const uploadFileformenu = (formData, params) => {
  return UPLOAD(`/file/uploadfile`, formData, {
    params: params,
  });
};

//upload Image
export const uploadProfileImage = (data, queryParams) => {
  return UPLOAD(`/file/uploadfile?${queryParams}`, data);
};

//getmenuitem
export const GetAllMenuItems = ({
  userId,
  itemName = "",
  subCategoryId,
  page = 1,
  size = 10,
}) => {
  const query = `?userId=${userId}&itemName=${itemName}&menuSubCatId=${subCategoryId}&page=${page}&size=${size}`;
  return GET(`/menuitems/getallbyuserid${query}`);
};

//addmenuitem
export const AddMenuItems = (data) => {
  return POST(`/menuitems/add`, data);
};

//delete menu item
export const DeleteMenuItem = (id) => {
  return DELETE(`/menuitems/deletebyid?id=${id}`);
};

//edit menu item
export const UpdateMenuItem = (id, data) => {
  return PUT(`/menuitems/update?id=${id}`, data);
};

//stautsmeniitem
export const updatestatusmneuitem = (id, isActive = true) => {
  return PUT(`/menuitems/updatestatus?id=${id}&isActive=${isActive}`);
};

export const SyncRawmaterialMenuallocation = (id) => {
  return DELETE(`
menuallocation/syncrawmaterialitems?eventFunctionid=${id}`);
};

// Change Password

export const ChangePassword = (data) => {
  return axios.post(`/auth/changepassword`, null, {
    params: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      conPassword: data.conPassword,
      userId: data.userId,
    },
  });
};

// Forgot Password - Request Reset Link

export const requestPasswordResetLink = async (email) => {
  return axios.post(`/auth/forgotpassword`, null, {
    params: { email }, // query param
  });
};

//Otp Verification

// Email OTP verification
export const verifyOtp = async ({ email, otp }) => {
  return axios.post(`/auth/verifyotp`, null, {
    params: { email, otp },
  });
};

// Mobile OTP verification
export const verifyMobileOtp = async ({ phone, otp }) => {
  return axios.post(`/auth/verifyotpformobile`, null, {
    params: { mobileNo: phone, otp },
  });
};

// reset password API
export const resetPassword = async (emailId, newPassword, conPassword) => {
  return axios.post(`/auth/resetpassword`, null, {
    params: { emailId, newPassword, conPassword },
  });
};

export const LoginWithOtp = async (phone) => {
  return axios.post("/auth/loginwithotp", null, {
    params: { mobileNo: phone },
  });
};

//raw material type
export const GetRawType = (id) => {
  return GET(`/rawmaterialcattype/getallbyuserid?userId=${id}`);
};
export const DeleteRawType = (id) => {
  return DELETE(`/rawmaterialcattype/delete?id=${id}`);
};

export const AddRawType = (data) => {
  return POST(`/rawmaterialcattype/add`, data);
};
export const EditRawType = (id, data) => {
  return PUT(`/rawmaterialcattype/update?id=${id}`, data);
};
export const updatestatusrawmaterialtype = (id, currentStatus) => {
  return PUT(
    `/rawmaterialcattype/updatestatus?id=${id}&isActive=${currentStatus}`
  );
};
//raw material category

export const GetRawMaterialcategory = (id) => {
  return GET(
    `/rawmaterialcategory/getallbyuserid?categoryTypeId=0&userid=${id}`
  );
};

export const UpdateSequence = (data) => {
  return PUT(`/rawmaterial/updatesequence`, data);
};

export const DeleteRawMaterialcategory = (id) => {
  return DELETE(`/rawmaterialcategory/delete?id=${id}`);
};

export const AddRawMaterialCat = (data) => {
  return POST(`/rawmaterialcategory/add`, data);
};
export const EditRawMaterialCat = (id, data) => {
  return PUT(`/rawmaterialcategory/update?id=${id}`, data);
};
export const updatestatusrawmatrialcat = (id, currentStatus) => {
  return PUT(
    `/rawmaterialcategory/updatestatus?id=${id}&isActive=${currentStatus}`
  );
};

export const DeleteSuplier = (id) => {
  return DELETE(`/rawmaterialsupplier/deletebyid?id=${id}`);
};

export const Addrawmaterial = (data) => {
  return POST(`/rawmaterial/add`, data);
};

export const Deleterawmaterial = (id) => {
  return DELETE(`/rawmaterial/delete?id=${id}`);
};
export const EditRawMaterial = (id, data) => {
  return PUT(`/rawmaterial/update?id=${id}`, data);
};
export const updateRawMaterialStatus = (id, data) => {
  return PUT(`/rawmaterial/updatestatus?id=${id}&isActive=${data}`);
};

export const Getunit = (id) => {
  return GET(`/unit/getallbyuserid?userid=${id}`);
};

export const SearchUnit = (data, id) => {
  return GET(`/unit/getallbyuserid?unitName=${data}&userid=${id}`);
};

export const DeleteUnit = (id) => {
  return DELETE(`/unit/deletebyid?id=${id}`);
};
export const AddUnitdata = (data) => {
  return POST(`/unit/add`, data);
};

export const EditUnit = (id, data) => {
  return PUT(`/unit/update?id=${id}`, data);
};
export const updateunit = (id, data) => {
  return PUT(`unit/updatestatusbyid?id=${id}&isActive=${data}`);
};

export const Translateapi = (data) => {
  return GET(`/transliterate?text=${data}`);
};

export const GetCustomPackageapi = (id) => {
  return GET(`/custompackage/getallbyuserid?userid=${id}`);
};

export const GetCustomPackageById = (id) => {
  return GET(`/custompackage/getbyid?id=${id}`);
};

export const UpdateCustomPackage = (id, data) => {
  return PUT(`/custompackage/update?id=${id}`, data);
};

export const GetCustomPackageapibyID = (id) => {
  return GET(`/custompackage/getbyid?id=${id}`);
};
export const AddCustomPackageapi = (data) => {
  return POST(`/custompackage/add`, data);
};

export const UpdateCustomPackageapi = (id, data) => {
  return PUT(`/custompackage/update?id=${id}`, data);
};

export const DeleteCustomPackageapi = (id) => {
  return DELETE(`/custompackage/deletebyid?id=${id}`);
};

export const UpdateCustomPackageStatusapi = (id, isActive) => {
  return PUT(`/custompackage/updatestatus?id=${id}&isActive=${isActive}`);
};

export const GetInvoiceByEventId = (eventId) => {
  return GET(`/invoice/getbyeventid?eventId=${eventId}`);
};

export const GetInvoiceByUserId = (id) => {
  return GET(`/invoice/getalluserid?userid=${id}`);
};

export const AddInvoice = (data) => {
  return POST(`/invoice/add`, data);
};

//add labour
export const AddUpdateLabor = (payload) => {
  return POST("/labor/add-update", payload);
};

//get labour by event id
export const GetEventLaborDetails = (eventFunctionId, eventId) => {
  return GET(
    `/labor/get?eventFunctionId=${eventFunctionId}&eventId=${eventId}`
  );
};

export const UpdateInvoice = (id, data) => {
  return PUT(`/invoice/update?id=${id}`, data);
};

export const GetAllInvoice = (id) => {
  return GET(`/invoice/getallbyfilter?userid=${id}`);
};

export const GetAllInvoicedatabyfilter = (enddate, startdate, id) => {
  return GET(
    `/invoice/getallbyfilter?endDate=${enddate}&startDate=${startdate}&userid=${id}`
  );
};

export const GeteventInvoicedata = (id) => {
  return GET(`/eventmaster/getallbypartyid?partyId=${id}`);
};

export const GetInvoice = (id) => {
  return GET(`/invoice/getbyeventid?eventId=${id}`);
};

export const GetEventLabourBySupplier = (eventFunctionId, eventId, partyId) => {
  return GET(
    `/labor/getBySupplier?eventFunctionId=${eventFunctionId}&eventId=${eventId}&partyId=${partyId}`
  );
};

export const AddExtraExpenseApi = (data) => {
  return POST(`/extra-expense/add`, data);
};

export const GetExtraExpenseByEvent = (eventFunctionId, eventId) => {
  return GET(
    `/extra-expense/getallbyeventId?eventFunctionId=${eventFunctionId}&eventId=${eventId}`
  );
};

export const DeleteExtraExpense = (id) => {
  return DELETE(`/extra-expense/delete?id=${id}`);
};

export const UpdateExtraExpense = (id, payload) => {
  return PUT(`/extra-expense/update?id=${id}`, payload);
};

export const GetAllPlansForSuperAdmin = () => {
  return GET(`/plans/getall`);
};

export const AddNewPlan = (data) => {
  return POST(`/plans/add`, data);
};

export const DeletePlanById = (id) => {
  return DELETE(`/plans/deletebyid?id=${id}`);
};

export const UpdatePlanById = (id, data) => {
  return PUT(`/plans/update?id=${id}`, data);
};

export const GetPlansByBillingCycle = (cycle) => {
  return GET(`/plans/getallbybillingcycle?billingCycle=${cycle}`);
};

export const GetAllLabourShift = (Id) => {
  return GET(`/shift/getallbyuserid?userId=${Id}`);
};

export const AddLabourShift = (data) => {
  return POST(`/shift/add`, data);
};

export const deleteLabourShiftById = (id) => {
  return DELETE(`/shift/deletebyid?id=${id}`);
};
export const EditLabourShiftAPI = (id, data) => {
  return PUT(`/shift/update?id=${id}`, data);
};

export const GetShiftsByUser = (userId) => {
  return GET(`/shift/getallbyuserid?userId=${userId}`);
};

export const AddUserPlan = (data) => {
  return POST(`/userplanshistory/adduserplan`, data);
};

export const CreatePaymentOrder = (data) => {
  return POST(`/userplanshistory/createPaymentOrder`, data);
};

export const GetDishCostingByEventFunction = (eventId, eventFunctionId) => {
  return GET(
    `/dish-costing/get?eventId=${eventId}&eventFunctionId=${eventFunctionId}`
  );
};

export const GetRenewalCustomer = (startDate, endDate, isActive = true) => {
  return GET(
    `/userplanshistory/renewal-customer-info?startDate=${startDate}&endDate=${endDate}&isActive=${isActive}`
  );
};

export const DatabaseReadExcle = (formData) => {
  return POST("/excel-parsing/readExcel", formData);
};

export const GetAllDb = () => {
  return GET(`/excel-parsing/getAll`);
};

export const GetDbAssignedDetails = (dbPlanningId) => {
  return GET(`/excel-parsing/getById?db_planning_id=${dbPlanningId}`);
};

export const GetUserlogs = (data) => {
  return GET(`/user-logs/getUserLogs/${data}`);
};

export const AssignDb = (payload) => {
  // payload = { databaseName, customerId, instructions }
  return POST(`/excel-parsing/assignDb`, payload);
};

// Super Admin Invoice

export const SuperAdminAddInvoice = (data) => {
  return POST(`/invoice-operations/addInvoice`, data);
};

// Subscription API

export const SubscriptionByUser = (id) => {
  return GET(`userplanshistory/getplanhistorybyuser?userId=${id}`);
};

//Update Member

export const UpdateMemberById = (id, data) => {
  return PUT(`/user/updatemember?id=${id}`, data);
};

export const GetALLMemberDetailsByID = (id) => {
  return GET(`/user/getmemberbyid?id=${id}`);
};

export const GetVenueType = (id) => {
  return GET(`/venuemaster/getallbyuser?userId=${id}`);
};

export const GetClientwisedashboardata = (id) => {
  return GET(`/dashboard/admin/userWiseDashboardData?userId=${id}`);
};
export const GetClientdashboardpiechart1 = (date, useriD) => {
  return GET(
    `/dashboard/admin/userWiseDashboardPieChart1?dateString=${date}&userId=${useriD}`
  );
};

export const GetClientdashboardpiechart3 = (date, useriD) => {
  return GET(
    `/dashboard/admin/userWiseEventQuotationPieChart3?dateString=${date}&userId=${useriD}`
  );
};
export const GetClientdashboardpiechart2 = (date, useriD) => {
  return GET(
    `/dashboard/admin/userWiseSalesInvoicePieChart2?dateString=${date}&userId=${useriD}`
  );
};

export const GetClienteventdata = (startdate, enddate, useriD) => {
  return GET(
    `/dashboard/admin/getEventsByUserAndDate?endDate=${enddate}&startDate=${startdate}&userId=${useriD}`
  );
};

export const Getmostsellingitems = (enddate, startdate, userId) => {
  return GET(
    `/dashboard/admin/getMostSellingItems?endDate=${enddate}&startDate=${startdate}&userId=${userId}`
  );
};

export const AddVenueTypeApi = (data) => {
  return POST(`/venuemaster/add`, data);
};

export const DeleteVenueTypeApi = (venueId) => {
  return DELETE(`/venuemaster/deletebyid?id=${venueId}`);
};

// services/apiServices.js
export const UpdateVenueTypeApi = (venueId, data) => {
  return PUT(`/venuemaster/update?id=${venueId}`, data);
};

export const UpdateVenueStatusApi = (id, status) => {
  return PUT(`/venuemaster/updatestatus?id=${id}&isActive=${status}`);
};

export const TranslateGujarati = (data) => {
  return POST(`/transliterate/to-gujarati`, data);
};

export const TranslateHindi = (data) => {
  return POST(`/transliterate/to-hindi`, data);
};

export const deleteRawmatrialcatidInmenuitem = (data) => {
  return DELETE(`/menuitems/deleteitemrawmaterialbyid `, {
    data: data,
  });
};

export const deleteFunction = (id) => {
  return DELETE(`/eventfunction/deleteeventfunction?id=${id}`);
};

export const SuperAdminDashboardPlanWiseTotal = () => {
  return GET(`/dashboard/superadmin/planWiseTotal`);
};

export const SuperAdminDashboardTotalUserAndPlan = () => {
  return GET(`/dashboard/superadmin/getTotalUserAndPlanData`);
};

export const GetRawmaterialItemByRecipe = (menuId, id) => {
  return GET(
    `/menuitems/getmenuitemrawmaterialbymenuid?menuItemId=${menuId}&userId=${id}`
  );
};

export const SuperAdminDashboardMonthWiseData = (
  endDate,
  planId,
  startDate
) => {
  return GET(
    `/dashboard/superadmin/getMonthWisePlanTotal?endDate=${endDate}&planId=${planId}&startDate=${startDate}`
  );
};

export const DeleteRawMaterialItem = (Id) => {
  return DELETE(`/menuallocation/deletemenuitemrawmaterial?id=${Id}`);
};
export const GetSuperalladmininvoice = () => {
  return GET(`/invoice-operations/getAllAdminInvoice`);
};

export const GetAdminInvoiceById = (id) => {
  return GET(`/invoice-operations/getadmininvoicebyid?id=${id}`);
};

export const deleteMenuItemRawMaterial = (id) => {
  return DELETE(`/menuallocation/deletemenuitemrawmaterial?id=${id}`);
};

export const deleteDownPayment = (id) => {
  return DELETE(`/user/deleteuserdownpaymentbyid?id=${id}`);
};

export const Addtemplate = (data) => {
  return POST(`/templatemodulemaster/add`, data);
};

export const GettemplatebyuserId = () => {
  return GET(`templatemodulemaster/getall`);
};

export const Deletetemplatebyid = (id) => {
  return DELETE(`/templatemodulemaster/deletebyid?id=${id}`);
};

export const Edittemplatebyid = (id, data) => {
  return PUT(`/templatemodulemaster/update?id=${id}`, data);
};


export const GetAllTicketsByUserId = (id) => {
  return GET(`/ticket/getallbyuserid?userId=${id}`);
};

export const GetAllInteraction = () => {
  return GET(`/interaction/getall`);
};

export const AddInteraction = (data) => {
  return POST(`/interaction/add`, data);
};

export const EditInteraction = (id, data) => {
  return PUT(`/interaction/update?id=${id}`, data);
};

export const DeleteTicket = (Id) => {
  return DELETE(`/ticket/delete?id=${Id}`);
};

export const AddTickets = (data) => {
  return POST(`/ticket/add`, data);
};

export const GetOutsideSummary = (eventfunID, eventId, type) => {
  return GET(
    `/menuallocation/getagencywithitemsbytype?eventFunctionId=${eventfunID}&eventId=${eventId}&type=${type}`
  );
};


export const AddComments = (data) => {
  return POST(`/ticketcomment/add`, data);
};

export const GetCommentsByTicketId = (id) => {
  return GET(`/ticketcomment/getallbyticketid?ticketId=${id}`);
}

export const DeleteComment = (Id) => {
  return DELETE(`/ticketcomment/delete?id=${Id}`);
};

export const EditComment = (id, data) => {
  return POST(`/ticketcomment/update?id=${id}`, data);
};


export const EditTicket = (id, data) => {
  return PUT(`/ticket/update?id=${id}`, data);
};


export const MenuAllocationTypeSummary = (event_func_id, event_id, type) => {
  return GET(`menuallocation/getagencywithitemsbytype?eventFunctionId=${event_func_id}&eventId=${event_id}&type=${type}`);
}
export const AddLead = (data) => {
  return POST(`/leadmaster/add`, data);
}

export const GetAllleadmaster = () => {
  return GET(`/leadmaster/getAll`);
}

export const GetLeadCode = () => {
  return GET(`/leadmaster/generateLeadCode`);
};


export const DeleteLeadbyID = (id) => {
  return DELETE(`/leadmaster/deleteById?id=${id}`);
};

export const UpdateleadbyID = (id, payload) => {
  return PUT(`/leadmaster/update?id=${id}`, payload);
}
export const GetLeadByID = (id) => {
  return GET(`/leadmaster/getById?id=${id}`);
}

export const GetFilteredFollowUps = ({ startDate, endDate, isCreated, leadId }) => {
  return GET(
    `/leadmaster/getFolloupDetails?startDate=${startDate}&endDate=${endDate}&isCreated=${isCreated}&leadId=${leadId}`
  );
};
export const AddExpensemanagement = (data) => {
  return POST("/expensemanagement/add", data);
};


export const GETExpenseBYUserType = ({ eventId, userId, userType }) => {
  return GET(
    `/expensemanagement/getexpensebyusertype?eventId=${eventId}&userId=${userId}&userType=${userType}`
  );
};

export const DeleteByExpenseID = (id) => {
  return DELETE(`/expensemanagement/deletebyid?expenseId=${id}`);
};


export const AddCustomTheme = (formData) => {
  return POST("/templatemaster/add", formData);
};

export const GetAllCustomTheme = () => {
  return GET(`/templatemaster/getall`);
}