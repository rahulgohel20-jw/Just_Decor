import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const GeneralSettingsPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "General" }]} />
        </div>


        

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-5 lg:gap-7.5">
        <div class="card p-5 lg:p-7.5">
          <div class="flex items-center flex-wrap justify-between gap-5">
           <div class="flex items-center gap-3.5">
           <div class="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
            <i class="ki-filled ki-ghost text-2xl text-gray-600"></i>
            </div>
           <div class="flex items-center justify-center w-[50px]">
             {/* <img alt="" class="size-[50px] shrink-0" src="/static/metronic/tailwind/dist/assets/media/brand-logos/twitch-purple.svg"> */}
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
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-1.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-2.png"> */}
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
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-1.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-2.png"> */}
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
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-1.png"> */}
                    </div>
                    <div class="flex">
                      {/* <img class="hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-7" src="/static/metronic/tailwind/dist/assets/media/avatars/300-2.png"> */}
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
        </div>

        


      </Container>
    </Fragment>
  );
};
export { GeneralSettingsPage };
