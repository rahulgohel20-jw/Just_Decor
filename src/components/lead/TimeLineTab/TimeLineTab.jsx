import { Fragment, useState } from "react";
import { Confirmation } from "@/components/confirmation/confirmation";
import {
  ActivitiesAnniversary,
  ActivitiesBloggingConference,
  ActivitiesFollowersMilestone,
  ActivitiesInterview,
  ActivitiesNewArticle,
  ActivitiesUpcomingContent,
} from "@/partials/activities/items";
import { toAbsoluteUrl } from "@/utils";
import StageTimeLine from "../TimeLineComponent/StageTimeLine";

import { defaultData } from "./constant";

const TimeLineTab = () => {
  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        action: (
          <div className="flex items-center justify-center gap-1">
            <button
              className="btn btn-sm btn-icon btn-clear text-gray-600"
              title="Edit"
              onClick={() => handleEdit(item)}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
              title="Delete"
            >
              <Confirmation
                trigger={<i className="ki-filled ki-trash"></i>}
                content="Do you really want to delete?"
                yesText="Proceed"
                noText="Dismiss"
                onConfirm={() => console.log("User confirmed")}
                onCancel={() => console.log("User cancelled")}
              ></Confirmation>
            </button>
          </div>
        ),
      };
    });
    return data;
  };

  const [tableData, setTableData] = useState(responseFormate());

  return (
    <>
      <div className="card-body">
        <StageTimeLine />

        <ActivitiesInterview />

        <ActivitiesUpcomingContent />

        <ActivitiesBloggingConference
          image={
            <Fragment>
              <img
                src={toAbsoluteUrl(`/media/illustrations/3.svg`)}
                className="dark:hidden max-h-[160px]"
                alt=""
              />
              <img
                src={toAbsoluteUrl(`/media/illustrations/3-dark.svg`)}
                className="light:hidden max-h-[160px]"
                alt=""
              />
            </Fragment>
          }
        />

        <ActivitiesFollowersMilestone />

        <ActivitiesAnniversary />
      </div>
    </>
  );
};

export default TimeLineTab;
