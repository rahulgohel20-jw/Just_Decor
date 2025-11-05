import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";
import { useNavigate } from "react-router-dom";

const MemberProfile = () => {

  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="min-h-screen   p-4">
        {/* Header */}
        

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
            {/* Member Info Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg shadow-md">
                <i className="fas fa-user"></i>
                <span className="font-medium text-sm">Member Info</span>
              </div>
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow-sm flex items-center">Not Approved</span>
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg shadow-sm flex items-center">JCP25520</span>
            </div>

            {/* Profile Avatar */}
            <div className="flex flex-col items-center mb-6">
  {/* Avatar */}
  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-3 overflow-hidden shadow-md">
    <img
      src={toAbsoluteUrl(`/images/user_img.jpg`)} // ✅ Ensure image is in /public/images
      alt="User Avatar"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Name + Profile Indicator */}
  <div className="flex items-center gap-2 mb-1">
    <h2 className="text-xl font-bold text-gray-800">Max Smith</h2>

    {/* Profile Indicator — change bg and text color based on profile level */}
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        "high" === "high"
          ? "bg-green-100 text-green-700"
          : "average" === "average"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      High Profile
    </span>
  </div>

  {/* Plan Badge */}
  <button className="text-lg text-blue-600 bg-blue-100 px-4 py-1 rounded-full">
    E-Lite
  </button>
</div>


            {/* Member Details */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-800">User Code:</p>
                <p className="font-medium text-gray-600">MH000099</p>
              </div>
              
              <div>
                <p className="text-gray-800">Registration:</p>
                <p className="font-medium text-gray-600">09/10/2024</p>
              </div>
              
              <div>
                <p className="text-gray-800">Mobile No:</p>
                <p className="font-medium text-gray-600">9825626163</p>
              </div>
              
              <div>
                <p className="text-gray-800">Email Id:</p>
                <p className="font-medium text-gray-600">max@gmail.com</p>
              </div>
              
              <div>
                <p className="text-gray-800">Member Type:</p>
                <p className="font-medium text-gray-600">Individual</p>
              </div>
              
              <div>
                <p className="text-gray-800">Membership Price:</p>
                <p className="font-medium text-gray-600">820000</p>
              </div>
              
              <div>
                <p className="text-gray-800">Plan:</p>
                <p className="font-medium text-gray-600">E-lite</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg  border border-blue-100">
              <div className="bg-white rounded-lg shadow-lg mb-4 ">
          <div className="flex justify-between items-center bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <i className="fas fa-user"></i>
              <span>Mrs. Jyotiben K Patel</span><span>-</span>
            <div className="px-3 py-1 bg-red-100  rounded-lg">
              <span className="text-red-600 text-sm">Remaining amount : 2500</span><span className="px-2 text-red-900">
                (90%)
              </span>
            </div>
            </div>


            <button className="bg-white text-black hover:bg-gray-100 px-4 py-1 rounded-lg text-sm transition-all" onClick={() => navigate("/Superadmin-member-edit")}>Edit</button>
          </div>
        </div>

        <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Address:</p>
                  <p className="text-gray-600">
                    104/1st floor, Shubh house,<br />
                    Swastik cross Road, Ahmedabad
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">City:</p>
                  <p className="text-gray-600">Ahmedabad</p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Created At:</p>
                  <p className="text-gray-600">09/10/2025</p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Mobile No:</p>
                  <p className="text-gray-600">97372XXXX</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-gray-800 mb-1 font-semibold">Reporting Manager:</p>
                  <p className="text-gray-600">Swapnil Ghodeswar</p>
                </div>
              </div>

        </div>
            </div>

            {/* KYC Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                KYC Details
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">KYC Type</p>
                  <p className="text-gray-600">Aadhar ID</p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">KYC Number</p>
                  <p className="text-gray-600">1234-567-890</p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Date Submitted</p>
                  <p className="text-gray-600">01/10/2024</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Submitted Documents</h4>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-file-pdf text-red-600"></i>
                    <div>
                      <p className="font-medium text-sm">Proof_of_Identity.pdf</p>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">Download</button>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                Payment details | Pending Amount 0.00
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Plan Name:</p>
                  <p className="text-gray-600">E-lite</p>
                </div>
                
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Plan Price:</p>
                  <p className="text-gray-600">20,000</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Payment Mode</h4>
                <div className="overflow-x-auto rounded-lg border border-blue-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary to-indigo-600 text-white">
                        <th className="text-left py-2 px-3 font-medium">Payment Mode</th>
                        <th className="text-left py-2 px-3 font-medium">Amount</th>
                        <th className="text-left py-2 px-3 font-medium">Pay Details</th>
                        <th className="text-left py-2 px-3 font-medium">Date</th>
                        <th className="text-left py-2 px-3 font-medium">Remarks</th>
                        <th className="text-left py-2 px-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="py-3 px-3">Cash</td>
                        <td className="py-3 px-3">6000</td>
                        <td className="py-3 px-3">1</td>
                        <td className="py-3 px-3">1/10/2025</td>
                        <td className="py-3 px-3">-</td>
                        <td className="py-3 px-3">RZ</td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="py-3 px-3">Other</td>
                        <td className="py-3 px-3">6000</td>
                        <td className="py-3 px-3">2</td>
                        <td className="py-3 px-3">2/10/2025</td>
                        <td className="py-3 px-3">-</td>
                        <td className="py-3 px-3">RZ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MemberProfile;