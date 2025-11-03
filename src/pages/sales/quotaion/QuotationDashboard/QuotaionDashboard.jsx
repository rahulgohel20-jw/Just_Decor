import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import QuotationTable from "@/components/QuotationTable/QuotationTable";
import { CommonHexagonBadge } from "@/partials/common";
import { GetAllQuotation } from "@/services/apiServices";
import { toAbsoluteUrl } from "@/utils";
import { Download } from "lucide-react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

const QuotationDashboard = () => {
  const [tableData, setTableData] = useState(defaultData);
  const [totals, setTotals] = useState({
    receivable: 0,
    remaining: 0,
    total: 0,
  });
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user?.id || 0;
  const intl = useIntl();
  const fetchQuotations = async () => {
    const response = await GetAllQuotation(userId);
    const data =
      response?.data?.data["Event Functions Quotation Details"]?.map(
        (quotation, index) => ({
          Invoice: index + 1,
          EventId: quotation?.event?.id || "-",
          CustomerName: quotation?.event?.party?.nameEnglish || "-",
          PartyId: quotation?.event?.party?.id || "-",
          Eventname: quotation?.event?.eventType?.nameEnglish || "-",
          eventDate: quotation?.event?.eventStartDateTime
            ? new Date(quotation.event.eventStartDateTime).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" }
              )
            : "-",
          QuotationDate: quotation?.createdAt || "-",
          Amount: quotation?.totalAmount || "-",
          BalanceDue: quotation?.remainingAmount || "-",
        })
      ) || [];

    setTableData(data);

    const totalReciveAmt =
      response?.data?.data?.["Event Functions Quotation Details"][0]
        .overAllReceivableAmnt || 0;
    const totalRemainingAmt =
      response?.data?.data?.["Event Functions Quotation Details"][0]
        .overAllRemainingAmnt || 0;
    const totalAmt =
      response?.data?.data?.["Event Functions Quotation Details"][0]
        .overallTotalAmnt || 0;
    console.log(totalReciveAmt);

    setTotals({
      receivable: totalReciveAmt,
      remaining: totalRemainingAmt,
      total: totalAmt,
    });
  };

  useEffect(() => {
    fetchQuotations();
  }, []);
  const steps = [
    {
      title: <FormattedMessage id="SALES.TOTAL_OUTSTANDING_RECEIVABLE" defaultMessage="Total Outstanding Receivable" />,
      value: `₹ ${totals.receivable}`,
      icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
    },
    {
      title: <FormattedMessage id="SALES.TOTAL_REMAINING" defaultMessage="Total Remaining" />,
      value: `₹ ${totals.remaining}`,
      icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
    },
    {
      title: <FormattedMessage id="SALES.TOTAL_AMOUNT" defaultMessage="Total Amount" />,
      value: `₹ ${totals.total}`,
      icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
    },
  ];

  return (
    <Fragment>
      <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
          }
        `}
      </style>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="SALES.QUOTATION_OVERVIEW" defaultMessage="Quotation Overview" /> }]} />
        </div>

        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({ id: "SALES.SEARCH_QUOTATION", defaultMessage: "Search Quotation" })}
                type="text"
              />
            </div>
            <div className="filItems relative">
              <select defaultValue="All Invoice" className="select pe-7.5">
                <option value="0" selected>
                  <FormattedMessage id="SALES.ALL_QUOTATION" defaultMessage="All Quotations" />
                </option>
                <option value="1">
                  <FormattedMessage id="SALES.LAST_3_MONTHS" defaultMessage="Last 3 Months" />
                </option>
                <option value="2">
                  <FormattedMessage id="SALES.LAST_6_MONTHS" defaultMessage="Last 6 Months" />
                </option>
                <option value="3">
                  <FormattedMessage id="SALES.CUSTOM_DATE" defaultMessage="Custom Date" />
                </option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" title="Download">
              <Download style={{ width: "18", height: "18" }} /> <FormattedMessage id="SALES.DOWNLOAD" defaultMessage="Download" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-4 mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card min-w-full p-4 rtl:[background-position:-center_center] [background-position:center_center] bg-no-repeat bg-[length:460px] user-access-bg"
            >
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <CommonHexagonBadge
                  stroke="stroke-primary-clarity"
                  fill="fill-light"
                  size="size-[50px]"
                  badge={step.icon}
                />
                <div className="flex flex-col items-center justify-center w-full">
                  <p className="form-info text-gray-700 font-normal text-center mb-0">
                    {step.title}
                  </p>
                  <h3 className="text-xl font-semibold text-primary mb-0">
                    {step.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <QuotationTable columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};
export default QuotationDashboard;
