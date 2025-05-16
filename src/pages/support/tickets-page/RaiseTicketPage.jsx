import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const RaiseTicketPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ticket submitted!");
    closeModal();
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Raise Tickets" }]} />
        </div>

        {/* Simulate sidebar raise ticket button */}
        <div className="text-center mb-6">
          <button
            onClick={openModal}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Raise a Ticket
          </button>
        </div>

        {/* Your page content */}

        {/* Modal popup */}
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={closeModal}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-100 rounded-lg max-w-md w-full p-6 shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
                  aria-label="Close modal"
                >
                  &#x2715;
                </button>

                <h2 className="text-lg font-semibold mb-4">Raise a Ticket</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    required
                    className="w-full p-2 rounded border border-gray-300"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option>Report An option</option>
                    <option>Give Feedback</option>
                    <option>Issue on Billing</option>
                  </select>

                  <select
                    required
                    className="w-full p-2 rounded border border-gray-300"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Sub Category
                    </option>
                    <option>Leads</option>
                    <option>Contact</option>
                    <option>Follow Up</option>
                    <option>other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Subject"
                    required
                    className="w-full p-2 rounded border border-gray-300"
                  />

                  <textarea
                    placeholder="Description"
                    rows={4}
                    required
                    className="w-full p-2 rounded border border-gray-300"
                  ></textarea>

                  <div className="flex items-center space-x-2 text-gray-600 text-sm mt-2">
                    <span>Upload Image/Videos showing your Issue</span>

                    {/* Image upload */}
                    <label
                      className="cursor-pointer hover:text-gray-800"
                      title="Upload Image"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        // Add your onChange handlers here
                      />
                      {/* Image icon SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v8z"
                        />
                      </svg>
                    </label>

                    {/* Video upload */}
                    <label
                      className="cursor-pointer hover:text-gray-800"
                      title="Upload Video"
                    >
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        // Add your onChange handlers here
                      />
                      {/* Video icon SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h11a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                        />
                      </svg>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-green-600 transition"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </Container>
    </Fragment>
  );
};

export { RaiseTicketPage };
