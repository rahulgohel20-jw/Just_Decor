import EmptyData from "@/components/ui/emptyData";
import { toAbsoluteUrl } from "@/utils";

const EmailTemplateTab = () => {
  const emailTemplate = [
    {
      id: 1,
      template_name: "Template 1",
      subject: "Email Subject 1",
      created_by: "Kaushik Brahmbhatt",
      created_by_image: toAbsoluteUrl("/images/user_img.jpg"),
    },
    {
      id: 2,
      template_name: "Template 2",
      subject: "Email Subject 2",
      created_by: "Bharat Mer",
      created_by_image: toAbsoluteUrl("/images/user_img.jpg"),
    },
    {
      id: 3,
      template_name: "Template 3",
      subject: "Email Subject 3",
      created_by: "Kaushik Brahmbhatt",
      created_by_image: toAbsoluteUrl("/images/user_img.jpg"),
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
              {emailTemplate && emailTemplate.length > 0 ? (
                emailTemplate.map((item, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between p-3 bg-white dark:bg-dark border rounded-lg shadow-sm"
                      key={index}
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-800">
                          <small className="text-gray-700 me-2">
                            Template:
                          </small>
                          {item.template_name}
                        </span>
                        <span className="text-gray-800">
                          <small className="text-gray-700 me-2">Subject:</small>
                          {item.subject}
                        </span>
                        <span className="text-gray-800">
                          <small className="text-gray-700 me-2">
                            Created By:
                          </small>
                          <img
                            src={item.created_by_image}
                            alt={item.created_by}
                            className="inline-block w-6 h-6 rounded-full me-2"
                          />
                          {item.created_by}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <button type="button" title="Edit">
                          <i className="ki-filled ki-notepad-edit"></i>
                        </button>
                        <button type="button" title="Delete">
                          <i className="ki-filled ki-trash"></i>
                        </button>
                      </div>
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

export { EmailTemplateTab };
