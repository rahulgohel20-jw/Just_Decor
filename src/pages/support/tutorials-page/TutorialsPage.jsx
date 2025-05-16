import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
// import { Badge } from "@/components/ui/badge";
// import { toAbsoluteUrl } from "@/utils";

const TutorialsPage = () => {
  const tutorials = [
    {
      title: "How to create the roles & permissions in the CRM App?",
      desc: "Learn to set up roles and permissions in your CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_roles_permissions",
      image: "https://picsum.photos/seed/roles/300/200",
    },
    {
      title: "How to add a sales person in the CRM App?",
      desc: "Guide to adding a sales person in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_add_salesperson",
      image: "https://picsum.photos/seed/salesperson/300/200",
    },
    {
      title: "How to create Pipelines and Stages in the CRM App?",
      desc: "Create pipelines and stages in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_pipelines_stages",
      image: "https://picsum.photos/seed/pipelines/300/200",
    },
    {
      title:
        "Connect your own WhatsApp number to send notifications & reminders",
      desc: "Set up WhatsApp for notifications in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_whatsapp",
      image: "https://picsum.photos/seed/whatsapp/300/200",
    },
    {
      title: "How to add Product unit and category in the CRM App?",
      desc: "Add product units and categories in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_product_unit",
      image: "https://picsum.photos/seed/product/300/200",
    },
    {
      title: "How to define lead source type in the CRM App?",
      desc: "Define lead source types in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_lead_source",
      image: "https://picsum.photos/seed/leadsource/300/200",
    },
    {
      title: "Lead form by adding your own custom fields in CRM App?",
      desc: "Customize lead forms with custom fields in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_custom_fields",
      image: "https://picsum.photos/seed/customfields/300/200",
    },
    {
      title: "How to create Tag for leads in the CRM App?",
      desc: "Create tags for leads in the CRM app.",
      youtubeLink: "https://www.youtube.com/watch?v=example_lead_tags",
      image: "https://picsum.photos/seed/tags/300/200",
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Tutorials" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search tutorial"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" title="Add Tutorial">
              <i className="ki-filled ki-plus"></i> Add Tutorial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorials.map((tutorial, index) => (
            <a
              key={index}
              href={tutorial.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition"
            >
              <img
                src={tutorial.image}
                alt={tutorial.title}
                className="w-full h-32 object-cover mx-auto mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2 text-center">
                {tutorial.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {tutorial.desc}
              </p>
            </a>
          ))}
        </div>
      </Container>
    </Fragment>
  );
};

export { TutorialsPage };
