import { Fragment, useRef, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddLead from "@/partials/modals/add-lead/AddLead";
import { DragAndDrop } from "@/components/drag-and-drop/DragAndDrop";
import { Badge } from "@/components/ui/badge";
import AddLeadNote from "@/partials/modals/add-lead-note/AddLeadNote";
import AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";
import { defaultData } from "./constant";
import LeadContext from "./LeadContext";

const LeadDetailPage = () => {
  const scrollRef = useRef(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [columns, setColumns] = useState(defaultData);
  const handleModalOpen = () => {
    setIsLeadModalOpen(true);
  };
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [dndActive, setDndActive] = useState(false);

  const onPointerDown = (e) => {
    isDragging.current = true;
    if (dndActive) return;
    // support touch or mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    scrollStart.current = scrollRef.current.scrollLeft;
    // prevent native text/image drag
    scrollRef.current.classList.add("cursor-grabbing");
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    if (dndActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              { title: "Leads", path: "/lead" },
              { title: "Lead Detail" },
            ]}
          />
        </div>
      </Container>
      {/* filters */}

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
      <AddFollowUp
        isModalOpen={isFollowUpModalOpen}
        setIsModalOpen={setIsFollowUpModalOpen}
      />
    </Fragment>
  );
};
export { LeadDetailPage };
