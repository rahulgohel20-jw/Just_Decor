import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  customStyle: {
    "& .select__grp": {
      "& .sg__inner": {
        borderRadius: "6px",
        "& .ant-select": {
          height: "38px",
          border: "0",
          height: "38px",
          paddingInlineStart: "0",
          "& .ant-select-selector": {
            border: "0",
          },
        },
        "& .formGrpCommon": {
          flex: "1",
          "& .ant-select": {
            height: "38px",
            "& .ant-select-selector": {
              border: "0",
            },
          },
        },
        "& > .sga__btn": {
          maxWidth: "32px",
          flex: "0 0 32px",
          height: "32px",
        },
      },
    },
  },
});
export default useStyles;
