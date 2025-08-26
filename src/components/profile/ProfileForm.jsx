import { Input, Select, Button, Form } from "antd";
import { toAbsoluteUrl } from "@/utils";
import { useState } from "react";
const { TextArea } = Input;

export default function ProfileForm({ value, onChange, ...rest }) {
  const [selectedCompanies, setSelectedCompanies] = useState(value || []);
  const [form] = Form.useForm();
  const handleChange = (event) => {
    setSelectedCompanies(event.target.value);
    onChange(event);
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className=" bg-white rounded-lg shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="p-6 pb-0 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <img
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
            src={toAbsoluteUrl("/images/user_img.jpg")}
            alt=""
          />
          <div className="flex flex-col">
            <span className="text-black font-normal">Swapnil Ghodeswar</span>
            <span className="text-sm text-grey">shreeswapnil@gmail.com</span>
          </div>
        </div>
      </div>

      <div className=" p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  First Name <span className="text-red-500">*</span>
                </span>
              }
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input className="p-2" placeholder="First Name" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Last Name <span className="text-red-500">*</span>
                </span>
              }
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input className="p-2" placeholder="Last Name" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  Email ID <span className="text-red-500">*</span>
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="p-2" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Phone Number <span className="text-red-500">*</span>
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input className="p-2" placeholder="Mobile Number" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  Company Name <span className="text-red-500">*</span>
                </span>
              }
              name="companyname"
              rules={[
                { required: true, message: "Please enter your Company name" },
              ]}
            >
              <Input className="p-2" placeholder="company Name" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Company Email<span className="text-red-500">*</span>
                </span>
              }
              name="companyemail"
              rules={[
                { required: true, message: "Please enter your Company Email" },
              ]}
            >
              <Input className="p-2" placeholder="Company Email" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  Company Address <span className="text-red-500">*</span>
                </span>
              }
              name="companyaddress"
              rules={[
                {
                  required: true,
                  message: "Please enter your Company Address",
                },
              ]}
            >
              <Input className="p-2" placeholder="Company Address" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Office Number <span className="text-red-500">*</span>
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: "Please enter your office number" },
              ]}
            >
              <Input className="p-2" placeholder="Office Number" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={
                <span>
                  State <span className="text-red-500">*</span>
                </span>
              }
              name="state"
              rules={[
                {
                  required: true,
                  message: "Please enter your state",
                },
              ]}
            >
              <Input className="p-2" placeholder="State" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  City <span className="text-red-500">*</span>
                </span>
              }
              name="city"
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Input className="p-2" placeholder="City" />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span>
                Permitted ID <span className="text-red-500">*</span>
              </span>
            }
            name="permittedId"
            rules={[{ required: true, message: "Please enter permitted ID" }]}
          >
            <Input className="p-2" placeholder=" Permitted ID" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Bio <span className="text-red-500">*</span>
              </span>
            }
            name="bio"
            rules={[{ required: true, message: "Please enter your bio" }]}
          >
            <TextArea
              rows={4}
              placeholder="Passionate event manager with over 10 years of experience in creating memorable experiences."
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="p-2 bg-green-600 hover:bg-green-700 border-none rounded-md px-8"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
