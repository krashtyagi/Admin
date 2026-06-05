'use client'

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Search, MapPin, Building2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "../page";
import { RouterPush } from "@/components/RouterPush";
import { useRouter } from "next/navigation";

// Helper for date
const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// --- Column Definitions ---
export const columns: ColumnDef<Property>[] = [
  {
    id: "property",
    header: "Property Name",
    accessorFn: (row) => `${row.propertyName} ${row.city}`,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
          onClick={() => RouterPush(router, `/properties/${row.original._id}`)}
        >
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none mb-1 text-foreground">
              {row.original.propertyName}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {row.original.city}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(row.getValue("submittedAt"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize text-[10px] font-bold ${status === "approved"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-orange-500/10 text-orange-600 border-orange-500/20"
            }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      const rank = row.getValue("rank") as string;
      const canAssign = row.original.canAssignRank;
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black h-7 w-7 flex items-center justify-center p-0 rounded-md">
            {rank}
          </Badge>
          {!canAssign && (
            <span className="text-[9px] text-muted-foreground font-medium italic">Fixed</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="text-right block pr-2">Manage</span>,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="text-right pr-2">
          <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold" onClick={() => {
            RouterPush(router, `/properties/${row.original._id}`)
          }}>
            View Details
          </Button>
        </div>
      )
    },
  },
];

export function PropertiesDataTable({ properties }: { properties: Property[] }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: properties,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { columnFilters, pagination },
  });

  const total = properties.length;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const startIdx = total === 0 ? 0 : pageIndex * pageSize + 1;
  const endIdx = Math.min((pageIndex + 1) * pageSize, total);
  const totalPages = table.getPageCount() || 1;

  return (
    <div className="w-full rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="p-5 border-b border-gray-200/80 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-50">Property Directory</h2>
          <p className="text-xs text-muted-foreground font-medium">Manage and rank your registered property listings</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search property or city..."
              value={(table.getColumn("property")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("property")?.setFilterValue(e.target.value)}
              className="pl-10 w-full bg-background h-10 rounded-lg border-gray-200 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium whitespace-nowrap">
              Rows:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                const newSize = Number(val);
                table.setPageSize(newSize);
                setPagination(prev => ({ ...prev, pageSize: newSize, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[70px] h-10 border-gray-200 dark:border-zinc-800 dark:bg-zinc-950">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-950 dark:border-zinc-800">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-zinc-900/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200/80 dark:border-zinc-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 text-[10px] uppercase font-bold tracking-wider text-gray-750 dark:text-zinc-400 px-6">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 border-b border-gray-200/80 dark:border-zinc-800 group transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground italic">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-200/80 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50 dark:bg-zinc-900/30">
        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
          Showing <span className="font-semibold text-gray-900 dark:text-zinc-100">{startIdx}</span> to{" "}
          <span className="font-semibold text-gray-900 dark:text-zinc-100">{endIdx}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-zinc-100">{total}</span> properties
        </p>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 border-gray-200 dark:border-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <Button
                key={pageNum}
                variant={pageIndex + 1 === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(idx)}
                className="h-8 min-w-[32px] px-2"
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 border-gray-200 dark:border-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}