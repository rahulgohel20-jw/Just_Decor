const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.userBasicDetails?.role?.id;
  } catch (error) {
    console.error("Error parsing userData:", error);
    return null;
  }
};

const userRoleId = getUserRole();
const isSuperAdmin = userRoleId === 1;

const allMenuItems = [
  {
    title: "Dashboard",
    icon: "element-11 text-primary",
    path: "/",
  },
  {
    title: "Events",
    icon: "ki-filled ki-calendar-tick text-primary",
    children: [
      {
        title: "Calendar",
        path: "/calendar",
      },
      {
        title: "Event List",
        path: "/event",
      },
    ],
  },
  {
    title: "Master",
    icon: "ki-filled ki-abstract-26 text-primary",
    children: [
      {
        title: "Contact Type",
        path: "/master/contact-type",
      },
      {
        title: "Contact Categories",
        path: "/master/contact-categories",
      },
      {
        title: "Customers",
        path: "/master/customers",
      },
      {
        title: "Function Type",
        path: "/master/functions",
      },
      {
        title: "Meal Type",
        path: "/master/meals",
      },
      {
        title: "Event Type",
        path: "/master/event-type",
      },
      {
        title: "Unit ",
        path: "/master/unit",
      },
      {
        title: "Labour Shift",
        path: "/master/labour-shift",
      },
      {
        title: "Custom Package",
        path: "/master/custom-package",
      },
      {
        title: "Member",
        icon: "ki-filled ki-abstract-18 text-primary",
        children: [
          {
            title: "All Members",
            path: "/master/all-members",
          },
          {
            title: "Role",
            path: "/master/role",
          },
        ],
      },
    ],
  },
  {
    title: "Raw Material",
    icon: "ki-filled ki-badge text-primary",
    children: [
      {
        title: "Raw Material Type",
        path: "/master/raw-material-type-master",
      },
      {
        title: "Raw Material Category",
        path: "/master/raw-material-master",
      },
      {
        title: "Raw Material",
        path: "/master/raw-material",
      },
    ],
  },
  {
    title: "Menu Item",
    icon: "ki-filled ki-additem text-primary",
    children: [
      {
        title: "Menu Item Sub Category",
        path: "/master/menu-sub-category",
      },
      {
        title: "Menu Item Category",
        path: "/master/menu-category",
      },
      {
        title: "Kitchen Area",
        path: "/master/menu-kitchan-area",
      },
      {
        title: "Menu Item",
        path: "/master/menu-item",
      },
    ],
  },
  {
    title: "Reports",
    icon: "ki-filled ki-airplane text-primary",
    children: [
      {
        title: "All Data Report",
        path: "",
      },
      {
        title: "Date Wise Reports",
        path: "/report-datewise",
      },
      {
        title: "Report Configuration ",
        path: "/report-congiguration",
      },
    ],
  },
  {
    title: "Sales",
    icon: "ki-filled ki-airplane text-primary",
    children: [
      {
        title: "Quotation",
        path: "/quotation-dashboard",
      },
      {
        title: "Invoice",
        path: "/sales/invoice-dashboard",
      },
    ],
  },
  {
    title: "Custom Themes",
    icon: "element-11 text-primary",
    path: "/reportcustomethemes",
  },
  {
    title: "Settings",
    icon: "ki-filled ki-setting-2 text-primary",
    disabled: false,
    children: [
      {
        title: "Company Profile",
        path: "settings/general",
      },
      {
        title: "Utility Page",
        path: "settings/utility",
      },
      {
        title: "Subscription",
        path: "settings/subscription",
      },
      {
        title: "Payment History",
        path: "settings/channel",
      },
      {
        title: "Notifications",
        path: "settings/notifications",
      },
    ],
  },
];

const superAdminMenuItems = [
  {
    title: "Dashboard",
    icon: "element-11 text-primary",
    path: "/super-dashboard",
  },
  {
    title: "Member List",
    icon: "ki-filled ki-user text-primary",
    path: "/master/user-master/",
  },
  {
    title: "Member Plans",
    icon: "element-11 text-primary",
    path: "/master/user-master/plan",
  },
  {
    title: "Invoice List",
    icon: "ki-filled ki-user text-primary",
    path: "/sales/invoice-dashboard",
  },
  {
    title: "Custom Themes",
    icon: "element-11 text-primary",
    path: "/super-reportcustomethemes",
  },
  {
    title: "Plans",
    icon: "element-11 text-primary",
    path: "/event",
  },
  {
    title: "Database",
    icon: "element-11 text-primary",
    path: "/database",
  },
];

