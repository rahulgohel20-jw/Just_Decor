import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  formGrp: {
    "& .ant-select": {
      "& .ant-select-selector": {
        borderColor: "var(--tw-gray-300)",
        "& .ant-select-selection-wrap": {
          "&:after": {
            lineHeight: "32px",
          },
          "& .ant-select-selection-overflow": {},
          "& .ant-select-selection-placeholder": {
            color: "var(--tw-gray-700)",
          },
        },
      },
      "& .ant-select-arrow": {},
    },
  },
  select: {
    minWidth: 150,
  },
});
export default useStyles;
