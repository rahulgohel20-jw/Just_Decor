import { Navigate, Route, Routes } from "react-router";
import { Demo1DarkSidebarPage } from "@/pages/dashboards";
import {
  ProfileActivityPage,
  ProfileBloggerPage,
  CampaignsCardPage,
  CampaignsListPage,
  ProjectColumn2Page,
  ProjectColumn3Page,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage,
} from "@/pages/public-profile";
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage,
} from "@/pages/account";
import {
  NetworkAppRosterPage,
  NetworkMarketAuthorsPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSocialPage,
  NetworkUserCardsTeamCrewPage,
  NetworkSaasUsersPage,
  NetworkStoreClientsPage,
  NetworkUserTableTeamCrewPage,
  NetworkVisitorsPage,
} from "@/pages/network";
import { AuthPage } from "@/auth";
import { RequireAuth } from "@/auth/RequireAuth";
import { Demo1Layout } from "@/layouts/demo1";
import { ErrorsRouting } from "@/errors";
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage,
} from "@/pages/authentication";
import { LeadPage, LeadDetailPage, OverviewPage } from "@/pages/lead";
import { ProductListDetail, ProductListPage } from "@/pages/product";
import { ContactDetail, ContactListPage } from "@/pages/contact";
import { LinkList } from "@/pages/link";
import { CompanyListPage, CompanyDetails } from "@/pages/company";
import { SalesTeamList, UserRoleList, MemberList } from "@/pages/team";
import {
  NotificationsSettingsPage,
  GeneralSettingsPage,
  SubscriptionSettingsPage,
  ChannelSettingsPage,
  UtilityPage,
} from "@/pages/setting";
import { BillingOverviewPage, WalletLogsPage } from "@/pages/billing";
import {
  ApplicationPage,
  TicketsPage,
  TutorialsPage,
  EventsPage,
  RaiseTicketPage,
  ProgressChecklistPage,
} from "@/pages/support";
import { FollowUpListPage } from "@/pages/follow-up";
import {
  TaskListPage,
  TaskTemplatePage,
  TaskDirectoryPage,
  TaskDashboard,
  MyTask,
} from "@/pages/tasks";

import { Holiday } from "@/pages/Leave/holiday";
import { MyLeaves } from "@/pages/Leave/my-leaves";
import { Approval } from "@/pages/Leave/approval";
import { Myattendance } from "@/pages/Leave/my-attendance/Myattendance";
import Allleave from "@/pages/Leave/all-leave/Allleave";
import { AllAttendance } from "@/pages/Leave/all-attendance";
import { LeaveType } from "@/pages/Leave/settings/leave-type/LeaveType";

import { AttendanceSetting } from "@/pages/Leave/settings/attendance-settings/AttendanceSettings";
import { OfficeSetting } from "@/pages/Leave/settings/offices-settings/OfficeSettings";

