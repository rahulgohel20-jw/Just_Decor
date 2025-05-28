export const leadTabs = ["Daily Leads", "Monthly Leads", "Source Wise", "Company Wise", "Pipeline Wise", "Sales Person Wise", "Stage Wise"];

export const leadColumns = [
  { header: "Date", accessorKey: "date", id: "date" },
  { header: "Conversion", accessorKey: "conversion", id: "conversion" },
  { header: "Total", accessorKey: "total", id: "total" },
  { header: "Open", accessorKey: "open", id: "open" },
  { header: "Won", accessorKey: "won", id: "won" },
  { header: "Lost", accessorKey: "lost", id: "lost" },
];

export const leadData = {
  "Daily Leads": [
    { date: "4-May-25", conversion: "0%", total: 0, open: 0, won: 0, lost: 0 },
    { date: "5-May-25", conversion: "0%", total: 0, open: 0, won: 0, lost: 0 },
    { date: "6-May-25", conversion: "0%", total: 0, open: 0, won: 0, lost: 0 },
    { date: "7-May-25", conversion: "0%", total: 0, open: 0, won: 0, lost: 0 },
    { date: "8-May-25", conversion: "0%", total: 0, open: 0, won: 0, lost: 0 },
  ],
  // add other tab data similarly
};
