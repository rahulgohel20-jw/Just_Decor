import { Fragment, useState } from "react";
import { KeenIcon } from "@/components";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import AddLead from "@/partials/modals/add-lead/AddLead";
import AddLeadNote from "@/partials/modals/add-lead-note/AddLeadNote";
import AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";
import { LeadLeftComponent, LeadRightComponent } from "@/components/lead";

const LeadDetailPage = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [searchTag, setSearchTag] = useState("");
  const leadTypes = [
    { id: 1, name: "New Inquiry" },
    { id: 2, name: "Follow Up" },
    { id: 3, name: "Closed" },
    { id: 4, name: "Lost" },
    { id: 5, name: "Won" },
  ];

  const handleEditLead = () => {
    setIsLeadModalOpen(true);
  };

  const handleMoveTo = () => {};

  const handleAddNote = () => {
    setIsNoteModalOpen(true);
  };

  const handleAddFollowUp = () => {
    setIsFollowUpModalOpen(true);
  };

  const toggleTag = () => {
    setIsTagOpen((prev) => !prev);
  };

  const items = [
    {
      fullName: "Babubhai Vaghela",
      username: "vaghela",
      created: "3 days ago",
      updated: "3 days ago",
      initials: "MG",
      assign: "Manan Gandhi",
    },
    // more items...
  ];

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white shadow-sm"
      >
        {/* Left Section */}
        <div className="w-1/4">
          <div className="text-sm font-semibold text-gray-800">
            {item.fullName}
          </div>
          <div className="text-xs text-gray-500">{item.username}</div>
        </div>

        <div className="text-sm text-gray-500 w-10 text-center">0</div>

        {/* Center Section */}
        <div className="flex items-center gap-3 w-1/3">
          <div className="text-xs text-gray-500">
            <div>{item.assign}</div>
            <div>Created At: {item.created}</div>
            <div>Updated At: {item.updated}</div>
          </div>

          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
            {item.initials}
          </div>
        </div>

        {/* Tag */}
        <div>
          <span className="text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
            New Inquiry
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button type="button">
            <KeenIcon icon="eye" />
          </button>
          <button type="button">
            <KeenIcon icon="dots-horizontal" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Container>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleMoveTo}
            className="btn btn-sm border border-dark ms-2"
          >
            <i className="ki-filled ki-notepad-edit text-info"></i> Move to
          </button>
          <button
            type="button"
            onClick={handleEditLead}
            className="btn btn-sm border border-dark ms-2"
          >
            <i className="ki-filled ki-notepad-edit text-info"></i> Edit Lead
          </button>
          <button
            type="button"
            onClick={handleAddNote}
            className="btn btn-sm border border-dark ms-2"
          >
            <i className="ki-filled ki-notepad-edit text-info"></i> Edit Notes
          </button>
          <button
            type="button"
            onClick={handleAddFollowUp}
            className="btn btn-sm border border-dark ms-2"
          >
            <i className="ki-filled ki-notepad-edit text-info"></i> Add Follow
            Up
          </button>
        </div>
        {leadTypes.map(({ id, name }, index) => (
          <Badge
            className="badge badge-outline text-xs ms-2"
            title="Type one"
            key={index}
          >
            {name}
          </Badge>
        ))}
      </Container>
      <hr className="border-t border-gray-200 my-5" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          <div className="col-span-1">
            <LeadLeftComponent />
          </div>
          <div className="col-span-2 space-y-4">
            <LeadRightComponent />
          </div>
        </div>
      </Container>

      {/* AddLead */}
      <AddLead
        isModalOpen={isLeadModalOpen}
        setIsModalOpen={setIsLeadModalOpen}
      />
      {/* AddLeadNote */}
      <AddLeadNote
        isModalOpen={isNoteModalOpen}
        setIsModalOpen={setIsNoteModalOpen}
      />
      {/* AddFollowUp */}
      <AddFollowUp
        isModalOpen={isFollowUpModalOpen}
        setIsModalOpen={setIsFollowUpModalOpen}
      />
    </Fragment>
  );
};

export { LeadDetailPage };
