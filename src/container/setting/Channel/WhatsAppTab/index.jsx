import EmptyData from "@/components/ui/emptyData";

const WhatsAppTab = () => {
  const email = [
    {
      id: 1,
      email_id: "kaushikBhrahmbhatt@gmail.com",
      created_at: "30 May 2025 10:44 AM",
      status: "Active",
    },
    {
      id: 2,
      email_id: "bharatMer@gmail.com",
      created_at: "30 May 2025 10:44 AM",
      status: "Inactive",
    },
  ];
  return (
    <>
      <div className="pipeline-tab">
        <div className="card p-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
          <div className="pt-3 pb-7.5 px-1.5">WhatsApp API Connection</div>
          <div className="input">
            <input
              type="text"
              className="form-control"
              placeholder="Enter WhatsApp API URL"
            />
          </div>
          <button
            className="btn btn-sm btn-success mt-3"
            title="Connect WhatsApp API"
          >
            Connect WhatsApp API
          </button>
        </div>
      </div>
    </>
  );
};

export { WhatsAppTab };