import Leavedashboard from "@/pages/Leave/dashboard/Leavedashboard";
import CalendarPage from "@/pages/Event/CalendarPage";
import CreateEventPage from "@/pages/Event/CreateEventPage";
import EventListPage from "@/pages/Event/EventListPage";
import EventPreparationPage from "@/pages/Event/EventPreparationPage";
import EventPlanningPage from "../pages/Event/EventPlanningPage";
import EventMenuAllocationPage from "@/pages/Event/EventMenuAllocationPage";
import RawMaterialAllocationPage from "@/pages/Event/RawMaterialAllocationPage";
import LabourOtherManagementPage from "@/pages/Event/LabourOtherManagementPage";
import CustomPackage from "@/pages/Event/CustomPackage";
import OrderBookingReportsPage from "@/pages/Event/OrderBookingReportsPage";
import DishCostingPage from "@/pages/Event/DishCostingPage";
import QuotationPage from "@/pages/Event/QuotationPage";
import EventInvoicePage from "@/pages/Event/EventInvoicePage";
import ProformaInvoicePage from "@/pages/Event/ProformaInvoicePage";
import AddInvoicePage from "@/pages/Event/AddInvoicePage";
import InvoiceViewPage from "@/pages/Event/InvoiceViewPage";
import CustomerMaster from "@/pages/master/customer";
import AllMemberMaster from "@/pages/master/all-menbers";
import FunctionsMaster from "@/pages/master/functions";
import MealMaster from "@/pages/master/meals";
import ContactCategoryMaster from "@/pages/master/contact-category";
import EventTypeMaster from "@/pages/master/Event-type";
import UnitMaster from "@/pages/master/unit";
import MenuCategoryMaster from "@/pages/master/MenuCategory";
import MenuSubCategory from "@/pages/master/MenuSubCategory";
import MenuKitchenArea from "@/pages/master/MenuKitchenArea";
import MenuItemsMaster from "@/pages/master/MenuItems";
import EstimatePage from "@/pages/Event/EstimatePage";
import { Contact } from "lucide-react";
import StateSearchForm from "@/pages/StateSearch";
import AllUser from "@/pages/master/user-master/alluser";
import AllPlan from "@/pages/master/user-master/allplan";
import RoleMaster from "@/pages/master/role";
import RawMaterialMaster from "@/pages/master/raw-material-category";
import RawMaterialTypeMaster from "@/pages/master/raw-material-type";
import ContactTypeMaster from "@/pages/master/Contact-master";
import RawMaterial from "@/pages/master/Raw-Material";
import CustomPackageMaster from "@/pages/master/custom-package";
import AddCustomPackage from "@/pages/master/custom-package/Add-customepackage/AddCustomPackage";
import InvoiceDashboard from "@/pages/sales/invoice/InvoiceDashboard/InvoiceDashboard";
import InvoiceList from "@/pages/sales/invoice/InvoiceList/InvoiceList";
import QuotationDashboard from "@/pages/sales/quotaion/QuotationDashboard/QuotaionDashboard";
import QuotationViewPage from "@/pages/sales/quotaion/QuotationList/QuotationList";
import QuickCustomPackage from "@/pages/Event/QuickCustomPackage";
import Labourshiftmaster from "../pages/master/labour-shift";
import Priceplan from "@/partials/modals/priceplan/Priceplan";
import ReportsConfig from "@/pages/Reports/ReportsConfig";
import DateWiseReport from "@/pages/Reports/DateWiseReport";
import ReportThemes from "@/pages/Event/ReportThemesPage";
import Editor from "@/pages/Event/ReportThemesPage/ReportThemeEditor/Editor";
import ClientDashboard from "../pages/clientdashboard/ClientDashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import ReportCustomTheme from "@/pages/Reportcustomethemes";
import Database from "../pages/master/superadmindatabase";
import Plan from "../components/plan/Plan";
import SuperadminInvoice from "../components/superadmininvoice/SuperadminInvoice";
import Addinvoice from "../components/superadminInvoice/Addinvoice";
import RenewalCustomer from "../pages/renewalcustomer/RenewalCustomer";
import SuperCalendarPage from "../pages/super-admin/calender";
import SuperAdminMember from "../pages/superadminmember/SuperAdminMember";
import SuperAdminMemberEdit from "../pages/superadminmember/SuperAdminMemberEdit";
import UserRights from "../pages/userrights/UserRights";
import SuperAdminUserLogs from "../pages/superadminmember/SuperAdminUserLogs";
import VenuetypeMaster from "../pages/master/Venue-type";

