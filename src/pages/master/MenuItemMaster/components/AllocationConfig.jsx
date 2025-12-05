import { useEffect, useState } from "react";
import { Tabs, Form, Select, Button, message } from "antd";
import useMenuApi from "../hooks/useMenuApi";
import allocationTabsConfig from "../config/allocationTabsConfig";
import RenderAllocationFields from "./RenderAllocationFields";
import {
  AddMenuItems,
  UpdateMenuItem,
  uploadFile,
} from "@/services/apiServices";
import { buildPayload } from "../utils/buildMenuPayload";
import AddContactName from "../components/AddContactName";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AllocationConfig = ({ form, onPrev, menuDetails, isEdit, editData }) => {
  const userId = localStorage.getItem("userId");
  const { getUnits, getContactCategory, getContactNames, getPartyByCategory } =
    useMenuApi(userId);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const navigate = useNavigate();

  const [chefunit, setChefunit] = useState([]);
  const [contact, setContact] = useState([]);
  const [chefNames, setChefNames] = useState([]);
  const [outsideName, setOutsideName] = useState([]);
  const [insideCookNames, setInsideCookNames] = useState([]);
  const [concatId, setConcatId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [unitRes, contactRes, chefRes, insideRes] = await Promise.all([
          getUnits(),
          getContactCategory(),
          getContactNames(5),
          getContactNames(7),
        ]);

        setChefunit(
          unitRes?.data?.data?.["Unit Details"]?.map((i) => ({
            unitid: i.id,
            unitname: i.nameEnglish,
          })) || []
        );
        setContact(
          contactRes?.data?.data?.["Contact Category Details"]?.map((i) => ({
            contactid: i.id,
            contactName: i.nameEnglish,
          })) || []
        );
        setChefNames(
          chefRes?.data?.data?.["Party Details"]?.map((i) => ({
            id: i.id,
            name: i.nameEnglish,
          })) || []
        );
        setInsideCookNames(
          insideRes?.data?.data?.["Party Details"]?.map((i) => ({
            id: i.id,
            name: i.nameEnglish,
            number: i.mobileno,
          })) || []
        );
      } catch {
        message.error("Failed to load options");
      }
    })();
  }, []);

  const fetchChefcontactname = async (catTypeId) => {
    try {
      const res = await getPartyByCategory(catTypeId);
      setOutsideName(
        res?.data?.data?.["Party Details"]?.map((i) => ({
          partyId: i.id,
          partyName: i.nameEnglish,
        })) || []
      );
    } catch {
      message.error("Failed to load contact names");
    }
  };

  useEffect(() => {
    console.log(editData);

    if (!editData || !isEdit) return;

    const alloc = editData.menuItemAllocationConfigs;
    if (!alloc) return;

    if (
      !chefNames.length ||
      !insideCookNames.length ||
      !contact.length ||
      !chefunit.length
    )
      return;

    const values = {};

    values.venue = alloc.godownLocation === "AT VENUE" ? "at_venue" : "go_down";
    values.remarks = alloc.remarks;

    if (alloc.selectChefLabourAgency && alloc.chefLabourItem) {
      values["counter wise"] = alloc.chefLabourItem.allocation_type;
      values.counterno = alloc.chefLabourItem.counterNo;
      values.chef_price = alloc.chefLabourItem.pricePerLabour;
      values.chef_contactName = alloc.party?.id;
      values.chef_remarks = alloc.remarks;
    }

    if (alloc.selectOutsideAgency && alloc.outsideItem) {
      values.qty = alloc.outsideItem.quantityPer100Person;
      values.unit = alloc.outsideItem.unit?.id;
      values.outside_price = alloc.outsideItem.pricePerHelper;
      values.contactCategory = alloc.outsideItem.contactCategory?.id;
      values.outside_remarks = alloc.remarks;

      if (alloc.outsideItem.contactCategory?.id) {
        fetchChefcontactname(alloc.outsideItem.contactCategory.id).then(() => {
          form.setFieldsValue({ outside_contactName: alloc.party?.id });
        });
      }
      values.outside_contactName = alloc.party?.id;
    }

    if (alloc.selectInsideAgency && alloc.insideItem) {
      values.chef_name = alloc.party?.id;
      values.chef_number = alloc.party?.mobileno;
    }

    form.setFieldsValue(values);
  }, [editData, chefNames, insideCookNames, contact, chefunit, form, isEdit]);

  /** FORMAT PAYLOAD BEFORE SAVE */
  const formatAllocationFields = (v) => {
    const allocation = {
      id:
        isEdit && editData?.menuItemAllocationConfigs?.id
          ? editData.menuItemAllocationConfigs.id
          : 0,
      godownLocation: v.venue === "at_venue" ? "AT VENUE" : "GO DOWN",
      remarks: v.chef_remarks || v.outside_remarks || v.remarks || "",
      partyId:
        v.chef_contactName || v.outside_contactName || v.chef_name || null,
      selectChefLabourAgency: !!v.chef_contactName,
      selectOutsideAgency: !!v.outside_contactName,
      selectInsideAgency: !!v.chef_name,
    };

    // Chef Labour Item
    if (v.chef_contactName) {
      allocation.chefLabourItem = {
        id:
          isEdit && editData?.menuItemAllocationConfigs?.chefLabourItem?.id
            ? editData.menuItemAllocationConfigs.chefLabourItem.id
            : 0,
        allocation_type: v["counter wise"],
        counterNo: Number(v.counterno) || 0,
        pricePerLabour: Number(v.chef_price) || 0,
      };
    } else {
      allocation.chefLabourItem = null;
    }

    // Outside Item
    if (v.outside_contactName) {
      allocation.outsideItem = {
        id:
          isEdit && editData?.menuItemAllocationConfigs?.outsideItem?.id
            ? editData.menuItemAllocationConfigs.outsideItem.id
            : 0,
        quantityPer100Person: Number(v.qty) || 0,
        unitId: v.unit,
        pricePerHelper: Number(v.outside_price) || 0,
        contactCategoryId: v.contactCategory,
      };
    } else {
      allocation.outsideItem = null;
    }

    // Inside Item
    if (v.chef_name) {
      allocation.insideItem = {
        id:
          isEdit && editData?.menuItemAllocationConfigs?.insideItem?.id
            ? editData.menuItemAllocationConfigs.insideItem.id
            : 0,
        number: v.chef_number,
      };
    } else {
      allocation.insideItem = null;
    }

    return allocation;
  };

  /** SAVE */
  const onFinish = async (values) => {
    try {
      const allocationObject = formatAllocationFields(values);
      const payload = buildPayload(menuDetails, allocationObject);

      console.log("Final Payload:", JSON.stringify(payload, null, 2)); // Debug log

      let apiRes = isEdit
        ? await UpdateMenuItem(editData.id, payload)
        : await AddMenuItems(payload);

      const data = apiRes?.data;
      const success = data?.success;

      if (success && menuDetails?.shouldUploadImage && menuDetails?.file) {
        const fd = new FormData();
        fd.append("moduleId", data.moduleId);
        fd.append("moduleName", data.moduleName);
        fd.append("fileType", data.fileType);
        fd.append("file", menuDetails.file);
        await uploadFile(fd);
      }

      Swal.fire({
        title: success ? "Success!" : "Failed",
        icon: success ? "success" : "error",
        text: data?.message,
      });

      if (success) navigate("/master/menu-item");
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error?.response?.data?.message || "Failed to save",
      });
    }
  };

  const chefFields = allocationTabsConfig.chef.map((f) =>
    f.name === "chef_contactName"
      ? {
          ...f,
          options: chefNames.map((i) => ({ label: i.name, value: i.id })),
        }
      : f
  );

  const outsideFields = allocationTabsConfig.outside.map((f) => {
    if (f.name === "unit") {
      return {
        ...f,
        options: chefunit.map((u) => ({ label: u.unitname, value: u.unitid })),
      };
    }
    if (f.name === "contactCategory") {
      return {
        ...f,
        options: contact.map((c) => ({
          label: c.contactName,
          value: c.contactid,
        })),
        onChange: (val) => {
          fetchChefcontactname(val);
          form.setFieldsValue({ contactCategory: val });
        },
      };
    }
    if (f.name === "outside_contactName") {
      return {
        ...f,
        options: outsideName.map((i) => ({
          label: i.partyName,
          value: i.partyId,
        })),
      };
    }
    return f;
  });

  const insideFields = allocationTabsConfig.inside.map((f) =>
    f.name === "chef_name"
      ? {
          ...f,
          options: insideCookNames.map((i) => ({ label: i.name, value: i.id })),
          onChange: (val) => {
            const selected = insideCookNames.find((i) => i.id === val);
            if (selected) {
              form.setFieldsValue({
                chef_name: val,
                chef_number: selected.number,
              });
            }
          },
        }
      : f
  );

  return (
    <div className="mt-6">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label={<span className="text-[#6A7C94] font-medium">At Venue</span>}
          name="venue"
        >
          <Select
            className="bg-[#F8FAFC] h-10"
            options={[
              { label: "At Venue", value: "at_venue" },
              { label: "Go Down", value: "go_down" },
            ]}
          />
        </Form.Item>

        <Tabs defaultActiveKey="chef" destroyInactiveTabPane={false}>
          <Tabs.TabPane tab="Select Chef Labour Agency" key="chef">
            <RenderAllocationFields
              fields={chefFields}
              onAddClick={setConcatId}
              form={form}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Select Outside Agency" key="outside">
            <RenderAllocationFields
              fields={outsideFields}
              onAddClick={setConcatId}
              form={form}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Select Inside Cook" key="inside">
            <RenderAllocationFields
              fields={insideFields}
              onAddClick={setConcatId}
              form={form}
            />
          </Tabs.TabPane>
        </Tabs>

        <div className="flex justify-between pt-4 mb-6">
          <Button onClick={onPrev}>Previous</Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </Form>

      <AddContactName
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
        concatId={concatId}
      />
    </div>
  );
};

export default AllocationConfig;
