import React, { useEffect, useRef, forwardRef } from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useFilters,
} from 'react-table';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import data from '../data.json';

const columns = [
  {
    id: 'selection',
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    Cell: ({ row }) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: `3px solid ${
            row.isSelected ? '#4caf50' : 'transparent'
          }`,
          padding: 16,
          margin: -16,
        }}
      >
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      </div>
    ),
  },
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
  {
    Header: 'City',
    accessor: 'city',
  },
  {
    Header: 'Direction',
    accessor: 'direction',
    disableSortBy: true,
  },
];

export default function FilteringTable() {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5,
        selectedRowIds: true,
      },
      defaultColumn,
      // manualFilters: true,
      // getRowId: (row) => row.id,
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2,
          )}
        </code>
      </pre>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  <div
                    {...column.getSortByToggleProps({
                      style: { marginBottom: 10 },
                    })}
                  >
                    {column.render('Header')}
                    <span style={{ position: 'absolute', marginLeft: 20 }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={previousPage} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={nextPage} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              'selectedFlatRows[].original': selectedFlatRows.map(
                (d) => d.original,
              ),
            },
            null,
            2,
          )}
        </code>
      </pre>
    </>
  );
}

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

function DefaultColumnFilter({
  column: { filterValue, setFilter },
  column,
  ...props
}) {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ...`}
    />
  );
}
