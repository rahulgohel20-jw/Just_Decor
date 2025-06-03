const LeadLeftComponent = () => {
  return (
    <div className="h-full lg:border-e lg:border-e-border shrink-0 p-4 lg:p-7 bg-muted/25">
      <h6 className="font-semibold text-gray-900 mb-5">Lead Details</h6>
      <div className="flex flex-col flex-wrap gap-1.5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="badge badge-sm badge-pill badge-secondary text-xs"
            title="Stage"
          >
            L-169
          </div>
          <div className="text-lg font-medium text-gray-900">Sanjay Parmar</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Pipeline:</div>
          <div className="text-md font-medium text-gray-900">Aales Pipeline</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Stage:</div>
          <div className="text-md font-medium text-gray-900">New Inquiry</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Stage Remark:</div>
          <div className="text-md font-medium text-gray-900">NA</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Assigned To:</div>
          <div className="text-md font-medium text-gray-900">VT Viddhi Thakkar</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Source:</div>
          <div className="text-md font-medium text-gray-900">Facebookr</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Closing Date:</div>
          <div className="text-md font-medium text-gray-900">NA</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Amount:</div>
          <div className="text-md font-medium text-gray-900">NA</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Description:</div>
          <div className="text-md font-medium text-gray-900">He will call back in 10 min Details shared</div>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-5" />
      <h6 className="font-semibold text-gray-900 mb-5">Lead Details</h6>
      
      <h6 className="fw-bold border-end">
        <b>Contact Details</b>
      </h6>
      <div className="mt-3">
        <i className="ki-filled ki-user me-2"></i>
        <span>Shubham V Patel</span>
      </div>
      <div className="mt-3">
        <i className="ki-filled ki-user me-2"></i>
        <span>email</span>
      </div>
      <div className="mt-3">
        <i className="ki-filled ki-user me-2"></i>
        <span>+91 9865986598</span>
      </div>
      <div className="mt-3">
        <small>Last modified at: </small>
        <span>26 days ago</span>
      </div>
      <div className="mt-3">
        <small>Lead created at: </small>
        <span>26 days ago</span>
      </div>
    </div>
  );
};

export { LeadLeftComponent };
