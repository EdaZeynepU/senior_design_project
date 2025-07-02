import React, { useState, useEffect } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';

const columnHelper = createColumnHelper();



// eslint-disable-next-line react/prop-types
function Table({ tableData }) {
    const [data, setData] = useState(() => [...tableData]);
    const jarNameDict = { "1hours": "1 Hours Jar", "3hours": "3 Hours Jars", "8hours": "8 Hours Jars", "24hours": "24 Hours Jars", "done": "Tamamlandı"};

    const columns = [
        {
            accessorKey: "front",
            header: "Ön Sayfa",
        },
        {
            accessorKey: "back",
            header: "Arka Sayfa"
        },
        {
            accessorKey: "stage",
            header: "Aşaması",
            cell: (e) => jarNameDict[e.cell.row.original.stage]
        },
        columnHelper.accessor('delete', {
            header: 'Sil',
            cell: (e) => <button onClick={() => { deleteNote(e.cell.row.original) }} className='btn btn-danger p-1 rounded-3'><img src="../../images/delete.png" width="20px" alt="" /></button>
        }),
    ];

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    function deleteNote(selectedNote) {
        const userId= localStorage.getItem('userId');
        axios.delete("http://localhost:3001/api/flashcards", {
            data: {
              user_id: userId,
              jar:selectedNote.stage,
              data: { [selectedNote.front]: selectedNote.back }
            }
          })
          .then(() => {
            console.log(`${selectedNote} başarıyla silindi.`);
          })
          .catch((error) => {
            console.error(`${selectedNote} silinemedi:`, error);
          });
        const localDb = JSON.parse(localStorage.getItem(selectedNote.stage));
        delete localDb[selectedNote.front];
        localStorage.setItem(selectedNote.stage, JSON.stringify(localDb));
        const newData = data.filter((val) => val != selectedNote);
        setData(newData)
    }

    return (
        <div className="p-2">
            <table className='table '>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="d-flex align-items-center justify-content-between">
                <div className="d-inline-flex gap-2">
                    <button
                        className="border rounded px-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded px-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded px-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded px-1"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button></div>

                <div>

                    <span className="d-flex  align-items-center gap-1">
                        <span></span>
                        <strong>
                            {table.getPageCount()} Sayfanın{' '}
                            {table.getState().pagination.pageIndex + 1} sayfası
                        </strong>
                    </span>
                </div>
                <div className='d-flex gap-2 align-items-center'>
                    <select
                        className='form-select '
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[3, 5, 7].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize} Satır
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Table
