import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const SuperAdminMember = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Members" }]} />
        </div>

        {/* Member Info Section */}
        <div className="flex flex-col md:flex-row bg-white rounded-md shadow border border-gray-200">
          {/* Left Section */}
          <div className="md:w-1/3 border-r border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center mb-4">
              <i className="fas fa-user text-blue-500 mr-2"></i>
              <span className="font-semibold text-lg">Member info</span>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold">Mrs. Jyotiben K Patel</h2>

              {/* Status Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  PLC: Cleared
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  SALES: TOKEN
                </span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  WC: Pending
                </span>
              </div>

              <div className="mt-3">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded">
                  Profile: Normal
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-2 mt-6">
              <button className="bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600">
                Member Details
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-600">
                Member Interaction
              </button>
            </div>

            {/* Member Info List */}
            <div className="mt-6 space-y-3 text-sm">
              <p>
                <strong>Member ID:</strong> TBHSIG999
              </p>
              <p>
                <strong>Registration:</strong> 09/10/2024
              </p>
              <p>
                <strong>Mobile No:</strong> 9825626163
              </p>
              <p>
                <strong>Email Id:</strong> kkpatel1973@gmail.com
              </p>
              <p>
                <strong>Date Of Birth:</strong> -
              </p>
              <p>
                <strong>Member Type:</strong> Individual
              </p>
              <p>
                <strong>Product:</strong> Signature 3* 4*
              </p>
              <p>
                <strong>Membership Price:</strong> 62000.0
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-2/3 p-6">
            {/* Top Info Bar */}
            <div className="flex flex-wrap justify-between items-center bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700">
              <span className="font-medium">
                Mrs. Jyotiben K Patel | Util. Nights: 0 | Bal. Nights: 18 |
                Pend. Amt: 0.0
              </span>
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded">
                Prin. Realized : 100.00 %
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-5 text-sm text-gray-700">
              <p>
                <strong>Address:</strong> -
              </p>
              <p>
                <strong>Approved At:</strong> -
              </p>

              <p>
                <strong>Res City:</strong> Ahmedabad
              </p>
              <p>
                <strong>Created At:</strong> 09/10/2024
              </p>

              <p>
                <strong>Reporting Manager:</strong> PRATIK RATHOD
              </p>
              <p>
                <strong>Sales Exec name:</strong> SAMIR RATHOD
              </p>

              <p>
                <strong>Sales Channel:</strong> Company
              </p>
              <p>
                <strong>Sales Branch:</strong> Ahmedabad
              </p>

              <p>
                <strong>MAF Signed Date:</strong> 19/09/2024
              </p>
              <p>
                <strong>Holiday Start Date:</strong> 19/11/2024
              </p>

              <p>
                <strong>Holiday End Date:</strong> 19/09/2027
              </p>
              <p>
                <strong>Payment Plan:</strong> Full Payment
              </p>

              <p>
                <strong>Product Sub Type:</strong> Signature
              </p>
              <p>
                <strong>Payment Mode:</strong> CASH
              </p>

              <p>
                <strong>ASF:</strong> ASF 0 Free
              </p>
              <p>
                <strong>Prin. Realized %:</strong> 100.00%
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default SuperAdminMember;
