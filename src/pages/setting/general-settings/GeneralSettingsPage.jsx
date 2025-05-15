import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
 import  AddRole  from "@/partials/modals/add-role/AddRole";

import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const GeneralSettingsPage = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Sample roles data (you can replace this with dynamic data from an API)
  const roles = ["Manager", "SalesPerson", "test"];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "General Setting" }]} />
        </div>
        <div className="card min-w-full">
          <div className="card-table">
          <div className=" mx-auto  rounded-lg  p-4">
          
          <ul>
            <button className="w-full" onClick={() => setIsRoleModalOpen(true)}>

            <li className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm7-5h-2v2h2v-2zm-2 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-10-8H5v2h2v-2zm-2 4h2v2h-2v-2zm0 4h2v2h-2v-2z"></path>
                </svg>
                <span className="text-gray-700">Role and Permissions</span>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            </button>
            <button className="w-full">
            <li className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.9 1.999A4 4 0 003 15z"></path>
                </svg>
                <span className="text-gray-700">Bulk Data Import</span>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>

            </button>
            <button className="w-full">

            <li className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-gray-700">Export Leads</span>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </li>
            </button>
          </ul>
        </div>
          </div>
        </div>



        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              {/* Modal Header */}
              <div className="bg-red-700 text-white px-4 py-2 rounded-t-lg">
                <h3 className=" text-lg font-semibold">ROLES</h3>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                {/* Add Role Button */}
                <button className="mb-4 bg-red-700 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center" onClick={() => {
                
                handleModalOpen();
              }}>
                  <svg
                    className="w-5 h-5 mr-2 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Role
                </button>

                {/* Roles List */}
                <ul>
                  {roles.map((role, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-200"
                    >
                      <span className="text-gray-700">{role}</span>
                      <div className="flex items-center space-x-2">
                        {/* Edit Icon */}
                        <button>
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                            ></path>
                          </svg>
                        </button>
                        {/* Delete Icon */}
                        <button>
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1m6-1a1 1 0 011-1v1m-6 4v6m4-6v6"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer (Optional Close Button) */}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


        

        {/* <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-5 lg:gap-7.5">
          <div class="card p-5 lg:p-7.5">
            <div class="flex items-center flex-wrap justify-between gap-5">
            <div class="flex items-center gap-3.5">
            <div class="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
              <i class="ki-filled ki-ghost text-2xl text-gray-600"></i>
              </div>
            <div class="flex items-center justify-center w-[50px]">
              <img alt="" class="size-[50px] shrink-0" src="/static/metronic/tailwind/dist/assets/media/brand-logos/twitch-purple.svg">
              </div>
              <div class="">
              <a class="text-lg font-medium text-gray-900 hover:text-primary" href="">
                Urban Dreams
              </a>
              <div class="flex items-center text-sm text-gray-700">
                Live Gaming Spectacle Unveiled
              </div>
              </div>
            </div>
            <div class="flex items-center flex-wrap justify-between gap-5 lg:gap-12">
              <div class="flex items-center flex-wrap gap-2 lg:gap-5">
              <div class="flex flex-col gap-1.5 border border-dashed border-gray-300 rounded-md px-2.5 py-2">
                <span class="text-gray-900 text-sm leading-none font-medium">
                50.7%
                </span>
                <span class="text-gray-700 text-xs">
                Traffic Up
                </span>
              </div>
              <div class="flex flex-col gap-1.5 border border-dashed border-gray-300 rounded-md px-2.5 py-2">
                <span class="text-gray-900 text-sm leading-none font-medium">
                20.1k
                </span>
                <span class="text-gray-700 text-xs">
                New Fans
                </span>
              </div>
              <div class="flex flex-col gap-1.5 border border-dashed border-gray-300 rounded-md px-2.5 py-2">
                <span class="text-gray-900 text-sm leading-none font-medium">
                $100k
                </span>
                <span class="text-gray-700 text-xs">
                Donated
                </span>
              </div>
              </div>
              <div class="flex justify-center w-20">
              <span class="badge badge-success badge-outline">
                Completed
              </span>
              </div>
              <div class="menu" data-menu="true">
              <div class="menu-item menu-item-dropdown" data-menu-item-offset="0, 10px" data-menu-item-placement="bottom-end" data-menu-item-toggle="dropdown" data-menu-item-trigger="click|lg:click">
                <button class="menu-toggle btn btn-sm btn-icon btn-light btn-clear">
                <i class="ki-filled ki-dots-vertical">
                </i>
                </button>
                <div class="menu-dropdown menu-default w-full max-w-[200px]" data-menu-dismiss="true">
                <div class="menu-item">
                  <a class="menu-link" href="/metronic/tailwind/demo1/account/home/settings-enterprise">
                  <span class="menu-icon">
                    <i class="ki-filled ki-setting-3">
                    </i>
                  </span>
                  <span class="menu-title">
                    Settings
                  </span>
                  </a>
                </div>
                <div class="menu-item">
                  <a class="menu-link" href="/metronic/tailwind/demo1/account/members/import-members">
                  <span class="menu-icon">
                    <i class="ki-filled ki-some-files">
                    </i>
                  </span>
                  <span class="menu-title">
                    Import
                  </span>
                  </a>
                </div>
                <div class="menu-item">
                  <a class="menu-link" href="/metronic/tailwind/demo1/account/activity">
                  <span class="menu-icon">
                    <i class="ki-filled ki-cloud-change">
                    </i>
                  </span>
                  <span class="menu-title">
                    Activity
                  </span>
                  </a>
                </div>
                <div class="menu-item">
                  <a class="menu-link" data-modal-toggle="#report_user_modal" href="#">
                  <span class="menu-icon">
                    <i class="ki-filled ki-dislike">
                    </i>
                  </span>
                  <span class="menu-title">
                    Report
                  </span>
                  </a>
                </div>
                </div>
              </div>
              </div>
            </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body grid gap-7 py-7.5">
              <div class="grid place-items-center gap-4">
                <div class="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
                  <i class="ki-filled ki-ghost text-2xl text-gray-600"></i>
                </div>
                <div class="grid place-items-center">
                  <a
                    class="text-base font-medium text-gray-900 hover:text-primary-active mb-px"
                    href="#"
                  >
                    Pixel Crafters
                  </a>
                  <span class="text-2sm text-gray-700 text-center">
                    Crafting digital experiences for the world
                  </span>
                </div>
              </div>
              <div class="grid">
                <div class="flex items-center justify-between flex-wrap mb-3.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">skills</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="badge badge-sm badge-outline">Ul</span>
                    <span class="badge badge-sm badge-outline">DevOps</span>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed"></div>
                <div class="flex items-center justify-between flex-wrap my-2.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">rating</span>
                  <div class="rating">
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed mb-3.5"></div>
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="text-2xs text-gray-600 uppercase">memebers</span>
                  <div class="flex -space-x-2">
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                      <span class="relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-7 text-success-inverse ring-success-light bg-success">
                        +10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer justify-center">
              <a class="btn btn-light btn-sm">
                <i class="ki-filled ki-check-circle"></i>
                Joined
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-body grid gap-7 py-7.5">
              <div class="grid place-items-center gap-4">
                <div class="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
                  <i class="ki-filled ki-ghost text-2xl text-gray-600"></i>
                </div>
                <div class="grid place-items-center">
                  <a
                    class="text-base font-medium text-gray-900 hover:text-primary-active mb-px"
                    href="#"
                  >
                    Pixel Crafters
                  </a>
                  <span class="text-2sm text-gray-700 text-center">
                    Crafting digital experiences for the world
                  </span>
                </div>
              </div>
              <div class="grid">
                <div class="flex items-center justify-between flex-wrap mb-3.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">skills</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="badge badge-sm badge-outline">Ul</span>
                    <span class="badge badge-sm badge-outline">DevOps</span>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed"></div>
                <div class="flex items-center justify-between flex-wrap my-2.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">rating</span>
                  <div class="rating">
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed mb-3.5"></div>
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="text-2xs text-gray-600 uppercase">memebers</span>
                  <div class="flex -space-x-2">
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                      <span class="relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-7 text-success-inverse ring-success-light bg-success">
                        +10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer justify-center">
              <a class="btn btn-light btn-sm">
                <i class="ki-filled ki-check-circle"></i>
                Joined
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-body grid gap-7 py-7.5">
              <div class="grid place-items-center gap-4">
                <div class="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
                  <i class="ki-filled ki-ghost text-2xl text-gray-600"></i>
                </div>
                <div class="grid place-items-center">
                  <a
                    class="text-base font-medium text-gray-900 hover:text-primary-active mb-px"
                    href="#"
                  >
                    Pixel Crafters
                  </a>
                  <span class="text-2sm text-gray-700 text-center">
                    Crafting digital experiences for the world
                  </span>
                </div>
              </div>
              <div class="grid">
                <div class="flex items-center justify-between flex-wrap mb-3.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">skills</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="badge badge-sm badge-outline">Ul</span>
                    <span class="badge badge-sm badge-outline">DevOps</span>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed"></div>
                <div class="flex items-center justify-between flex-wrap my-2.5 gap-2">
                  <span class="text-2xs text-gray-600 uppercase">rating</span>
                  <div class="rating">
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                    <div class="rating-label checked">
                      <i class="rating-on ki-solid ki-star text-base leading-none"></i>
                      <i class="rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                  </div>
                </div>
                <div class="border-t border-gray-300 border-dashed mb-3.5"></div>
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <span class="text-2xs text-gray-600 uppercase">memebers</span>
                  <div class="flex -space-x-2">
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                    </div>
                    <div class="flex">
                      <span class="relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-7 text-success-inverse ring-success-light bg-success">
                        +10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer justify-center">
              <a class="btn btn-light btn-sm">
                <i class="ki-filled ki-check-circle"></i>
                Joined
              </a>
            </div>
          </div>
        </div> */}

        


      </Container>
      <AddRole
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        
      />
    </Fragment>
  );
};
export { GeneralSettingsPage };