const AppRoutingSetup = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          {/* project routs */}
          <Route path="/StateSearch" element={<StateSearchForm />} />
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/super-dashboard" element={<Dashboard />} />
          <Route path="/contacts/details" element={<ContactDetail />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/lead" element={<LeadPage />} />
          <Route path="/lead/details" element={<LeadDetailPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/plans" element={<Plan />} />
          <Route path="/company" element={<CompanyListPage />}></Route>
          <Route path="/companydetails" element={<CompanyDetails />}></Route>
          <Route path="/followup" element={<FollowUpListPage />}></Route>
          {/* Theme routes */}
          <Route path="/company" element={<CompanyListPage />}></Route>
          <Route path="/companydetail" element={<CompanyDetails />}></Route>
          <Route path="/links" element={<LinkList />}></Route>
          <Route path="/product" element={<ProductListPage />}></Route>
          <Route path="/product/detail" element={<ProductListDetail />}></Route>
          <Route path="/team/seals-team" element={<SalesTeamList />} />
          <Route path="/team/user-role" element={<UserRoleList />} />
          <Route path="/team/all-members" element={<MemberList />} />
          <Route path="/database" element={<Database />} />
          {/* event management routes */}
          <Route path="/calendar" element={<CalendarPage />} />
          <Route
            path="/quick-custom-package"
            element={<QuickCustomPackage />}
          />
          <Route path="/event" element={<EventListPage />} />
          <Route path="/add-event" element={<CreateEventPage />} />
          <Route
            path="/edit-event/:eventId"
            element={<CreateEventPage mode="edit" />}
          />
          <Route
            path="/edit-event/:eventId/copy"
            element={<CreateEventPage mode="copy" />}
          />
          <Route path="/menu-preparation" element={<EventPlanningPage />} />
          <Route path="/menu-preparations" element={<EventPreparationPage />} />
          <Route path="/admin-invoice" element={<SuperadminInvoice />} />
          <Route path="/user-rights" element={<UserRights />} />

          <Route path="/renewal-history" element={<RenewalCustomer />} />
          <Route path="/addInvoice" element={<Addinvoice />} />
          <Route
            path="/menu-preparations/:eventId"
            element={<EventPreparationPage mode="menu" />}
          />
          <Route
            path="/menu-preparation/:eventId"
            element={<EventPlanningPage mode="menu" />}
          />
          <Route
            path="/menu-allocation/:eventId"
            element={<EventMenuAllocationPage />}
          />
          <Route
            path="/raw-material-allocation"
            element={<RawMaterialAllocationPage />}
          />
          <Route path="/custom-package" element={<CustomPackage />} />
          <Route path="/report-congiguration" element={<ReportsConfig />} />
          <Route path="/report-datewise" element={<DateWiseReport />} />
          <Route
            path="/labour-and-other-management"
            element={<LabourOtherManagementPage />}
          />
          <Route
            path="/labour-and-other-management/:eventId"
            element={<LabourOtherManagementPage mode="labour" />}
          />
          <Route
            path="/order-booking-reports"
            element={<OrderBookingReportsPage />}
          />
          <Route path="/dish-costing/:eventId" element={<DishCostingPage />} />

          <Route path="/quotation" element={<QuotationPage />} />
          <Route path="/quotation/:eventId" element={<QuotationPage />} />
          <Route path="/event-invoice" element={<EventInvoicePage />} />
          <Route path="/proforma-invoice" element={<ProformaInvoicePage />} />
          <Route path="/invoice-dashboard" element={<EventInvoicePage />} />
          <Route path="/add-invoice" element={<AddInvoicePage />} />
          <Route path="/view-invoice" element={<InvoiceViewPage />} />
          <Route path="/estimate" element={<EstimatePage />} />
          <Route path="/report-themes" element={<ReportThemes />} />
          <Route path="/report-themes/editor" element={<Editor />} />
          <Route path="/reportcustomethemes" element={<ReportCustomTheme />} />
          <Route
            path="/super-reportcustomethemes"
            element={<ReportCustomTheme />}
          />
          <Route path="/super-calendar" element={<SuperCalendarPage />} />
          {/* Sales */}
          <Route
            path="/sales/invoice-dashboard"
            element={<InvoiceDashboard />}
          />
          <Route
            path="/sales/invoice-list/:PartyId/:EventId"
            element={<InvoiceList />}
          />
          <Route path="/sales/add-invoice" element={<AddInvoicePage />} />
          <Route path="/quotation-dashboard" element={<QuotationDashboard />} />
          <Route path="/price" element={<Priceplan />} />
          <Route
            path="/sales/quotation-list/:PartyId/:EventId"
            element={<QuotationViewPage />}
          />
          {/* Masters */}
          <Route path="/master/customers" element={<CustomerMaster />} />
          <Route
            path="/master/raw-material-master"
            element={<RawMaterialMaster />}
          />
          <Route
            path="/master/raw-material-type-master"
            element={<RawMaterialTypeMaster />}
          />
          <Route path="/master/all-members" element={<AllMemberMaster />} />
          <Route path="/master/functions" element={<FunctionsMaster />} />
          <Route path="/master/meals" element={<MealMaster />} />
          <Route
            path="/master/contact-categories"
            element={<ContactCategoryMaster />}
          />
          <Route path="/master/event-type" element={<EventTypeMaster />} />
          <Route path="/master/venue-type" element={<VenuetypeMaster />} />
          <Route path="/master/unit" element={<UnitMaster />} />
          <Route path="/master/user-master" element={<AllUser />} />
          <Route path="/superadmin-logs" element={<SuperAdminUserLogs />} />

          <Route path="/Superadmin-member" element={<SuperAdminMember />} />
          <Route
            path="/Superadmin-member-edit"
            element={<SuperAdminMemberEdit />}
          />

          <Route path="/master/user-master/plan" element={<AllPlan />} />
          <Route
            path="/master/menu-category"
            element={<MenuCategoryMaster />}
          />
          <Route
            path="/master/menu-sub-category"
            element={<MenuSubCategory />}
          />
          <Route
            path="/master/menu-kitchan-area"
            element={<MenuKitchenArea />}
          />
          <Route path="/master/menu-item" element={<MenuItemsMaster />} />
          <Route path="/master/role" element={<RoleMaster />} />
          <Route path="/master/contact-type" element={<ContactTypeMaster />} />
          <Route path="/master/raw-material" element={<RawMaterial />} />
          <Route
            path="/master/custom-package"
            element={<CustomPackageMaster />}
          />
          <Route
            path="/master/custom-package/addpackage"
            element={<AddCustomPackage />}
          />
          <Route path="/master/labour-shift" element={<Labourshiftmaster />} />
          {/* Tasks routes */}
          <Route path="/tasks/dashboard" element={<TaskDashboard />}></Route>
          <Route path="task/mytask" element={<MyTask />}></Route>
          <Route path="/tasks" element={<TaskListPage />}></Route>
          <Route
            path="/tasks-directory"
            element={<TaskDirectoryPage />}
          ></Route>
          <Route path="/tasks-template" element={<TaskTemplatePage />}></Route>
          {/* leavs route */}
          <Route path="/approval" element={<Approval />}></Route>
          <Route path="/holiday" element={<Holiday />}></Route>
          <Route path="/myleaves" element={<MyLeaves />}></Route>
          <Route path="/allleave" element={<Allleave />}></Route>
          <Route path="allattendance" element={<AllAttendance />}></Route>
          <Route path="leavetype" element={<LeaveType />}></Route>
          <Route path="/myattendance" element={<Myattendance />}></Route>
          <Route path="/leave-dashboard" element={<Leavedashboard />}></Route>
          <Route
            path="/attendance-setting"
            element={<AttendanceSetting></AttendanceSetting>}
          ></Route>
          <Route path="officesetting" element={<OfficeSetting />}></Route>
          {/* Settings routes */}
          <Route path="/settings/general" element={<GeneralSettingsPage />} />
          <Route path="/settings/utility" element={<UtilityPage />} />
          <Route
            path="/settings/subscription"
            element={<SubscriptionSettingsPage />}
          />
          <Route path="/settings/channel" element={<ChannelSettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationsSettingsPage />}
          />
          {/* Support routes */}
          <Route path="/support/events" element={<EventsPage />} />
          <Route path="/support/tutorials" element={<TutorialsPage />} />
          <Route path="/support/tickets" element={<TicketsPage />} />
          <Route path="/support/application" element={<ApplicationPage />} />
          <Route
            path="/support/progress-checklist"
            element={<ProgressChecklistPage />}
          />
          <Route path="/support/raise-ticket" element={<RaiseTicketPage />} />
          {/* Billing routes */}
          <Route path="/billing/overview" element={<BillingOverviewPage />} />
          <Route path="/billing/wallet-logs" element={<WalletLogsPage />} />
          {/* Theme route */}
          <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
          <Route
            path="/public-profile/profiles/default"
            element={<ProfileDefaultPage />}
          />
          <Route
            path="/public-profile/profiles/creator"
            element={<ProfileCreatorPage />}
          />
          <Route
            path="/public-profile/profiles/company"
            element={<ProfileCompanyPage />}
          />
          <Route
            path="/public-profile/profiles/nft"
            element={<ProfileNFTPage />}
          />
          <Route
            path="/public-profile/profiles/blogger"
            element={<ProfileBloggerPage />}
          />
          <Route
            path="/public-profile/profiles/crm"
            element={<ProfileCRMPage />}
          />
          <Route
            path="/public-profile/profiles/gamer"
            element={<ProfileGamerPage />}
          />
          <Route
            path="/public-profile/profiles/feeds"
            element={<ProfileFeedsPage />}
          />
          <Route
            path="/public-profile/profiles/plain"
            element={<ProfilePlainPage />}
          />
          <Route
            path="/public-profile/profiles/modal"
            element={<ProfileModalPage />}
          />
          <Route
            path="/public-profile/projects/3-columns"
            element={<ProjectColumn3Page />}
          />
          <Route
            path="/public-profile/projects/2-columns"
            element={<ProjectColumn2Page />}
          />
          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route
            path="/public-profile/network"
            element={<ProfileNetworkPage />}
          />
          <Route
            path="/public-profile/activity"
            element={<ProfileActivityPage />}
          />
          <Route
            path="/public-profile/campaigns/card"
            element={<CampaignsCardPage />}
          />
          <Route
            path="/public-profile/campaigns/list"
            element={<CampaignsListPage />}
          />
          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
          <Route
            path="/account/home/get-started"
            element={<AccountGetStartedPage />}
          />
          <Route
            path="/account/home/user-profile"
            element={<AccountUserProfilePage />}
          />
          <Route
            path="/account/home/company-profile"
            element={<AccountCompanyProfilePage />}
          />
          <Route
            path="/account/home/settings-sidebar"
            element={<AccountSettingsSidebarPage />}
          />
          <Route
            path="/account/home/settings-enterprise"
            element={<AccountSettingsEnterprisePage />}
          />
          <Route
            path="/account/home/settings-plain"
            element={<AccountSettingsPlainPage />}
          />
          <Route
            path="/account/home/settings-modal"
            element={<AccountSettingsModalPage />}
          />
          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route
            path="/account/billing/enterprise"
            element={<AccountEnterprisePage />}
          />
          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route
            path="/account/billing/history"
            element={<AccountHistoryPage />}
          />
          <Route
            path="/account/security/get-started"
            element={<AccountSecurityGetStartedPage />}
          />
          <Route
            path="/account/security/overview"
            element={<AccountOverviewPage />}
          />
          <Route
            path="/account/security/allowed-ip-addresses"
            element={<AccountAllowedIPAddressesPage />}
          />
          <Route
            path="/account/security/privacy-settings"
            element={<AccountPrivacySettingsPage />}
          />
          <Route
            path="/account/security/device-management"
            element={<AccountDeviceManagementPage />}
          />
          <Route
            path="/account/security/backup-and-recovery"
            element={<AccountBackupAndRecoveryPage />}
          />
          <Route
            path="/account/security/current-sessions"
            element={<AccountCurrentSessionsPage />}
          />
          <Route
            path="/account/security/security-log"
            element={<AccountSecurityLogPage />}
          />
          <Route
            path="/account/members/team-starter"
            element={<AccountTeamsStarterPage />}
          />
          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route
            path="/account/members/team-info"
            element={<AccountTeamInfoPage />}
          />
          <Route
            path="/account/members/members-starter"
            element={<AccountMembersStarterPage />}
          />
          <Route
            path="/account/members/team-members"
            element={<AccountTeamMembersPage />}
          />
          <Route
            path="/account/members/import-members"
            element={<AccountImportMembersPage />}
          />
          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route
            path="/account/members/permissions-toggle"
            element={<AccountPermissionsTogglePage />}
          />
          <Route
            path="/account/members/permissions-check"
            element={<AccountPermissionsCheckPage />}
          />
          <Route
            path="/account/integrations"
            element={<AccountIntegrationsPage />}
          />
          <Route
            path="/account/notifications"
            element={<AccountNotificationsPage />}
          />
          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route
            path="/account/appearance"
            element={<AccountAppearancePage />}
          />
          <Route
            path="/account/invite-a-friend"
            element={<AccountInviteAFriendPage />}
          />
          <Route path="/account/activity" element={<AccountActivityPage />} />
          <Route
            path="/network/get-started"
            element={<NetworkGetStartedPage />}
          />
          <Route
            path="/network/user-cards/mini-cards"
            element={<NetworkMiniCardsPage />}
          />
          <Route
            path="/network/user-cards/team-crew"
            element={<NetworkUserCardsTeamCrewPage />}
          />
          <Route
            path="/network/user-cards/author"
            element={<NetworkAuthorPage />}
          />
          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route
            path="/network/user-cards/social"
            element={<NetworkSocialPage />}
          />
          <Route
            path="/network/user-table/team-crew"
            element={<NetworkUserTableTeamCrewPage />}
          />
          <Route
            path="/network/user-table/app-roster"
            element={<NetworkAppRosterPage />}
          />
          <Route
            path="/network/user-table/market-authors"
            element={<NetworkMarketAuthorsPage />}
          />
          <Route
            path="/network/user-table/saas-users"
            element={<NetworkSaasUsersPage />}
          />
          <Route
            path="/network/user-table/store-clients"
            element={<NetworkStoreClientsPage />}
          />
          <Route
            path="/network/user-table/visitors"
            element={<NetworkVisitorsPage />}
          />
          <Route
            path="/auth/welcome-message"
            element={<AuthenticationWelcomeMessagePage />}
          />
          <Route
            path="/auth/account-deactivated"
            element={<AuthenticationAccountDeactivatedPage />}
          />
          <Route
            path="/authentication/get-started"
            element={<AuthenticationGetStartedPage />}
          />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};
export { AppRoutingSetup };
