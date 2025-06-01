import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  formGrp: {
    "& .ant-select": {
      "& .ant-select-selector": {
        "& .ant-select-selection-wrap": {
          "& .ant-select-selection-overflow": {},
          "& .ant-select-selection-placeholder": {},
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
