const allocationTabsConfig = {
  outside: [
    {
      type: "input",
      label: "Quantity Per 100 Person",
      name: "qty",
      placeholder: "Helper",
    },
    {
      type: "select",
      label: "Select Unit",
      name: "unit",
      options: [],
    },
    {
      type: "input",
      label: "Price (Price Per 1 Unit)",
      name: "outside_price",
    },
    {
      type: "select",
      label: "Select Contact Category",
      name: "contactCategory",
      options: [],
    },
    {
      type: "select",
      label: "Select Contact Name",
      name: "outside_contactName",
      options: [],
      showAddButton: true,
    },
    {
      type: "input",
      label: "Remarks",
      name: "outside_remarks",
    },
  ],
  chef: [
    {
      type: "select",
      label: "Select Type wise",
      name: "counter wise",
      options: [
        { label: "Counter Wise", value: "counter_wise" },
        { label: "Day Wise", value: "day_wise" },
        { label: "Plate Wise", value: "plate_wise" },
      ],
    },
    {
      type: "input",
      label: "Counter No",
      name: "counterno",
    },
    {
      type: "input",
      label: "Price (Price Per 1 Labour)",
      name: " chef_price",
    },
    {
      type: "select",
      label: "Select Contact Name",
      name: "chef_contactName",
      options: [],
      showAddButton: true,
    },
    {
      type: "input",
      label: "Remarks",
      name: "chef_remarks",
    },
  ],
  inside: [
    {
      type: "select",
      label: "Select Chef Name",
      name: "chef_name",
      options: [],
      showAddButton: true,
    },
    {
      type: "input",
      label: "Remarks",
      name: "remarks",
    },
    {
      type: "input",
      label: "Number",
      name: "chef_number",
    },
  ],
};

export default allocationTabsConfig;
