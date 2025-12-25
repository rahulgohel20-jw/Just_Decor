import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { GetAllCustomThemeByUserId } from "@/services/apiServices";
import { useRef } from "react";
import Swal from "sweetalert2";
import { toAbsoluteUrl } from "@/utils";

const AdminReportCustomThem = () => {
  const [showMore, setShowMore] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("theme"); // 'theme' or 'nameplate'

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!userId || hasFetched.current) return;

    hasFetched.current = true;
    fetchTemplates(userId);
  }, [userId]);

  const fetchTemplates = async (userId) => {
    setIsLoading(true);
    try {
      const response = await GetAllCustomThemeByUserId(userId);
      console.log("customeTheme", response);

      if (response?.data?.success && response?.data?.data) {
        // Map the response to extract templateMaster data
        const mappedData = response.data.data.map((item) => ({
          id: item.id,
          userId: item.userId,
          name: item.templateMaster?.name,
          frontPage: item.templateMaster?.frontPage,
          secondFrontPage: item.templateMaster?.secondFrontPage,
          watermark: item.templateMaster?.watermark,
          lastMainPage: item.templateMaster?.lastMainPage,
          isNamePlate: item.templateMaster?.isNamePlate,
          namePlateBg: item.templateMaster?.namePlateBg,
          nameplateName: item.templateMaster?.nameplateName,
          dummyPdf: item.templateMaster?.dummyPdf,
          headingFontColor: item.templateMaster?.headingFontColor,
          contentFontColor: item.templateMaster?.contentFontColor,
          templateModuleMaster:
            item.templateModuleMaster ||
            item.templateMaster?.templateModuleMaster,
          isActive: item.templateMaster?.isActive,
          createdAt: item.createdAt,
        }));
        setTemplateList(mappedData);
      } else {
        setTemplateList([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplateList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the API base URL from environment or construct it
  const getFullImageUrl = (path) => {
    if (!path) return null;
    // If path already includes http/https, return as is
    if (path.startsWith("http")) return path;
    // Otherwise, construct full URL - adjust this based on your API base URL
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    return `${baseUrl}${path}`;
  };

  // Filter templates based on active tab
  const themeTemplates = templateList.filter(
    (template) => template.isNamePlate === false || template.isNamePlate === 0
  );
  const nameplateTemplates = templateList.filter(
    (template) => template.isNamePlate === true || template.isNamePlate === 1
  );

  // Get current templates based on active tab
  const currentTemplates =
    activeTab === "theme" ? themeTemplates : nameplateTemplates;

  const displayedThemes = showMore
    ? currentTemplates
    : currentTemplates.slice(0, 8);

  const openPDF = (theme) => {
    if (!theme.dummyPdf) {
      Swal.fire({
        title: "No PDF Available",
        text: "This template doesn't have a dummy PDF",
        icon: "info",
      });
      return;
    }

    setIsGenerating(true);
    setSelectedTheme(theme);

    // Get full PDF URL
    const pdfFullUrl = getFullImageUrl(theme.dummyPdf);
    console.log("PDF URL:", pdfFullUrl);

    // Set PDF URL after a short delay to show loading state
    setTimeout(() => {
      setPdfUrl(pdfFullUrl);
      setIsGenerating(false);
    }, 1000);
  };

  const closeViewer = () => {
    setPdfUrl(null);
    setSelectedTheme(null);
  };

  const refreshTemplates = () => {
    const userId = localStorage.getItem("userId");
    fetchTemplates(userId);
  };

  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <div className="pb-4 mb-3 border-b border-gray-200">
          <Breadcrumbs items={[{ title: "Menu Report Themes" }]} />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab("theme");
              setShowMore(false); // Reset show more when switching tabs
            }}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "theme"
                ? "text-[#005BA8] border-b-2 border-[#005BA8]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Themes
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "theme"
                  ? "bg-[#005BA8] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {themeTemplates.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("nameplate");
              setShowMore(false); // Reset show more when switching tabs
            }}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "nameplate"
                ? "text-[#005BA8] border-b-2 border-[#005BA8]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nameplates
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "nameplate"
                  ? "bg-[#005BA8] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {nameplateTemplates.length}
            </span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#005BA8] border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading templates...</p>
            </div>
          </div>
        ) : currentTemplates.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <img
                src={toAbsoluteUrl("/images/nofound.jpg")}
                className="dark:hidden max-h-[230px]"
                alt=""
              />

              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No {activeTab === "theme" ? "themes" : "nameplates"} found
              </h3>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-10">
              {displayedThemes.map((theme, index) => (
                <div
                  key={theme.id || index}
                  className="w-full sm:w-[45%] md:w-[30%] lg:w-[22%] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  {/* PDF View Button - Only show for themes with PDF */}
                  {theme.dummyPdf && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPDF(theme);
                      }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-[#005BA8] hover:text-[#004C8C] p-2 rounded-full shadow-md transition z-10"
                      title="View PDF"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="h-[250px] w-full overflow-hidden bg-gray-100">
                    {/* Display namePlateBg for nameplates, frontPage for themes */}
                    {activeTab === "nameplate" && theme.namePlateBg ? (
                      <img
                        src={getFullImageUrl(theme.namePlateBg)}
                        alt={theme.nameplateName || theme.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-image.png";
                        }}
                      />
                    ) : theme.frontPage ? (
                      <img
                        src={getFullImageUrl(theme.frontPage)}
                        alt={theme.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-image.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="h-20 w-20 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-4 text-center bg-white">
                    <h3 className="text-[17px] font-semibold text-[#002D62] leading-snug tracking-wide">
                      {activeTab === "nameplate"
                        ? theme.nameplateName || theme.name
                        : theme.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {theme.templateModuleMaster?.nameEnglish || "N/A"}
                    </p>
                    {!theme.dummyPdf && activeTab === "theme" && (
                      <span className="inline-block mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        No PDF Available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentTemplates.length > 8 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="bg-[#005BA8] text-white px-6 py-2 rounded-full shadow hover:bg-[#004C8C] transition"
                >
                  {showMore ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </Container>

      {/* PDF Viewer Modal */}
      {selectedTheme && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden relative flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 gap-2">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-[#002D62]">
                  {selectedTheme.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedTheme.templateModuleMaster?.nameEnglish}
                </p>
              </div>
              <button
                onClick={closeViewer}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#005BA8] border-t-transparent mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              ) : pdfUrl ? (
                <embed
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title={`PDF Viewer - ${selectedTheme.name}`}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AdminReportCustomThem;
