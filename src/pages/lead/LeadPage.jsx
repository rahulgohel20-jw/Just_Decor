import { Fragment, useRef, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddContact from "@/partials/modals/add-contact/AddContact";
import { DragAndDrop } from "@/components/drag-and-drop/DragAndDrop";
import { defaultData } from "./constant";
import { Badge } from '@/components/ui/badge';

const LeadPage = () => {
  const scrollRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(defaultData);
  const handleModalOpen = () => {
    setIsModalOpen(true);
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
          <Breadcrumbs items={[{ title: "Leads" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search lead"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Pipeline</option>
                <option value="1">Pipeline one</option>
                <option value="2">Pipeline two</option>
                <option value="2">Pipeline three</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Lead</option>
                <option value="1">Lead one</option>
                <option value="2">Lead two</option>
                <option value="3">Lead three</option>
                <option value="4">Lead four</option>
              </select>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Filter">
                <i className="ki-filled ki-setting-4"></i> Filter
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Refresh">
                <i class="ki-filled ki-arrows-circle"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div class="btn-tabs">
              <button class="btn btn-icon active"><i class="ki-outline ki-element-11"></i></button>
              <button class="btn btn-icon"><i class="ki-outline ki-row-horizontal"></i></button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Lead"
            >
              <i className="ki-filled ki-plus"></i> Add Lead
            </button>
          </div>
        </div>
        {/* Lead Cards */}
        <div className="w-full">
          <div className="flex justify-between items-end gap-2 mb-2">
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge class="badge badge-outline badge-success text-xs" title="Type one">
                <span className="flex items-center">
                  {/* <i class="ki-filled ki-chart-line-up text-sm me-1"></i> */}
                  <span className="flex flex-col">
                    <span>Total: <strong>3</strong></span>
                    <span>Amount: <strong>&#8377;22,000/-</strong></span>
                  </span>
                </span>
              </Badge>
              <Badge class="badge badge-outline badge-dark text-xs" title="Type one">
                <span className="flex items-center">
                  {/* <i class="ki-filled ki-chart-line-up text-sm me-1"></i> */}
                  <span className="flex flex-col">
                    <span>Open: <strong>150</strong></span>
                    <span>Amount: <strong>&#8377;0/-</strong></span>
                  </span>
                </span>
              </Badge>
              <Badge class="badge badge-outline badge-info text-xs" title="Type one">
                <span className="flex items-center">
                  {/* <i class="ki-filled ki-chart-line-up text-sm me-1"></i> */}
                  <span className="flex flex-col">
                    <span>Won: <strong>1</strong></span>
                    <span>Amount: <strong>&#8377;22.000/-</strong></span>
                  </span>
                </span>
              </Badge>
              <Badge class="badge badge-outline badge-danger text-xs" title="Type one">
                <span className="flex items-center">
                  {/* <i class="ki-filled ki-chart-line-up text-sm me-1"></i> */}
                  <span className="flex flex-col">
                    <span>Lost: <strong>3</strong></span>
                    <span>Amount: <strong>&#8377;0/-</strong></span>
                  </span>
                </span>
              </Badge>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button onClick={scrollLeft} className="btn btn-light btn-sm px-3">
                <i class="ki-filled ki-arrow-left"></i> Prev
              </button>
              <button onClick={scrollRight} className="btn btn-light btn-sm px-3">
                Next <i class="ki-filled ki-arrow-right"></i>
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className={`${dndActive ? "dnd-active" : ""} overflow-x-auto flex space-x-4 cursor-grab`}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            <DragAndDrop
              columns={columns}
              setColumns={setColumns}
              setDndActive={setDndActive}
            />
          </div>
        </div>
      </Container>
      {/* AddContact */}
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { LeadPage };
