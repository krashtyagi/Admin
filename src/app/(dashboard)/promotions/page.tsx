"use client";

import { axiosApi } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
    Search, Calendar, Mail, Phone, Building, RefreshCw, CheckCircle,
    Clock, Shield, Sparkles, Crown, Award, Loader2, Tag,
} from "lucide-react";

const planConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    Boost: { label: "Boost (10%)", icon: Award, color: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
    Premium: { label: "Premium (15%)", icon: Sparkles, color: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    Elite: { label: "Elite (20%)", icon: Crown, color: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
};

const statusConfig: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
    rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300",
};

const rankLabels: Record<string, string> = { A: "Rank A — Top Priority", B: "Rank B — High", C: "Rank C — Standard" };

function PromotionsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [approveTarget, setApproveTarget] = React.useState<any>(null);
    const [selectedRank, setSelectedRank] = React.useState<string>("");

    React.useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["admin-promotions"],
        queryFn: async () => {
            const res = await axiosApi.get("/admin/promotions");
            return res.data;
        },
        staleTime: 1000 * 60 * 3,
    });

    const approveMutation = useMutation({
        mutationFn: async ({ id, rank }: { id: string; rank: string }) => {
            const res = await axiosApi.patch(`/admin/promotions/${id}/approve`, { rank });
            return res.data;
        },
        onSuccess: (d) => {
            toast.success(d?.message || "Promotion approved successfully.");
            queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to approve promotion.");
        },
    });

    const allRequests: any[] = data?.data || [];

    const filtered = allRequests.filter((r) => {
        const matchesSearch = !debouncedSearch ||
            r.vendorName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.vendorEmail?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: allRequests.length,
        pending: allRequests.filter((r) => r.status === "pending").length,
        approved: allRequests.filter((r) => r.status === "approved").length,
    };

    const formatDate = (iso: string) => {
        if (!iso) return "N/A";
        return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <TooltipProvider>
            <div className="p-1 sm:p-3 md:p-2 w-full  space-y-3 md:space-y-2 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50">
                            Promotion Requests
                        </h2>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400 hidden sm:block">
                            Review and approve vendor promotion plan requests. Assign listing ranks upon approval.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || isRefetching} className="self-start md:self-auto gap-2 text-xs font-semibold">
                        <RefreshCw className={`h-3.5 w-3.5 ${(isLoading || isRefetching) ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                <div className="grid gap-3 md:gap-6 grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Total Requests</p>
                                <h3 className="mt-1 md:mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50">{isLoading ? "..." : stats.total}</h3>
                            </div>
                            <div className="p-2 md:p-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-xl"><Tag className="h-4 w-4 md:h-5 md:w-5" /></div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Pending Approval</p>
                                <h3 className="mt-1 md:mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">{isLoading ? "..." : stats.pending}</h3>
                            </div>
                            <div className="p-2 md:p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl"><Clock className="h-4 w-4 md:h-5 md:w-5" /></div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Approved</p>
                                <h3 className="mt-1 md:mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{isLoading ? "..." : stats.approved}</h3>
                            </div>
                            <div className="p-2 md:p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl"><CheckCircle className="h-4 w-4 md:h-5 md:w-5" /></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                    <div className="p-3 md:p-5 border-b border-gray-200/80 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4 bg-gray-50/50 dark:bg-zinc-900/30">
                        <div className="relative flex-1 sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                            <Input placeholder="Search by vendor, company, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 w-full rounded-lg border-gray-200 dark:border-zinc-800 dark:bg-zinc-950" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] h-10 border-gray-200 dark:border-zinc-800 dark:bg-zinc-950">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-zinc-950 dark:border-zinc-800">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="p-12 flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                                <p className="text-sm text-zinc-400">Loading promotion requests...</p>
                            </div>
                        ) : filtered.length > 0 ? (
                            <>
                                <div className="block md:hidden space-y-4 p-4">
                                    {filtered.map((req: any) => {
                                        const plan = planConfig[req.plan] || planConfig.Boost;
                                        const PlanIcon = plan.icon;
                                        return (
                                            <div key={req.id} className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{req.vendorName}</p>
                                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">{req.companyName}</p>
                                                    </div>
                                                    <Badge variant="secondary" className={`border-none font-semibold rounded-full capitalize px-2.5 py-0.5 text-[10px] ${statusConfig[req.status] || ""}`}>{req.status}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="outline" className={`text-[10px] font-semibold gap-1 ${plan.color}`}><PlanIcon className="h-3 w-3" />{plan.label}</Badge>
                                                    {req.rankAssigned && <Badge variant="outline" className="text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">Rank {req.rankAssigned}</Badge>}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-zinc-400 space-y-1">
                                                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{req.vendorEmail}</div>
                                                    {req.phoneNumber && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{req.phoneNumber}</div>}
                                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(req.createdAt)}</div>
                                                </div>
                                                {req.status === "pending" && (
                                                    <Button size="sm" className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setApproveTarget(req); setSelectedRank(""); }}>
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />Approve & Assign Rank
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-gray-200/80 dark:border-zinc-800 hover:bg-transparent bg-gray-50/50 dark:bg-zinc-900/10">
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4 pl-6">Vendor</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Contact</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Plan</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Service</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Status</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Rank</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4">Requested</TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-zinc-300 py-4 pr-6 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((req: any) => {
                                                const plan = planConfig[req.plan] || planConfig.Boost;
                                                const PlanIcon = plan.icon;
                                                return (
                                                    <TableRow key={req.id} className="border-b border-gray-200/80 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                                        <TableCell className="py-4 pl-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                                                    <Building className="h-4 w-4 text-zinc-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900 dark:text-zinc-100 text-sm">{req.vendorName}</p>
                                                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">{req.companyName}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col gap-0.5 text-sm text-gray-600 dark:text-zinc-300">
                                                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" />{req.vendorEmail}</span>
                                                                {req.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" />{req.phoneNumber}</span>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="outline" className={`text-[10px] font-semibold gap-1 ${plan.color}`}><PlanIcon className="h-3 w-3" />{plan.label}</Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-xs text-gray-600 dark:text-zinc-300 capitalize font-medium">{req.serviceType}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="secondary" className={`border-none font-semibold rounded-full capitalize px-2.5 py-0.5 text-[10px] ${statusConfig[req.status] || ""}`}>{req.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            {req.rankAssigned ? (
                                                                <Badge variant="outline" className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                                                    <Shield className="h-3 w-3 mr-1" />Rank {req.rankAssigned}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 dark:text-zinc-500 italic">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-sm font-medium text-gray-800 dark:text-zinc-300">{formatDate(req.createdAt)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 pr-6 text-right">
                                                            {req.status === "pending" ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg" onClick={() => { setApproveTarget(req); setSelectedRank(""); }}>
                                                                            <CheckCircle className="h-3.5 w-3.5" />Approve
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Approve and assign a rank to this promotion</TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Processed</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="inline-flex p-4 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 mb-4 ring-8 ring-gray-50/50 dark:ring-zinc-900/30">
                                    <Tag className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-200">No promotion requests found</h3>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                                    {debouncedSearch ? `No requests matched "${debouncedSearch}".` : "There are no promotion requests at this time."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <AlertDialog open={!!approveTarget} onOpenChange={(open) => { if (!open) setApproveTarget(null); }}>
                    <AlertDialogContent className="dark:bg-zinc-950 dark:border-zinc-800">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                <CheckCircle className="h-6 w-6" />
                                <AlertDialogTitle className="text-xl font-bold">Approve Promotion</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm">
                                Approve the <span className="font-semibold text-gray-900 dark:text-zinc-100">{approveTarget?.plan}</span> promotion request for{" "}
                                <span className="font-semibold text-gray-900 dark:text-zinc-100">{approveTarget?.vendorName}</span>{" "}
                                ({approveTarget?.companyName}). Select a ranking tier to assign to this listing.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-4 space-y-3">
                            <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Select Rank</p>
                            <div className="grid grid-cols-3 gap-3">
                                {(["A", "B", "C"] as const).map((rank) => (
                                    <button key={rank} onClick={() => setSelectedRank(rank)} className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${selectedRank === rank ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"}`}>
                                        <p className="text-lg font-extrabold text-gray-900 dark:text-zinc-100">{rank}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">{rank === "A" ? "Top Priority" : rank === "B" ? "High" : "Standard"}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <AlertDialogFooter className="mt-2 gap-2">
                            <AlertDialogCancel className="border-gray-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={!selectedRank || approveMutation.isPending}
                                onClick={() => {
                                    if (approveTarget && selectedRank) {
                                        approveMutation.mutate({ id: approveTarget.id, rank: selectedRank });
                                        setApproveTarget(null);
                                    }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm disabled:opacity-50"
                            >
                                {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
                                Confirm Approval
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}

export default PromotionsPage;