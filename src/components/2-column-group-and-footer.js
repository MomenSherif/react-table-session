import React from 'react';
import { useTable } from 'react-table';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import data from '../data.json';

const columns = [
  {
    Header: 'ID',
    Footer: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Name',
    Footer: 'Name',
    columns: [
      {
        Header: 'First Name',
        Footer: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        Footer: 'Last Name',
        accessor: 'lastName',
      },
    ],
  },
  {
    Header: 'Info',
    Footer: 'Info',
    columns: [
      {
        Header: 'Age',
        Footer: ({ rows }) => {
          const averageAge =
            rows.reduce((acc, curr) => acc + curr.values.age, 0) / rows.length;
          return <>Average age: {averageAge.toFixed(2)}</>;
        },
        accessor: 'age',
        Cell: ({ value }) => (
          <span style={{ color: value > 50 ? 'crimson' : 'blue' }}>
            {value}
          </span>
        ),
      },
      {
        Header: 'City',
        Footer: 'City',
        accessor: 'city',
      },
      {
        Header: 'Direction',
        Footer: 'Direction',
        accessor: 'direction',
      },
    ],
  },
];

export default function ColumnGroupTable() {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: data.slice(0, 20),
  });

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
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
      <TableFooter>
        {footerGroups.map((group) => (
          <TableRow {...group.getFooterGroupProps()}>
            {group.headers.map((column) => (
              <TableCell {...column.getFooterProps()}>
                {column.render('Footer')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableFooter>
    </Table>
  );
}
