import { Fragment, useState } from "react";
import { Input, Select, DatePicker, Button, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const SuperAdminMemberEdit = () => {
  // ---------- Down Payment ----------
  const [downPayments, setDownPayments] = useState([
    {
      mode: "cash",
      amount: 5000,
      no: 1,
      date: null,
      txnDate: null,
      remarks: "",
    },
  ]);

  const addDownPayment = () => {
    setDownPayments([
      ...downPayments,
      { mode: "", amount: "", no: "", date: null, txnDate: null, remarks: "" },
    ]);
  };

  const removeDownPayment = (index) => {
    if (index === 0) return message.warning("Cannot delete first entry!");
    setDownPayments(downPayments.filter((_, i) => i !== index));
  };

  const handleDownPaymentChange = (index, field, value) => {
    const updated = [...downPayments];
    updated[index][field] = value;
    setDownPayments(updated);
  };

  // ---------- EMI ----------
  const [emi, setEmi] = useState([]);
  const addEmi = () => {
    setEmi([...emi, { no: "", mode: "", date: null }]);
  };
  const removeEmi = (index) => {
    setEmi(emi.filter((_, i) => i !== index));
  };

  // ---------- ASF ----------
  const [asf, setAsf] = useState([]);
  const addAsf = () => {
    setAsf([
      ...asf,
      { amount: "", date: null, receivedDate: null, status: "Pending" },
    ]);
  };
  const removeAsf = (index) => {
    setAsf(asf.filter((_, i) => i !== index));
  };

  // ---------- Refund ----------
  const [refunds, setRefunds] = useState([]);
  const addRefund = () => {
    setRefunds([...refunds, { mode: "", amount: "", date: null }]);
  };
  const removeRefund = (index) => {
    setRefunds(refunds.filter((_, i) => i !== index));
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Member Edit" }]} />
        </div>

        <div className="bg-white shadow rounded-md p-4 space-y-6">
          {/* ------------ Add Members ------------ */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              Add Members
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <Input placeholder="TBH516999" />
              <Select
                defaultValue="Mr."
                options={[
                  { label: "Mr.", value: "Mr." },
                  { label: "Mrs.", value: "Mrs." },
                  { label: "Ms.", value: "Ms." },
                ]}
              />
              <Input placeholder="Jyotiben K Patel" />
              <DatePicker placeholder="DOB" className="w-full" />
              <Input placeholder="Email" />
              <DatePicker placeholder="Anniversary Date" className="w-full" />
              <Input placeholder="Address" />
              <Input placeholder="Res Pin Code" />
              <Input placeholder="City" />
              <Input placeholder="State" />
              <Select
                defaultValue="Individual"
                options={[
                  { label: "Individual", value: "Individual" },
                  { label: "Corporate", value: "Corporate" },
                ]}
              />
              <Input placeholder="Campaign Name" />
            </div>
          </section>

          {/* ------------ Other Info ------------ */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              Other Info
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <Select
                placeholder="Sales Person"
                options={[{ label: "Samir", value: "Samir" }]}
              />
              <Input placeholder="Collection Status" />
              <Input placeholder="Location" />
              <Input placeholder="Reference" />
              <DatePicker placeholder="Cancellation Date" className="w-full" />
              <Select placeholder="Sales Status" />
            </div>
          </section>

          {/* ------------ Product & Price Info ------------ */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              Product & Price Info
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <Select placeholder="Signature 3* 4*" />
              <Select placeholder="Signature" />
              <DatePicker placeholder="From Date" className="w-full" />
              <DatePicker placeholder="To Date" className="w-full" />
              <Input placeholder="Amount" />
              <Select placeholder="Payment Mode" />
              <Input placeholder="City" />
              <Input placeholder="Remarks" />
            </div>
          </section>

          {/* ------------ Down Payment Details ------------ */}
          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>Down Payment Details</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={addDownPayment}
              >
                Add New
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {downPayments.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center"
                >
                  <Select
                    value={row.mode}
                    onChange={(v) => handleDownPaymentChange(index, "mode", v)}
                    options={[
                      { label: "Cash", value: "cash" },
                      { label: "Cheque", value: "cheque" },
                      { label: "Other", value: "other" },
                    ]}
                    placeholder="Mode"
                  />
                  <Input
                    value={row.amount}
                    onChange={(e) =>
                      handleDownPaymentChange(index, "amount", e.target.value)
                    }
                    placeholder="Amount"
                  />
                  <Input
                    value={row.no}
                    onChange={(e) =>
                      handleDownPaymentChange(index, "no", e.target.value)
                    }
                    placeholder="No"
                  />
                  <DatePicker
                    placeholder="Payment Date"
                    className="w-full"
                    onChange={(date) =>
                      handleDownPaymentChange(index, "date", date)
                    }
                  />
                  <DatePicker
                    placeholder="Transaction Date"
                    className="w-full"
                    onChange={(date) =>
                      handleDownPaymentChange(index, "txnDate", date)
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeDownPayment(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ------------ KYC Info ------------ */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              KYC Info
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <Select placeholder="KYC Type" />
              <Input placeholder="KYC Doc No." />
              <Input type="file" />
              <Select placeholder="KYC Type" />
              <Input placeholder="KYC Doc No." />
              <Input type="file" />
            </div>
          </section>

          {/* ------------ Footer Buttons ------------ */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="primary">Update</Button>
            <Button>Cancel</Button>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default SuperAdminMemberEdit;
