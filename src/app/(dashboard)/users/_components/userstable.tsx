"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "../page";
import { useRouter } from "next/navigation";
import { RouterPush } from "@/components/RouterPush";
import { useUpdateUserStatus } from "../_calls/queryies";
import { toast } from "sonner";

const UserActionsCell = ({ user }: { user: User }) => {
  const { mutate: toggleStatus, isPending } = useUpdateUserStatus();

  const handleToggle = () => {
    toggleStatus(
      { userId: user._id, isActive: !user.isActive },
      {
        onSuccess: (res: any) => {
          toast.success(res?.data?.message || `User status updated successfully`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update user status");
        }
      }
    );
  };

  return (
    <Button
      variant={user.isActive ? "destructive" : "outline"}
      size="sm"
      className={`h-8 px-3 text-xs font-semibold transition-all ${!user.isActive
          ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 hover:border-emerald-500"
          : ""
        }`}
      disabled={isPending}
      onClick={handleToggle}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : user.isActive ? (
        "Block"
      ) : (
        "Unblock"
      )}
    </Button>
  );
};

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const columns: ColumnDef<User>[] = [
  {
    id: "user", // Searchable ID
    header: "User",
    // This allows the search to look at name AND email combined
    accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email}`,
    cell: ({ row }) => {
      const router = useRouter();
      const user = row.original;
      const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || "U";

      return (
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border border-border cursor-zoom-in">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="text-[10px] bg-muted">{initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" className="p-1 border-border bg-popover">
                <div className="relative h-[100px] w-[100px] overflow-hidden rounded-md">
                  {/* Big Preview Image */}
                  <img
                    src={user.avatar || "/placeholder-user.jpg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div
            className="flex flex-col cursor-pointer hover:underline decoration-primary/30"
            onClick={() => RouterPush(router, `users/${user._id}`)}
          >
            <span className="font-medium text-foreground text-sm leading-none mb-1">
              {user.firstName ? `${user.firstName} ${user.lastName}` : "Unnamed User"}
            </span>
            <span className="text-[10px] text-muted-foreground lowercase">
              {user.email || "No email"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <div className="text-sm text-foreground/80 font-mono">
        {row.getValue("phoneNumber") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "totalBookings",
    header: "Bookings",
    cell: ({ row }) => (
      <div className="flex justify-start px-2">
        <Badge variant="secondary" className="font-bold">
          {row.getValue("totalBookings")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{formatDate(row.getValue("createdAt"))}</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground"
            }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];

export function UsersDataTable({ users }: { users: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: users,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full  overflow-hidden">
      <div className="p-4 bg-muted/20 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-card-foreground">User Management</h2>
          <p className="text-xs text-muted-foreground">Manage registered users and activity</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email..."
              // Target the "user" column we defined in columns
              value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("user")?.setFilterValue(event.target.value)
              }
              className="pl-9 w-full sm:w-[260px] bg-background border-input h-9"
            />
          </div>
          {/* <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-[10px] uppercase font-bold text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/40 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm italic">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination component logic here (same as before) */}
    </div>
  );
}