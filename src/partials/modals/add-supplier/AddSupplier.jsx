import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useEffect, useState } from "react";
import { GetSuplier } from "@/services/apiServices";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const AddSupplier = ({ isOpen, onClose, onAddSupplier, supplierData }) => {
  const [formData, setFormData] = useState({
    suplierlistid: "",
  });
  const [suplierList, setSuplierList] = useState([]);
  const intl = useIntl();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      FetchSuplier();
    }
  }, [isOpen]);

  useEffect(() => {
    if (supplierData) {
      // If editing, set the supplier ID
      setFormData({
        suplierlistid: supplierData.supplierId || "",
      });
    } else {
      // If adding new, reset form
      setFormData({ suplierlistid: "" });
    }
  }, [supplierData]);

  let userdata = JSON.parse(localStorage.getItem("userData"));
  let id = userdata.id;

  const FetchSuplier = () => {
    GetSuplier(id).then((response) => {
      const data = response?.data?.data["Party Details"];
      console.log(data);

      const suplier = data.map((item) => {
        return {
          label: item.nameEnglish,
          value: String(item.id),
        };
      });
      setSuplierList(suplier);
    });
  };

  const handleSave = () => {
    if (!formData.suplierlistid) {
      alert("Please select a supplier");
      return;
    }

    const selectedSupplier = suplierList.find(
      (s) => s.value === formData.suplierlistid
    );

    if (selectedSupplier) {
      const supplierData = {
        id: selectedSupplier.value,
        name: selectedSupplier.label,
      };

      onAddSupplier(supplierData);
      onClose(false);
    } else {
      alert("Please select a supplier");
    }
  };

  return (
    isOpen && (
      <CustomModal
        open={isOpen}
        onClose={() => onClose(false)}
        title={supplierData ? <FormattedMessage id="USER.SUPPLIER.EDIT_TITLE" defaultMessage="Edit Supplier" /> : <FormattedMessage id="USER.SUPPLIER.NEW_TITLE" defaultMessage="New Supplier" />}
        footer={[
          <div className="flex justify-between " key="footer-buttons">
            <button className="btn btn-light" onClick={() => onClose(false)}>
              <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              {supplierData ? <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" /> : <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />}
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-4 max-h-[450px] overflow-auto scrollable-y">
          {/* Supplier */}
          <div className="flex flex-col">
            <label className="form-label"><FormattedMessage id="COMMON.SUPPLIER" defaultMessage="Supplier" /></label>
            <select
              className="select"
              name="suplierlistid"
              value={formData.suplierlistid}
              onChange={handleChange}
            >
              <option value=""><FormattedMessage id="COMMON.SELECT_SUPPLIER" defaultMessage="Select Supplier" /></option>
              {suplierList.map((suplier) => (
                <option key={suplier.value} value={suplier.value}>
                  {suplier.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default AddSupplier;
