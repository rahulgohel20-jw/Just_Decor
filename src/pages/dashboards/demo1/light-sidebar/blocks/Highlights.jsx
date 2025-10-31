import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/i18n';
import { DropdownCard1 } from '@/partials/dropdowns/general';
import { FormattedMessage } from 'react-intl';
const Highlights = ({
  limit
}) => {
  const {
    isRTL
  } = useLanguage();
  const rows = [{
    text: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_TOTAL_LITE_SALES" defaultMessage="Total Lite Sales" />,
    total: 172,
    stats: 3.9,
    increase: true
  }, {
    text: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_TOTAL_ELITE_SALES" defaultMessage="Total Elite Sales" />,
    total: 85,
    stats: 0.7,
    increase: false
  }, {
    text: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_TOTAL_PREMIUM_SALES" defaultMessage="Total Premium Sales" />,
    total: 36,
    stats: 8.2,
    increase: true
  }, {
    
    text: 'Google',
    total: 26,
    stats: 8.2,
    increase: true
  }, {
    
    text: 'Retail',
    total: 7,
    stats: 0.7,
    increase: false
  }];
  const items = [{
    badgeColor: 'badge-success',
    lebel: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_LITE_SALES" defaultMessage="Lite" />
  }, {
    badgeColor: 'badge-danger',
    lebel: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_ELITE_SALES" defaultMessage="Elite" />
  }, {
    badgeColor: 'badge-info',
    lebel: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_PREMIUM_SALES" defaultMessage="Premium" />
  }];
  const renderRow = (row, index) => {
    return <div key={index} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <KeenIcon icon={row.icon} className="text-base text-gray-500" />
          <span className="text-sm font-normal text-gray-900">{row.text}</span>
        </div>

        <div className="flex  items-center text-sm font-medium text-gray-800 gap-6">
          <span className="lg:text-right">${row.total}k</span>
          <span className="lg:text-right">
            {row.increase ? <KeenIcon icon="arrow-up" className="text-success" /> : <KeenIcon icon="arrow-down" className="text-danger" />}
            &nbsp;{row.stats}%
          </span>
        </div>
      </div>;
  };
  const renderItem = (item, index) => {
    return <div key={index} className="flex items-center gap-1.5">
        <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
        <span className="text-sm font-normal text-gray-800">{item.lebel}</span>
      </div>;
  };
  return <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title"><FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHTS" defaultMessage="Highlights" /></h3>

        <Menu>
          <MenuItem toggle="dropdown" trigger="click" dropdownProps={{
          placement: isRTL() ? 'bottom-start' : 'bottom-end',
          modifiers: [{
            name: 'offset',
            options: {
              offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCard1()}
          </MenuItem>
        </Menu>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-gray-700"><FormattedMessage id="USER.DASHBOARD.DASHBOARD_HIGHLIGHT_ALLTIMEUSER" defaultMessage="All time sales" /></span>

          <div className="flex justify-between items-center gap-2.5">
            <span className="text-3xl font-semibold text-gray-900">$295.7k</span>
            <span className="badge badge-outline badge-success badge-sm">+2.7%</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-success h-2 w-full max-w-[45%] rounded-md"></div>
          <div className="bg-brand h-2 w-full max-w-[35%] rounded-md"></div>
          <div className="bg-info h-2 w-full max-w-[20%] rounded-md"></div>
        </div>

        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
          return renderItem(item, index);
        })}
        </div>

        <div className="border-b border-gray-300"></div>

        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
      </div>
    </div>;
};
export { Highlights };