import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Button, Input } from "antd";
import { UpdateEventPax } from "@/services/apiServices";

const EditPaxModal = ({ isOpen, onClose, eventData, onRefreshEvent }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (eventData?.eventFunctions) {
      const formatted = eventData.eventFunctions.map((f, index) => ({
        id: f.id,
        name: f.function?.nameEnglish,
        currentPerson: f.pax,
        person: f.pax,
      }));
      setRows(formatted);
    }
  }, [eventData]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSave = async () => {
    try {
      const payload = eventData.eventFunctions.map((f, index) => ({
        eventFuncId: f.id,
        functionEndDateTime: f.functionEndDateTime,
        functionId: f.function.id,
        functionStartDateTime: f.functionStartDateTime,
        function_venue: f.function_venue,
        notesEnglish: f.notesEnglish,
        notesGujarati: f.notesGujarati,
        notesHindi: f.notesHindi,
        pax: Number(rows[index].person),
        rate: f.rate,
        sortorder: f.sortorder,
      }));

      const res = await UpdateEventPax(eventData.id, payload);
      console.log("Update Successful:", res);
      onRefreshEvent();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Function Information"
      width={750}
      footer={[
        <div className="flex gap-1 justify-end">
          <Button
            key="close"
            onClick={onClose}
            className="bg-danger text-white"
          >
            Close
          </Button>
          ,
          <Button
            key="save"
            onClick={handleSave}
            className="bg-primary text-white"
          >
            Save
          </Button>
          ,
        </div>,
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">Sr No.</th>
              <th className="py-2 px-3">Function Name</th>
              <th className="py-2 px-3">Current Person</th>
              <th className="py-2 px-3">Person</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="py-3 px-5">{index + 1}</td>
                <td className="py-3 px-6 font-semibold">{row.name}</td>
                <td className="py-3 px-6">
                  <Input
                    value={row.currentPerson}
                    readOnly
                    onChange={(e) =>
                      handleChange(index, "currentPerson", e.target.value)
                    }
                  />
                </td>
                <td className="py-3 px-3">
                  <Input
                    value={row.person}
                    onChange={(e) =>
                      handleChange(index, "person", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomModal>
  );
};

export default EditPaxModal;