export const MENU_SIDEBAR = isSuperAdmin ? superAdminMenuItems : allMenuItems;

export const MENU_MEGA = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Profiles",
    children: [
      {
        title: "Profiles",
        children: [
          {
            children: [
              {
                title: "Default",
                icon: "badge",
                path: "/public-profile/profiles/default",
              },
              {
                title: "Creator",
                icon: "coffee",
                path: "/public-profile/profiles/creator",
              },
              {
                title: "Company",
                icon: "abstract-41",
                path: "/public-profile/profiles/company",
              },
              {
                title: "NFT",
                icon: "bitcoin",
                path: "/public-profile/profiles/nft",
              },
              {
                title: "Blogger",
                icon: "message-text",
                path: "/public-profile/profiles/blogger",
              },
              {
                title: "CRM",
                icon: "devices",
                path: "/public-profile/profiles/crm",
              },
              {
                title: "Gamer",
                icon: "ghost",
                path: "/public-profile/profiles/gamer",
              },
            ],
          },
          {
            children: [
              {
                title: "Feeds",
                icon: "book",
                path: "/public-profile/profiles/feeds",
              },
              {
                title: "Plain",
                icon: "files",
                path: "/public-profile/profiles/plain",
              },
              {
                title: "Modal",
                icon: "mouse-square",
                path: "/public-profile/profiles/modal",
              },
              {
                title: "Freelancer",
                icon: "financial-schedule",
                path: "#",
                disabled: true,
              },
              {
                title: "Developer",
                icon: "technology-4",
                path: "#",
                disabled: true,
              },
              {
                title: "Team",
                icon: "users",
                path: "#",
                disabled: true,
              },
              {
                title: "Events",
                icon: "calendar-tick",
                path: "#",
                disabled: true,
              },
            ],
          },
        ],
      },
      {
        title: "Other Pages",
        children: [
          {
            children: [
              {
                title: "Projects - 3 Columns",
                icon: "element-6",
                path: "/public-profile/projects/3-columns",
              },
              {
                title: "Projects - 2 Columns",
                icon: "element-4",
                path: "/public-profile/projects/2-columns",
              },
              {
                title: "Works",
                icon: "office-bag",
                path: "/public-profile/works",
              },
              {
                title: "Teams",
                icon: "people",
                path: "/public-profile/teams",
              },
              {
                title: "Network",
                icon: "icon",
                path: "/public-profile/network",
              },
              {
                title: "Activity",
                icon: "chart-line-up-2",
                path: "/public-profile/activity",
              },
              {
                title: "Campaigns - Card",
                icon: "element-11",
                path: "/public-profile/campaigns/card",
              },
            ],
          },
          {
            children: [
              {
                title: "Campaigns - List",
                icon: "kanban",
                path: "/public-profile/campaigns/list",
              },
              {
                title: "Empty",
                icon: "file-sheet",
                path: "/public-profile/empty",
              },
              {
                title: "Documents",
                icon: "document",
                path: "#",
                disabled: true,
              },
              {
                title: "Badges",
                icon: "award",
                path: "#",
                disabled: true,
              },
              {
                title: "Awards",
                icon: "gift",
                path: "#",
                disabled: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "My Account",
    children: [
      {
        title: "General Pages",
        children: [
          {
            title: "Integrations",
            icon: "technology-2",
            path: "/account/integrations",
          },
          {
            title: "Notifications",
            icon: "notification-1",
            path: "/account/notifications",
          },
          {
            title: "API Keys",
            icon: "key",
            path: "/account/api-keys",
          },
          {
            title: "Appearance",
            icon: "eye",
            path: "/account/appearance",
          },
          {
            title: "Invite a Friend",
            icon: "user-tick",
            path: "/account/invite-a-friend",
          },
          {
            title: "Activity",
            icon: "support",
            path: "/account/activity",
          },
          {
            title: "Brand",
            icon: "verify",
            disabled: true,
          },
          {
            title: "Get Paid",
            icon: "euro",
            disabled: true,
          },
        ],
      },
      {
        title: "Other pages",
        children: [
          {
            title: "Account Home",
            children: [
              {
                title: "Get Started + ",
                path: "/account/home/get-started",
              },
              {
                title: "User Profile",
                path: "/account/home/user-profile",
              },
              {
                title: "Company Profile",
                path: "/account/home/company-profile",
              },
              {
                title: "With Sidebar",
                path: "/account/home/settings-sidebar",
              },
              {
                title: "Enterprise",
                path: "/account/home/settings-enterprise",
              },
              {
                title: "Plain",
                path: "/account/home/settings-plain",
              },
              {
                title: "Modal",
                path: "/account/home/settings-modal",
              },
            ],
          },
          {
            title: "Billing",
            children: [
              {
                title: "Basic Billing",
                path: "/account/billing/basic",
              },
              {
                title: "Enterprise",
                path: "/account/billing/enterprise",
              },
              {
                title: "Plans",
                path: "/account/billing/plans",
              },
              {
                title: "Billing History",
                path: "/account/billing/history",
              },
              {
                title: "Tax Info",
                disabled: true,
              },
              {
                title: "Invoices",
                disabled: true,
              },
              {
                title: "Gateaways",
                disabled: true,
              },
            ],
          },
          {
            title: "Security",
            children: [
              {
                title: "Get Started",
                path: "/account/security/get-started",
              },
              {
                title: "Security Overview",
                path: "/account/security/overview",
              },
              {
                title: "IP Addresses",
                path: "/account/security/allowed-ip-addresses",
              },
              {
                title: "Privacy Settings",
                path: "/account/security/privacy-settings",
              },
              {
                title: "Device Management",
                path: "/account/security/device-management",
              },
              {
                title: "Backup & Recovery",
                path: "/account/security/backup-and-recovery",
              },
              {
                title: "Current Sessions",
                path: "/account/security/current-sessions",
              },
              {
                title: "Security Log",
                path: "/account/security/security-log",
              },
            ],
          },
          {
            title: "Members & Roles",
            children: [
              {
                title: "Teams Starter",
                path: "/account/members/team-starter",
              },
              {
                title: "Teams",
                path: "/account/members/teams",
              },
              {
                title: "Team Info",
                path: "/account/members/team-info",
              },
              {
                title: "Members Starter",
                path: "/account/members/members-starter",
              },
              {
                title: "Team Members",
                path: "/account/members/team-members",
              },
              {
                title: "Import Members",
                path: "/account/members/import-members",
              },
              {
                title: "Roles",
                path: "/account/members/roles",
              },
              {
                title: "Permissions - Toggler",
                path: "/account/members/permissions-toggle",
              },
              {
                title: "Permissions - Check",
                path: "/account/members/permissions-check",
              },
            ],
          },
          {
            title: "Other Pages",
            children: [
              {
                title: "Integrations",
                path: "/account/integrations",
              },
              {
                title: "Notifications",
                path: "/account/notifications",
              },
              {
                title: "API Keys",
                path: "/account/api-keys",
              },
              {
                title: "Appearance",
                path: "/account/appearance",
              },
              {
                title: "Invite a Friend",
                path: "/account/invite-a-friend",
              },
              {
                title: "Activity",
                path: "/account/activity",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Network",
    children: [
      {
        title: "General Pages",
        children: [
          {
            title: "Get Started",
            icon: "flag",
            path: "/network/get-started",
          },
          {
            title: "Colleagues",
            icon: "users",
            path: "#",
            disabled: true,
          },
          {
            title: "Donators",
            icon: "heart",
            path: "#",
            disabled: true,
          },
          {
            title: "Leads",
            icon: "abstract-21",
            path: "#",
            disabled: true,
          },
        ],
      },
      {
        title: "Other pages",
        children: [
          {
            title: "User Cards",
            children: [
              {
                title: "Mini Cards",
                path: "/network/user-cards/mini-cards",
              },
              {
                title: "Team Members",
                path: "/network/user-cards/team-crew",
              },
              {
                title: "Authors",
                path: "/network/user-cards/author",
              },
              {
                title: "NFT Users",
                path: "/network/user-cards/nft",
              },
              {
                title: "Social Users",
                path: "/network/user-cards/social",
              },
              {
                title: "Gamers",
                path: "#",
                disabled: true,
              },
            ],
          },
          {
            title: "User Base",
            badge: "Datatables",
            children: [
              {
                title: "Team Crew",
                path: "/network/user-table/team-crew",
              },
              {
                title: "App Roster",
                path: "/network/user-table/app-roster",
              },
              {
                title: "Market Authors",
                path: "/network/user-table/market-authors",
              },
              {
                title: "SaaS Users",
                path: "/network/user-table/saas-users",
              },
              {
                title: "Store Clients",
                path: "/network/user-table/store-clients",
              },
              {
                title: "Visitors",
                path: "/network/user-table/visitors",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Authentication",
    children: [
      {
        title: "General pages",
        children: [
          {
            title: "Classic Layout",
            children: [
              {
                title: "Sign In",
                path: "/auth/classic/login",
              },
              {
                title: "Sign Up",
                path: "/auth/classic/signup",
              },
              {
                title: "2FA",
                path: "/auth/classic/2fa",
              },
              {
                title: "Check Email",
                path: "/auth/classic/check-email",
              },
              {
                title: "Reset Password",
                children: [
                  {
                    title: "Enter Email",
                    path: "/auth/classic/reset-password/enter-email",
                  },
                  {
                    title: "Check Email",
                    path: "/auth/classic/reset-password/check-email",
                  },
                  {
                    title: "Change Password",
                    path: "/auth/classic/reset-password/change",
                  },
                  {
                    title: "Password is Changed",
                    path: "/auth/classic/reset-password/changed",
                  },
                ],
              },
            ],
          },
          {
            title: "Branded Layout",
            children: [
              {
                title: "Sign In",
                path: "/auth/login",
              },
              {
                title: "Sign Up",
                path: "/auth/signup",
              },
              {
                title: "2FA",
                path: "/auth/2fa",
              },
              {
                title: "Check Email",
                path: "/auth/check-email",
              },
              {
                title: "Reset Password",
                children: [
                  {
                    title: "Enter Email",
                    path: "/auth/reset-password/enter-email",
                  },
                  {
                    title: "Check Email",
                    path: "/auth/reset-password/check-email",
                  },
                  {
                    title: "Change Password",
                    path: "/auth/reset-password/change",
                  },
                  {
                    title: "Password is Changed",
                    path: "/auth/reset-password/changed",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Other Pages",
        children: [
          {
            title: "Welcome Message",
            icon: "like-2",
            path: "/auth/welcome-message",
          },
          {
            title: "Account Deactivated",
            icon: "shield-cross",
            path: "/auth/account-deactivated",
          },
          {
            title: "Error 404",
            icon: "message-question",
            path: "/error/404",
          },
          {
            title: "Error 500",
            icon: "information",
            path: "/error/500",
          },
        ],
      },
    ],
  },
  {
    title: "Help",
    children: [
      {
        title: "Getting Started",
        icon: "coffee",
      },
      {
        title: "Support Forum",
        icon: "information",
        children: [
          {
            title: "All Questions",
            icon: "questionnaire-tablet",
          },
          {
            title: "Popular Questions",
            icon: "star",
          },
          {
            title: "Ask Question",
            icon: "message-question",
          },
        ],
      },
      {
        title: "Licenses & FAQ",
        tooltip: {
          title: "Learn more about licenses",
          placement: "right",
        },
        icon: "subtitle",
      },
      {
        title: "Documentation",
        icon: "questionnaire-tablet",
      },
      {
        separator: true,
      },
      {
        title: "Contact Us",
        icon: "share",
      },
    ],
  },
];

export const MENU_ROOT = [
  {
    title: "Public Profile",
    icon: "profile-circle",
    rootPath: "/public-profile/",
    path: "public-profile/profiles/default",
    childrenIndex: 2,
  },
  {
    title: "Account",
    icon: "setting-2",
    rootPath: "/account/",
    path: "/",
    childrenIndex: 3,
  },
  {
    title: "Network",
    icon: "users",
    rootPath: "/network/",
    path: "network/get-started",
    childrenIndex: 4,
  },
  {
    title: "Authentication",
    icon: "security-user",
    rootPath: "/authentication/",
    path: "authentication/get-started",
    childrenIndex: 5,
  },
];
