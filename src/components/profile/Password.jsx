import { Input, Button, Form, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { ChangePassword } from "@/services/apiServices"; // adjust path

export default function Password() {
  const [form] = Form.useForm();

 const onFinish = async (values) => {
  const payload = {
    oldPassword: values.oldPassword,
    newPassword: values.newPassword,
    conPassword: values.conPassword,
    userId: 1, // or get it from localStorage/session
  };

  try {
    const res = await ChangePassword(payload);

    // ✅ Show backend-provided success message
    if (res?.data?.msg) {
      message.success(res.data.msg);
    } else {
      message.success("Password changed successfully"); // fallback
    }

    form.resetFields();
  } catch (err) {
    // ✅ Handle backend-provided error messages
    const response = err?.response?.data;

    if (response?.msg) {
      message.error(response.msg);
    } else if (response?.errors) {
      const allErrors = Object.values(response.errors).flat();
      allErrors.forEach((e) => message.error(e));
    } else {
      message.error("Something went wrong while changing password.");
    }

    console.error("Change Password Error:", err);
  }
};


  return (
    <div className=" bg-white rounded-lg ">
      <div className="relative">
        <div className=" h-18 flex rounded-t-lg items-center gap-3">
          {/* <LockOutlined style={{ fontSize: "24px", color: "#555" }} /> */}
          <span className="text-[#505050] font-extrabold
"> Password</span>
        </div>
        <div className="border-b"></div>
      </div>

      <div className="pt-6 ">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            label={
              <span>
                Current Password{" "}
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
              </span>
            }
            name="oldPassword" // ✅ changed
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password className="p-2" placeholder="Current Password" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                New Password{" "}
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
              </span>
            }
            name="newPassword" // ✅ changed
            rules={[
              { required: true, message: "Please enter your new password" },
            ]}
          >
            <Input.Password className="p-2" placeholder="New Password" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Confirm Password{" "}
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
              </span>
            }
            name="conPassword" // ✅ changed
            rules={[
              { required: true, message: "Please confirm your password" },
            ]}
          >
            <Input.Password className="p-2" placeholder="Confirm Password" />
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
