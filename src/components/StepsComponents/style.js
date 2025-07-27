import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  customSteps: {
    borderRadius: "12px",
    boxShadow: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
    "& .ant-steps": {
      display: "flex",
      alignItems: "center",
      padding: "30px !important",
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
      background: "var(--tw-gray-100)",
      border: "1px solid var(--tw-gray-200)",
    },
    "& .ant-content": {
      borderStyle: "solid",
      borderWidth: "0 1px 1px 1px",
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
      borderColor: "var(--tw-gray-200)",
      "& .ant-body": {
        padding: "20px",
      },
      "& .ant-foot": {
        padding: "20px",
        borderTop: "1px solid var(--tw-gray-200)",
      },
    },
  },
});
export default useStyles;
