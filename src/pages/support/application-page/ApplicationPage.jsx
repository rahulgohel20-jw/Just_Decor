import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";


//import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const ApplicationPage = () => {
  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Mobile App" }]} />
        </div>

        <div className="flex justify-center gap-10 p-10 flex-wrap">
          {/* Android Card */}
          <div className="bg-white border rounded-lg p-6 shadow-md text-center w-64">
            <img
              src={toAbsoluteUrl("../src/assets/images.png")}
              alt="Android"
              className="mx-auto mb-4 h-20"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Download Android App
            </button>
          </div>

          {/* iOS Card */}
          <div className="bg-white border rounded-lg p-6 shadow-md text-center w-54">
            <img
              src={toAbsoluteUrl("../src/assets/download.png")}
              alt="iOS"
              className="mx-auto mb-4 h-20"
            />
            <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded">
              Download iOS App
            </button>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { ApplicationPage };
