import { FC, useState } from 'react'
import { Flight, Glider } from '../lib/types'
import { Table } from 'react-bootstrap'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table'

const gliderDisplayName = (glider: Glider) =>
  `${glider.manufacturer} - ${glider.model}`

const columnHelper = createColumnHelper<Flight>()

const columns = [
  columnHelper.accessor('dateOfFlight', {
    header: () => 'Date',
    cell: (info) => info.getValue().toDateString(),
    sortDescFirst: true
  }),
  columnHelper.accessor((row) => row.glider, {
    id: 'glider',
    header: () => 'Glider',
    cell: (info) => {
      const val = info.getValue()
      return val ? `${val.manufacturer} - ${val.model}` : ''
    },
    sortingFn: (rowA, rowB, _columnId) => {
      const A = rowA.original.glider
        ? gliderDisplayName(rowA.original.glider)
        : ''
      const B = rowB.original.glider
        ? gliderDisplayName(rowB.original.glider)
        : ''
      if (A === B) {
        return 0
      } else if (A < B) {
        return -1
      } else {
        return 1
      }
    }
  }),
  columnHelper.accessor('comments', {
    header: () => 'Comments',
    cell: (info) => info.getValue(),
    enableSorting: false
  })
]

const FlightsTable: FC<{ flights: Flight[] }> = ({ flights }) => {
  const [data, _setData] = useState(() => [...flights])
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dateOfFlight', desc: true }
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  return (
    <Table striped bordered hover>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽'
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default FlightsTable
