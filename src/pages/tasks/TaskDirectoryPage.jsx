import { Fragment } from "react";
import { Container } from "@/components/container";

const TaskDirectoryPage = () => {
  const TaskDirectoryList = [
    {
      title: "E-Commerce",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 20,
    },
    {
      title: "CRM",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 15,
    },
    {
      title: "Project Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 10,
    },
    {
      title: "HR Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 8,
    },
    {
      title: "Finance & Accounting",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 5,
    },
    {
      title: "Marketing Automation",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 12,
    },
    {
      title: "Customer Support",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 7,
    },
    {
      title: "Content Management",
      image: "https://picsum.photos/seed/tags/300/200",
      template_count: 9,
    },
  ];
  return (
    <Fragment>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TaskDirectoryList.map((directory, index) => (
            <div key={index}>
              <img
                src={directory.image}
                alt={directory.title}
                className="w-full h-32 object-cover mx-auto mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2 text-center">
                {directory.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {directory.template_count} Template
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Fragment>
  );
};
export { TaskDirectoryPage };
