import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  formGrp: {
    "& .ant-select": {
      // minWidth: "100%",
      // maxWidth: 240,
      width: "100%",
      height: "40px",
      "& .ant-select-selector": {
        borderColor: "var(--tw-gray-300)",
        "& .ant-select-selection-wrap": {
          "&:after": {
            lineHeight: "32px",
          },
          "& .ant-select-selection-overflow": {
            flexWrap: "nowrap",
            width: "calc(100% - 30px)",
            overflow: "auto",
            MsOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "& .ant-select-selection-overflow-item": {},
          },
          "& .ant-select-selection-placeholder": {
            color: "var(--tw-gray-700)",
            fontWeight: "500",
            fontSize: "0.8125rem",
          },
        },
      },
      "& .ant-select-arrow": {},
      "&:hover": {
        "& .ant-select-selector": {
          borderColor: "var(--tw-gray-400) !important",
        },
      },
      "&:active": {},
      "&.ant-select-open": {},
      "&.ant-select-select-show": {},
      "&.ant-select-focused": {
        "& .ant-select-selector": {
          borderColor: "var(--tw-gray-400) !important",
          boxShadow: "none !important",
        },
      },
    },
  },
  select: {},
});
export default useStyles;
