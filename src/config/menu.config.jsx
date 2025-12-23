import { FormattedMessage } from "react-intl";

export const disableMenuItems = (menuItems) => {
  return menuItems.map((item) => {
    const isPlanPage = item.path && item.path.toLowerCase().includes("price");
    return {
      ...item,
      disabled: !isPlanPage,
      statusLabel: isPlanPage ? undefined : "Locked 🔒",
      children: item.children ? disableMenuItems(item.children) : undefined,
    };
  });
};

export const allMenuItems = [
  {
    title: (
      <FormattedMessage id="COMMON.DASHBOARD" defaultMessage="Dashboard" />
    ),
    icon: "element-11 text-primary text-lg",
    path: "/",
  },
  {
    title: <FormattedMessage id="COMMON.EVENTS" defaultMessage="Events" />,
    icon: "ki-filled ki-calendar-tick text-primary  text-lg",
    children: [
      {
        title: (
          <FormattedMessage id="COMMON.CALENDAR" defaultMessage="Calendar" />
        ),
        path: "/calendar",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.EVENT_LIST"
            defaultMessage="Event List"
          />
        ),
        path: "/event",
      },
    ],
  },
  {
    title: <FormattedMessage id="COMMON.MASTER" defaultMessage="Master" />,
    icon: "  text-lg ki-filled ki-abstract-26 text-primary",
    children: [
      {
        title: (
          <FormattedMessage id="COMMON.CONTACT_TYPE" defaultMessage="Types" />
        ),
        path: "/master/contact-type",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.CONTACT_CATEGORIES"
            defaultMessage="Categories"
          />
        ),
        path: "/master/contact-categories",
      },
      {
        title: (
          <FormattedMessage id="COMMON.CUSTOMERS" defaultMessage="Customers" />
        ),
        path: "/master/customers",
      },
      {
        title: (
          <FormattedMessage id="COMMON.VENDOR_MASTER" defaultMessage="Vendor" />
        ),
        path: "/master/vendor-master",
      },
      {
        title: (
          <FormattedMessage id="COMMON.EVENT_TYPE" defaultMessage="Events " />
        ),
        path: "/master/event-type",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.FUNCTION_TYPE"
            defaultMessage="Function"
          />
        ),
        path: "/master/functions",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.MEAL_TYPE"
            defaultMessage="Food Prefrence "
          />
        ),
        path: "/master/meals",
      },

      {
        title: (
          <FormattedMessage id="COMMON.VENUE_TYPE" defaultMessage="Venue " />
        ),
        path: "/master/venue-type",
      },

      {
        title: (
          <FormattedMessage
            id="COMMON.LABOUR_SHIFT"
            defaultMessage="Labour Shift"
          />
        ),
        path: "/master/labour-shift",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.CUSTOM_PACKAGE"
            defaultMessage="Menu Packages"
          />
        ),
        path: "/master/custom-package",
      },
      {
        title: "Users",
        icon: "  text-lg ki-filled ki-abstract-18 text-primary",
        children: [
          {
            title: (
              <FormattedMessage
                id="COMMON.ALL_MEMBERS"
                defaultMessage="User Master"
              />
            ),
            path: "/master/all-members",
          },
          {
            title: "Department",
            path: "/master/role",
          },
        ],
      },
    ],
  },
  {
    title: (
      <FormattedMessage
        id="COMMON.RAW_MATERIAL"
        defaultMessage="Raw Material"
      />
    ),
    icon: "  text-lg ki-filled ki-badge text-primary",
    children: [
      {
        title: (
          <FormattedMessage
            id="COMMON.RAW_MATERIAL_TYPE"
            defaultMessage=" Type"
          />
        ),
        path: "/master/raw-material-type-master",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.RAW_MATERIAL_CATEGORY"
            defaultMessage="Category"
          />
        ),
        path: "/master/raw-material-master",
      },
      {
        title: (
          <FormattedMessage id="COMMON.RAW_MATERIAL" defaultMessage="Items" />
        ),
        path: "/master/raw-material",
      },
      {
        title: <FormattedMessage id="COMMON.UNIT" defaultMessage="Unit" />,
        path: "/master/unit",
      },
    ],
  },
  {
    title: (
      <FormattedMessage id="COMMON.MENU_ITEM" defaultMessage="Menu Item" />
    ),
    icon: "  text-lg ki-filled ki-additem text-primary",
    children: [
      {
        title: (
          <FormattedMessage
            id="COMMON.MENU_ITEM_CATEGORY"
            defaultMessage=" Category"
          />
        ),
        path: "/master/menu-category",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.MENU_ITEM_SUB_CATEGORY"
            defaultMessage=" Sub Category"
          />
        ),
        path: "/master/menu-sub-category",
      },

      // {
      //   title: (
      //     <FormattedMessage
      //       id="COMMON.KITCHEN_AREA"
      //       defaultMessage="Kitchen Area"
      //     />
      //   ),
      //   path: "/master/menu-kitchan-area",
      // },
      {
        title: (
          <FormattedMessage
            id="COMMON.MENU_ITEM"
            defaultMessage=" Items With Recipe "
          />
        ),
        path: "/master/menu-item",
      },
    ],
  },
  // {
  //   title: <FormattedMessage id="COMMON.REPORTS" defaultMessage="Reports" />,
  //   icon: "  text-lg ki-duotone ki-document text-primary",
  //   children: [
  //     {
  //       title: (
  //         <FormattedMessage
  //           id="COMMON.DATE_WISE_REPORTS"
  //           defaultMessage="Date Wise Reports"
  //         />
  //       ),
  //       path: "/report-datewise",
  //     },
  //     {
  //       title: (
  //         <FormattedMessage
  //           id="COMMON.REPORT_CONFIGURATION"
  //           defaultMessage="Report Configuration"
  //         />
  //       ),
  //       path: "/report-congiguration",
  //     },
  //   ],
  // },
  {
    title: <FormattedMessage id="COMMON.SALES" defaultMessage="Sales" />,
    icon: "  text-lg ki-filled ki-graph-up text-primary",
    children: [
      {
        title: (
          <FormattedMessage id="COMMON.QUOTATION" defaultMessage="Quotation" />
        ),
        path: "/quotation-dashboard",
      },
      {
        title: (
          <FormattedMessage id="COMMON.INVOICE" defaultMessage="Invoice" />
        ),
        path: "/sales/invoice-dashboard",
      },
    ],
  },
  // {
  //   title: (
  //     <FormattedMessage
  //       id="COMMON.CUSTOM_THEMES"
  //       defaultMessage="Custom Themes"
  //     />
  //   ),
  //   icon: "  text-lg ki-duotone ki-dropbox text-primary",
  //   path: "/reportcustomethemes",
  // },

  {
    title: (
      <FormattedMessage id="COMMON.SETTINGS" defaultMessage="Configuration" />
    ),
    icon: "  text-lg ki-filled ki-setting text-primary",
    disabled: false,
    children: [
      {
        title: (
          <FormattedMessage
            id="COMMON.COMPANY_PROFILE"
            defaultMessage="Change Raw Material Category"
          />
        ),
        path: "/configuration/changerawraterialcategory",
      },
      {
        title: (
          <FormattedMessage
            id="BREADCRUMBS_USER_RIGHTS"
            defaultMessage="Change Menu Item Category"
          />
        ),
        path: "/configuration/changemenuitemcategory",
      },

      {
        title: (
          <FormattedMessage
            id="COMMON.SUBSCRIPTION"
            defaultMessage="Menu Item Allocation"
          />
        ),
        path: "/configuration/confimenuitemallocate",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.PAYMENT_HISTORY"
            defaultMessage="Allocate Supplier"
          />
        ),
        path: "/configuration/allocationsupplier",
      },
    ],
  },
  {
    title: <FormattedMessage id="COMMON.SETTINGS" defaultMessage="Settings" />,
    icon: "ki-filled ki-setting-2 text-primary  text-lg",
    disabled: false,
    children: [
      {
        title: (
          <FormattedMessage
            id="COMMON.COMPANY_PROFILE"
            defaultMessage="Company Profile"
          />
        ),
        path: "settings/general",
      },
      {
        title: (
          <FormattedMessage
            id="BREADCRUMBS_USER_RIGHTS"
            defaultMessage="User Rights"
          />
        ),
        path: "/user-rights",
      },
      // {
      //   title: (
      //     <FormattedMessage
      //       id="COMMON.UTILITY_PAGE"
      //       defaultMessage="Utility Page"
      //     />
      //   ),
      //   path: "settings/utility",
      // },
      {
        title: (
          <FormattedMessage
            id="COMMON.SUBSCRIPTION"
            defaultMessage="Subscription"
          />
        ),
        path: "settings/subscription",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.PAYMENT_HISTORY"
            defaultMessage="Payment History"
          />
        ),
        path: "setting/payment-history",
      },

      // {
      //   title: (
      //     <FormattedMessage
      //       id="COMMON.NOTIFICATIONS"
      //       defaultMessage="Notifications"
      //     />
      //   ),
      //   path: "settings/notifications",
      // },
    ],
  },
];

