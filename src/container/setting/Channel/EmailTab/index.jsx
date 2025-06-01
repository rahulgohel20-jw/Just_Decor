import EmptyData from "@/components/ui/emptyData";

const EmailTab = () => {
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
        <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
          <div className="flex flex-col items-end pt-3 pb-7.5 px-1.5">
            <button className="btn btn-sm btn-success" title="Add Pipeline">
              Connect Email
            </button>
          </div>
          <div className="card-content bg-white dark:bg-dark border-t py-2 px-1.5 h-full">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              {email && email.length > 0 ? (
                email.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between p-3 bg-white dark:bg-dark border rounded-lg shadow-sm"
                      key={index}
                    >
                      <div className="flex flex-column">
                        <span className="text-gray-800 ">
                          <small className="text-gray-700 me-2">
                            Sending Email:
                          </small>
                          {item.email_id}
                          <br />
                          <small className="text-gray-700 me-2">
                            Connected At:
                          </small>
                          {item.created_at}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        title="Disconnect"
                      >
                        Disconnect
                      </button>
                    </div>
                  );
                })
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { EmailTab };
