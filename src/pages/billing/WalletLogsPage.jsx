import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";
import { FeaturesHighlight } from "../public-profile/profiles/creator/blocks";

const WalletLogsPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Wallet Logs" }]} />
        </div>
        <div className="card min-w-full">
          <div className="card-table">
              <h1 className="text-center p-10">Wallet Logs content here</h1>
          </div>
        </div>



          {/* <div className="col-span-2">
            <div className="flex flex-col gap-5 lg:gap-7.5">
              <FeaturesHighlight
                image={
                  <Fragment>
                    <img
                      src={toAbsoluteUrl("/media/illustrations/18.svg")}
                      className="dark:hidden max-h-[200px]"
                      alt=""
                    />
                    <img
                      src={toAbsoluteUrl("/media/illustrations/18-dark.svg")}
                      className="light:hidden max-h-[200px]"
                      alt=""
                    />
                  </Fragment>
                }
                title="Automate Tasks"
                description="Delegate Tasks and get them completed without manual followups"
                more={{
                  title: "Get Started",
                  url: "/network/get-started",
                }}
                features={[
                  ["Time-Saving", "Easy Revamp"],
                  ["Budget-Friendly", "Fresh Look"],
                ]}
              />
            </div>
          </div> */}


        </Container>
    </Fragment>
  );
};
export { WalletLogsPage };