export const superAdminMenuItems = [
  {
    title: (
      <FormattedMessage id="COMMON.DASHBOARD" defaultMessage="Dashboard" />
    ),
    icon: "element-11 text-primary",
    path: "/super-dashboard",
  },
  {
    title: "Calander",
    icon: "ki-filled ki-calendar-tick text-primary",
    path: "/super-calendar",
  },
  {
    title: (
      <FormattedMessage id="COMMON.MEMBER_LIST" defaultMessage="Member List" />
    ),
    icon: "ki-filled ki-user text-primary",
    path: "/master/user-master/",
  },

  {
    title: (
      <FormattedMessage
        id="COMMON.INVOICE_LIST"
        defaultMessage="Invoice List"
      />
    ),
    icon: "ki-filled ki-minus-folder text-primary",
    path: "/admin-invoice",
  },
  {
    title: (
      <FormattedMessage
        id="COMMON.CUSTOM_THEMES"
        defaultMessage="Custom Themes"
      />
    ),
    icon: "ki-filled ki-color-swatch text-primary",
    path: "/super-reportcustomethemes",
  },
  {
    title: "Plans",
    icon: "ki-filled ki-crown text-primary",
    path: "/plans",
  },
  {
    title: "Database",
    icon: "ki-filled ki-abstract-26 text-primary",
    path: "/database",
  },
  {
    title: (
      <FormattedMessage
        id="COMMON.RENEWAL_CUSTOMER"
        defaultMessage="Renewal Customer"
      />
    ),
    icon: "ki-filled ki-users text-primary",
    path: "/renewal-history",
  },
  {
    title: <FormattedMessage id="COMMON.MASTER" defaultMessage="Leads" />,
    icon: "ki-filled ki-abstract-26 text-primary",
    children: [
      {
        title: (
          <FormattedMessage id="COMMON.CONTACT_TYPE" defaultMessage="Leads" />
        ),
        path: "/super-leads",
      },
    ],
  },
  {
    title: <FormattedMessage id="COMMON.MASTER" defaultMessage="Master" />,
    icon: "ki-filled ki-abstract-26 text-primary",
    children: [
      {
        title: (
          <FormattedMessage id="COMMON.CUSTOMERS" defaultMessage="Members" />
        ),
        path: "/superadmin/members",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.CONTACT_TYPE"
            defaultMessage="Categories"
          />
        ),
        path: "/super-contact-type-master",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.CONTACT_CATEGORIES"
            defaultMessage="Raw Material "
          />
        ),
        path: "/super-raw-material-type-master",
      },
      {
        title: <FormattedMessage id="COMMON.CUSTOMERS" defaultMessage="Unit" />,
        path: "/super-unit-master",
      },
      {
        title: (
          <FormattedMessage id="COMMON.CUSTOMERS" defaultMessage="Theme Type" />
        ),
        path: "/super-templateMapping",
      },
      {
        title: (
          <FormattedMessage id="COMMON.CUSTOMERS" defaultMessage="Theme" />
        ),
        path: "super-template-name-master",
      },
      {
        title: (
          <FormattedMessage
            id="COMMON.CUSTOMERS"
            defaultMessage="Interaction"
          />
        ),
        path: "/interaction-master",
      },
    ],
  },
];

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
                disabled: true,
                statusLabel: "Locked ",
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
