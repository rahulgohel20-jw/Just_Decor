import { Fragment, useEffect, useState } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";
import { useNavigate, useParams } from "react-router-dom";
import { GetALLMemberDetailsByID } from "@/services/apiServices"; // Update with your actual API file path

const MemberProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get member ID from URL params
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
  try {
    setLoading(true);
    const response = await GetALLMemberDetailsByID(id);

    console.log("API RESPONSE:", response);

    const userDetails = response?.data?.data?.["User Details"];

    if (response.data.success && Array.isArray(userDetails) && userDetails.length > 0) {
      setMemberData(userDetails[0]);
    } else {
      setError("Member not found");
    }
  } catch (err) {
    setError("Failed to load member details");
    console.error("Error fetching member details:", err);
  } finally {
    setLoading(false);
  }
};


    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

  // Calculate total paid amount and remaining amount
  const calculatePaymentSummary = () => {
    if (!memberData) return { totalPaid: 0, remaining: 0, percentage: 0 };
    
    const planPrice = memberData.userPlan?.plan?.price || 0;
    const totalPaid = memberData.downPayment?.reduce((sum, payment) => {
      return payment.paymentDone ? sum + payment.amount : sum;
    }, 0) || 0;
    
    const remaining = planPrice - totalPaid;
    const percentage = planPrice > 0 ? ((totalPaid / planPrice) * 100).toFixed(0) : 0;
    
    return { totalPaid, remaining, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Member not found"}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { totalPaid, remaining, percentage } = calculatePaymentSummary();

  return (
    <Fragment>
      <div className="min-h-screen p-4">
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
              <span className={`${memberData.isApprove ? 'bg-green-600' : 'bg-red-600'} text-white text-xs px-3 py-1 rounded-lg shadow-sm flex items-center`}>
                {memberData.isApprove ? 'Approved' : 'Not Approved'}
              </span>
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg shadow-sm flex items-center">
                {memberData.userCode}
              </span>
            </div>

            {/* Profile Avatar */}
            <div className="flex flex-col items-center mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-3 overflow-hidden shadow-md">
                <img
                  src={toAbsoluteUrl(`/images/user_img.jpg`)}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name + Profile Indicator */}
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {memberData.firstName} {memberData.lastName}
                </h2>

                {/* Profile Indicator */}
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {memberData.memberType}
                </span>
              </div>

              {/* Plan Badge */}
              <span className="text-md font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {memberData.userPlan?.plan?.name || 'No Plan'}
                </span>
              
            </div>

            {/* Member Details */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-800">User Code:</p>
                <p className="font-medium text-gray-600">{memberData.userCode}</p>
              </div>

              <div>
                <p className="text-gray-800">Registration:</p>
                <p className="font-medium text-gray-600">{memberData.createdAt}</p>
              </div>

              <div>
                <p className="text-gray-800">Mobile No:</p>
                <p className="font-medium text-gray-600">
                  {memberData.countryCode} {memberData.contactNo}
                </p>
              </div>

              <div>
                <p className="text-gray-800">Email Id:</p>
                <p className="font-medium text-gray-600">{memberData.email}</p>
              </div>

              <div>
                <p className="text-gray-800">Member Type:</p>
                <p className="font-medium text-gray-600 capitalize">{memberData.memberType}</p>
              </div>

              <div>
                <p className="text-gray-800">Membership Price:</p>
                <p className="font-medium text-gray-600">₹{memberData.userPlan?.plan?.price || 0}</p>
              </div>

              <div>
                <p className="text-gray-800">Plan:</p>
                <p className="font-medium text-gray-600">{memberData.userPlan?.plan?.name || 'N/A'}</p>
              </div>

              <div>
                <p className="text-gray-800">Status:</p>
                <p className={`font-medium ${memberData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {memberData.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg border border-blue-100">
              <div className="bg-white rounded-lg shadow-lg mb-4">
                <div className="flex justify-between items-center bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <i className="fas fa-user"></i>
                    <span>{memberData.firstName} {memberData.lastName}</span>
                    <span>-</span>
                    <div className="px-3 py-1 bg-red-100 rounded-lg">
                      <span className="text-red-600 text-sm">
                        Remaining amount: ₹{remaining}
                      </span>
                      <span className="px-2 text-red-900">({percentage}%)</span>
                    </div>
                  </div>

                  <button
                    className="bg-white text-black hover:bg-gray-100 px-4 py-1 rounded-lg text-sm transition-all"
                    onClick={() => navigate(`/Superadmin-member-edit/${id}`)}
                  >
                    Edit
                  </button>
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
                    <p className="text-gray-600">{memberData.address || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-gray-800 mb-1 font-semibold">State ID:</p>
                    <p className="text-gray-600">{memberData.stateId}</p>
                  </div>

                  <div>
                    <p className="text-gray-800 mb-1 font-semibold">Created At:</p>
                    <p className="text-gray-600">{memberData.createdAt}</p>
                  </div>

                  <div>
                    <p className="text-gray-800 mb-1 font-semibold">Mobile No:</p>
                    <p className="text-gray-600">{memberData.countryCode} {memberData.contactNo}</p>
                  </div>

                  {memberData.companyName && (
                    <div>
                      <p className="text-gray-800 mb-1 font-semibold">Company Name:</p>
                      <p className="text-gray-600">{memberData.companyName}</p>
                    </div>
                  )}

                  {memberData.companyEmail && (
                    <div>
                      <p className="text-gray-800 mb-1 font-semibold">Company Email:</p>
                      <p className="text-gray-600">{memberData.companyEmail}</p>
                    </div>
                  )}

                  {memberData.officeNo && (
                    <div>
                      <p className="text-gray-800 mb-1 font-semibold">Office No:</p>
                      <p className="text-gray-600">{memberData.officeNo}</p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <p className="text-gray-800 mb-1 font-semibold">Reporting Manager ID:</p>
                    <p className="text-gray-600">{memberData.reportingManagerId}</p>
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

              {memberData.userDocument && memberData.userDocument.length > 0 ? (
                <div className="space-y-4">
                  {memberData.userDocument.map((doc, index) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-800 mb-1 font-semibold">KYC Type</p>
                          <p className="text-gray-600 capitalize">{doc.kycType}</p>
                        </div>

                        <div>
                          <p className="text-gray-800 mb-1 font-semibold">KYC Number</p>
                          <p className="text-gray-600">{doc.kycNo}</p>
                        </div>

                        <div>
                          <p className="text-gray-800 mb-1 font-semibold">Document #{index + 1}</p>
                        </div>
                      </div>

                      {doc.docPath && (
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-file-pdf text-red-600"></i>
                            <div>
                              <p className="font-medium text-sm">Document</p>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            </div>
                          </div>
                          <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition-all shadow-md">
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No KYC documents available</p>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                Payment details | Pending Amount: ₹{remaining}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Plan Name:</p>
                  <p className="text-gray-600">{memberData.userPlan?.plan?.name || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Plan Price:</p>
                  <p className="text-gray-600">₹{memberData.userPlan?.plan?.price || 0}</p>
                </div>

                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Total Paid:</p>
                  <p className="text-green-600 font-semibold">₹{totalPaid}</p>
                </div>

                <div>
                  <p className="text-gray-800 mb-1 font-semibold">Payment Progress:</p>
                  <p className="text-blue-600 font-semibold">{percentage}%</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Payment History</h4>
                {memberData.downPayment && memberData.downPayment.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-blue-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary text-white">
                          <th className="text-left py-2 px-3 font-medium">Payment Mode</th>
                          <th className="text-left py-2 px-3 font-medium">Amount</th>
                          <th className="text-left py-2 px-3 font-medium">Pay ID</th>
                          <th className="text-left py-2 px-3 font-medium">Date</th>
                          <th className="text-left py-2 px-3 font-medium">Remarks</th>
                          <th className="text-left py-2 px-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberData.downPayment.map((payment) => (
                          <tr key={payment.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="py-3 px-3 capitalize">{payment.paymentType}</td>
                            <td className="py-3 px-3">₹{payment.amount}</td>
                            <td className="py-3 px-3">{payment.payid}</td>
                            <td className="py-3 px-3">{payment.transactionDateTime}</td>
                            <td className="py-3 px-3">{payment.remarks || '-'}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.paymentDone 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {payment.paymentDone ? 'Completed' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payment history available</p>
                )}
              </div>
            </div>

            {/* Plan Features */}
            {memberData.userPlan?.plan?.features && memberData.userPlan.plan.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                  Plan Features
                </h3>
                <ul className="space-y-2">
                  {memberData.userPlan.plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2 text-sm text-gray-700">
                      <i className="fas fa-check-circle text-green-600 mt-1"></i>
                      <span>{feature.featureText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MemberProfile