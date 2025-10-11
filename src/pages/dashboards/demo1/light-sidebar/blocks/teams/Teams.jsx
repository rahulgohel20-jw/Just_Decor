import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { DataGrid, KeenIcon, DataGridRowSelect, DataGridRowSelectAll, DataGridColumnHeader, useDataGrid } from '@/components';
import { CommonRating } from '@/partials/common';
import axios from 'axios';
import { formatIsoDate } from '@/utils/Date';
import { TeamUsers } from './TeamUsers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Teams = () => {
  // Default mock data
  const defaultData = [
    {
      id: 1,
      name: 'Zainab Tatariya',
      phone: '8209792623',
      is_active: true,
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 2,
      name: 'Zainab Tatariya',
      phone: '8209792623',
      is_active: false,
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 3,
      name: 'Zainab Tatariya',
      phone: '8209792623',
      is_active: true,
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 4,
      name: 'Zainab Tatariya',
      phone: '8209792623',
      is_active: true,
      created_at: '2025-05-15T00:00:00Z'
    },
    {
      id: 5,
      name: 'Zainab Tatariya',
      phone: '8209792623',
      is_active: true,
      created_at: '2025-05-15T00:00:00Z'
    }
  ];

  const ColumnFilter = ({
    column
  }) => {
    const [inputValue, setInputValue] = useState(column.getFilterValue() ?? '');
    const handleKeyDown = event => {
      if (event.key === 'Enter') {
        column.setFilterValue(inputValue);
      }
    };
    const handleChange = event => {
      setInputValue(event.target.value);
    };
    return <Input placeholder="Filter..." value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} className="h-9 w-full max-w-40" />;
  };
  
  const columns = useMemo(() => [{
    accessorFn: (row, index) => index + 1,
    id: 'srNo',
    header: () => 'Sr. no.',
    enableSorting: false,
    enableHiding: false,
    cell: ({row, table}) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return pageIndex * pageSize + row.index + 1;
    },
    meta: {
      headerClassName: 'w-20'
    }
  }, {
    accessorFn: row => row.name,
    id: 'name',
    header: ({
      column
    }) => <DataGridColumnHeader title="Name" filter={<ColumnFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: info => <span className="text-sm text-gray-900">{info.row.original.name}</span>,
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.phone,
    id: 'phone',
    header: ({
      column
    }) => <DataGridColumnHeader title="Phone no." column={column} />,
    enableSorting: false,
    cell: info => <span className="text-sm text-gray-700">{info.row.original.phone || 'N/A'}</span>,
    meta: {
      className: 'min-w-[150px]'
    }
  }, {
    accessorFn: row => row.is_active,
    id: 'is_active',
    header: ({
      column
    }) => <DataGridColumnHeader title="Active User" column={column} />,
    enableSorting: true,
    cell: info => {
      const isActive = info.row.original.is_active;
      return (
        <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
          {isActive ? 'Active' : 'Deactive'}
        </span>
      );
    },
    meta: {
      className: 'min-w-[120px]'
    }
  }, {
    accessorFn: row => row.created_at,
    id: 'created_at',
    enableSorting: true,
    header: ({
      column
    }) => <DataGridColumnHeader title="Date" column={column} />,
    cell: info => <span className="text-sm text-gray-600">{formatIsoDate(info.row.original.created_at)}</span>,
    meta: {
      className: 'min-w-[120px]'
    }
  }], []);

  const handleDownload = () => {
    toast('Download Started', {
      description: 'Teams data is being downloaded...',
      action: {
        label: 'Ok',
        onClick: () => console.log('Ok')
      }
    });
  };
  
  const Toolbar = () => {
    const [inputValue, setInputValue] = useState('');
    const {
      table
    } = useDataGrid();
    
    const handleKeyDown = e => {
      if (e.key === 'Enter') {
        if (inputValue.trim() === '') {
          table.setGlobalFilter('');
        } else {
          table.setGlobalFilter(inputValue);
        }
      }
    };
    
    const handleChange = event => {
      setInputValue(event.target.value);
    };
    
    return <div className="card-header border-b-0 px-5">
        <h3 className="card-title">Teams</h3>
        <div className="flex items-center gap-2">
          <div className="input input-sm max-w-48">
            <KeenIcon icon="magnifier" />
            <input 
              type="text" 
              placeholder="Search Teams" 
              value={inputValue} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown} 
            />
          </div>
          <Button 
            size="sm" 
            variant="light"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <KeenIcon icon="exit-down" />
            Download
          </Button>
        </div>
      </div>;
  };
  
  return <DataGrid 
    columns={columns} 
    data={defaultData}
    rowSelection={false} 
    getRowId={row => row.id} 
    pagination={{
      size: 5
    }} 
    toolbar={<Toolbar />} 
    layout={{
      card: true
    }} 
  />;
};

export { Teams };