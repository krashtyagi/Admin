'use client'
import React, { Suspense, useState } from 'react';
import {
  Building2, MapPin, CreditCard, ShieldAlert, ShieldCheck,
  CheckCircle2, Wifi, ImageIcon, Landmark, FileCheck, ExternalLink,
  AlertTriangle, MessageSquare, Loader2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  usePropertyDetails, useApproveProperty, useRejectProperty,
  useMarkIssue, useVerifySection
} from './queryes';
import { WarningDialog } from '@/components/overlay/warnings';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { PageSkeleton } from '@/components/loaders/loader/skeleton';
import { MessageModal } from '@/components/messagemodal';
import { ImagePreview } from '@/components/ui/image-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Step labels mapping
const STEP_LABELS: Record<number, string> = {
  2: "Verification Documents",
  3: "Bank Details",
  4: "Property Details",
};

const PropertyDetail = () => {
  const { propId } = useParams();
  const id = Array.isArray(propId) ? propId[0] : propId || "";
  const { data, isLoading } = usePropertyDetails(id);
  const vendorData = (data as any)?.data;

  if (isLoading || !vendorData) return <PageSkeleton />;

  const { vendor, user, businessDetails, documents, bankDetails, propertyDetails } = vendorData;

  return (
    <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
      <Suspense fallback={<PageSkeleton />}>
        <div className="min-h-screen font-sans">
          <div className="w-full mx-auto space-y-3">

            {/* Header */}
            <header className="rounded-2xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {propertyDetails?.name || businessDetails?.businessName || "Property"}
                  </h1>
                  <StatusBadge status={vendor?.status} />
                  {vendor?.serviceType && (
                    <Badge variant="outline" className="capitalize text-[10px] bg-blue-500/10 text-blue-600 border-blue-200">
                      {vendor.serviceType}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-xs font-medium">
                    {propertyDetails?.address || businessDetails?.address || "N/A"}, {propertyDetails?.city || businessDetails?.city || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-muted/50 border border-border rounded-xl px-4 py-2 text-center">
                <p className="text-[9px] font-bold uppercase text-muted-foreground leading-none">ID</p>
                <p className="font-mono text-base font-bold text-foreground">#{vendor?._id?.slice(-8).toUpperCase()}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-8 space-y-3">

                {/* Step 2: Verification Documents */}
                <StepSection
                  step={2}
                  vendorId={id}
                  vendorStatus={vendor?.status}
                  rejectedSteps={vendor?.rejectedSteps}
                  rejectionReasons={vendor?.rejectionReasons}
                  icon={<FileCheck size={16} className="text-primary" />}
                  title="Verification Documents"
                >
                  {documents && documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {documents.map((doc: any, idx: number) => (
                        <div key={doc.id || doc._id || idx} className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-card rounded-lg border border-border"><CreditCard size={16} /></div>
                            <div>
                              <p className="text-xs font-bold truncate max-w-[140px]">{doc.docName || "Document"}</p>
                              <ImagePreview src={doc.docUrl}>
                                <button className="text-[10px] text-primary hover:underline font-bold text-left cursor-pointer">View File</button>
                              </ImagePreview>
                            </div>
                          </div>
                          {doc.isVerified ? <CheckCircle2 size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-4 text-center">No documents uploaded</p>
                  )}
                  {businessDetails?.panNumber && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">PAN</p>
                        <p className="font-mono text-sm font-bold text-primary">{businessDetails.panNumber}</p>
                      </div>
                      {businessDetails?.aadhaarNumber && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Aadhaar</p>
                          <p className="font-mono text-sm font-medium">{businessDetails.aadhaarNumber}</p>
                        </div>
                      )}
                    </div>
                  )}
                </StepSection>

                {/* Step 3: Bank Details */}
                <StepSection
                  step={3}
                  vendorId={id}
                  vendorStatus={vendor?.status}
                  rejectedSteps={vendor?.rejectedSteps}
                  rejectionReasons={vendor?.rejectionReasons}
                  icon={<Landmark size={16} className="text-primary" />}
                  title="Bank Details"
                >
                  {bankDetails ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <InfoField label="Bank Name" value={bankDetails.bankName} />
                      <InfoField label="Branch" value={bankDetails.branchName} />
                      <InfoField label="Account Holder" value={bankDetails.accountHolderName} />
                      <InfoField label="Account Number" value={bankDetails.accountNumber} mono />
                      <InfoField label="IFSC Code" value={bankDetails.ifscCode} mono />
                      {bankDetails.upiId && <InfoField label="UPI ID" value={bankDetails.upiId} mono />}
                      {bankDetails.verificationStatus && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Verification</p>
                          <StatusBadge status={bankDetails.verificationStatus} />
                        </div>
                      )}
                      {bankDetails.proof?.url && (
                        <div className="col-span-2">
                          <ImagePreview src={bankDetails.proof.url}>
                            <button className="inline-flex items-center gap-2 py-2 px-3 border border-dashed border-border rounded-xl text-[10px] font-bold hover:bg-primary/5 transition-all cursor-pointer">
                              <ExternalLink size={12} /> View Bank Proof
                            </button>
                          </ImagePreview>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-4 text-center">No bank details submitted</p>
                  )}
                </StepSection>

                {/* Step 4: Property / Business Details */}
                <StepSection
                  step={4}
                  vendorId={id}
                  vendorStatus={vendor?.status}
                  rejectedSteps={vendor?.rejectedSteps}
                  rejectionReasons={vendor?.rejectionReasons}
                  icon={<Building2 size={16} className="text-primary" />}
                  title="Property Details"
                >
                  {propertyDetails ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Property Name" value={propertyDetails.name} />
                        <InfoField label="City" value={propertyDetails.city} />
                        <InfoField label="Address" value={propertyDetails.address} />
                        {propertyDetails.rank && <InfoField label="Rank" value={propertyDetails.rank} />}
                        {propertyDetails.location?.coordinates && (
                          <InfoField label="Coordinates" value={`${propertyDetails.location.coordinates[1]}, ${propertyDetails.location.coordinates[0]}`} mono />
                        )}
                        {propertyDetails.verificationStatus && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Verification</p>
                            <StatusBadge status={propertyDetails.verificationStatus} />
                          </div>
                        )}
                      </div>
                      {propertyDetails.description && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Description</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{propertyDetails.description}</p>
                        </div>
                      )}
                      {propertyDetails.images?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                            <ImageIcon size={12} /> Gallery ({propertyDetails.images.length})
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {propertyDetails.images.map((img: any, i: number) => (
                              <ImagePreview key={i} src={img.url || img}>
                                <div className="aspect-square rounded-lg overflow-hidden border border-border cursor-pointer group">
                                  <img src={img.url || img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                              </ImagePreview>
                            ))}
                          </div>
                        </div>
                      )}
                      {propertyDetails.amenities?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Wifi size={12} /> Amenities
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {propertyDetails.amenities.map((a: string) => (
                              <span key={a} className="text-[10px] font-bold bg-muted px-2 py-1 rounded-lg border border-border">{a}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {propertyDetails.features?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Features</p>
                          <div className="flex flex-wrap gap-1.5">
                            {propertyDetails.features.map((f: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold bg-muted px-2 py-1 rounded-lg border border-border">{f}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {propertyDetails.documents?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                            <FileCheck size={12} className="text-primary" /> Property Documents ({propertyDetails.documents.length})
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {propertyDetails.documents.map((doc: any, idx: number) => (
                              <div key={doc.id || doc._id || idx} className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-card rounded-lg border border-border"><CreditCard size={16} /></div>
                                  <div>
                                    <p className="text-xs font-bold truncate max-w-[140px]">{doc.docName || "Document"}</p>
                                    <ImagePreview src={doc.docUrl}>
                                      <button className="text-[10px] text-primary hover:underline font-bold text-left cursor-pointer">View File</button>
                                    </ImagePreview>
                                  </div>
                                </div>
                                {doc.isVerified ? <CheckCircle2 size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-4 text-center">No property details submitted</p>
                  )}
                </StepSection>

                {/* Final Approve / Full Reject */}
                <FinalActionCard vendor={vendor} id={id} />
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-3">
                {/* Owner */}
                <div className="bg-slate-950 rounded-2xl p-5 text-white border border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-sm font-black uppercase">
                        {user?.name?.[0] || 'V'}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Owner</p>
                        <h3 className="text-sm font-bold truncate">{user?.name || "Manager"}</h3>
                      </div>
                    </div>
                    <div className="text-[11px] font-medium space-y-2">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-slate-400">Email</span><span className="truncate ml-2">{user?.email || "N/A"}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-slate-400">Phone</span><span className="ml-2">{user.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service</span>
                        <span className="bg-white/10 px-2 rounded uppercase text-[9px]">{vendor?.serviceType || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Profile */}
                <div className="rounded-2xl p-4 shadow-sm space-y-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-primary" />
                    <h3 className="text-xs font-bold uppercase">Business Profile</h3>
                  </div>
                  <div className="text-[11px] space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-semibold">{businessDetails?.businessName || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium truncate ml-2">{businessDetails?.businessEmail || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{businessDetails?.businessPhone || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{businessDetails?.city || "N/A"}</span></div>
                    {businessDetails?.state && <div className="flex justify-between"><span className="text-muted-foreground">State</span><span className="font-medium">{businessDetails.state}</span></div>}
                    {businessDetails?.country && <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="font-medium">{businessDetails.country}</span></div>}
                  </div>
                </div>

                {/* Rejection Summary */}
                {vendor?.rejectedSteps?.length > 0 && (
                  <div className="rounded-2xl p-4 shadow-sm space-y-3 border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <h3 className="text-xs font-bold uppercase text-red-600">Issues Found</h3>
                    </div>
                    <div className="space-y-2">
                      {vendor.rejectedSteps.map((step: number) => (
                        <div key={step} className="text-xs">
                          <p className="font-bold text-red-600">Step {step}: {STEP_LABELS[step]}</p>
                          <p className="text-red-500/80 mt-0.5">{vendor.rejectionReasons?.[step] || "No reason provided"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

// ─── Step Section with Mark Issue / Verify controls ────────────────────────
function StepSection({
  step, vendorId, vendorStatus, rejectedSteps, rejectionReasons, icon, title, children
}: {
  step: number; vendorId: string; vendorStatus?: string;
  rejectedSteps?: number[]; rejectionReasons?: Record<number, string>;
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  const isApproved = vendorStatus === 'approved';
  const markIssueMutation = useMarkIssue();
  const verifySectionMutation = useVerifySection();
  const [reason, setReason] = useState("");
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const isRejected = rejectedSteps?.includes(step);
  const rejectionReason = rejectionReasons?.[step];

  const handleMarkIssue = async () => {
    if (!reason.trim()) return;
    try {
      await markIssueMutation.mutateAsync({ vendorId, step, reason: reason.trim() });
      toast.success(`Step ${step} marked with issue`);
      setReason("");
      setIssueDialogOpen(false);
    } catch {
      toast.error("Failed to mark issue");
    }
  };

  const handleVerify = async () => {
    try {
      await verifySectionMutation.mutateAsync({ vendorId, step });
      toast.success(`Step ${step} verified`);
    } catch {
      toast.error("Failed to verify section");
    }
  };

  return (
    <section className={`rounded-2xl shadow-sm overflow-hidden border ${isRejected ? 'border-red-500/30' : 'border-border'}`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${isRejected ? 'border-red-500/20 bg-red-500/5' : 'border-border'}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold uppercase tracking-tight">{title}</h2>
          <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Step {step}</span>
        </div>
        <div className="flex items-center gap-2">
          {isApproved ? (
            <Badge variant="outline" className="h-7 text-[10px] gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </Badge>
          ) : isRejected ? (
            <Button size="sm" variant="outline" onClick={handleVerify}
              disabled={verifySectionMutation.isPending}
              className="h-7 text-[10px] gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            >
              {verifySectionMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
              Clear Issue
            </Button>
          ) : (
            <AlertDialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                  <AlertTriangle className="h-3 w-3" /> Mark Issue
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark Issue — {title}</AlertDialogTitle>
                  <AlertDialogDescription>Provide a reason. The vendor will need to re-submit this step.</AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea placeholder="Describe the issue..." value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[80px]" />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setReason("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkIssue} disabled={!reason.trim() || markIssueMutation.isPending} className="bg-red-600 hover:bg-red-700">
                    {markIssueMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Mark Issue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Rejection banner */}
      {isRejected && rejectionReason && (
        <div className="px-4 py-2.5 bg-red-500/5 border-b border-red-500/10 flex items-start gap-2">
          <MessageSquare size={14} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-red-600 uppercase">Issue Reason</p>
            <p className="text-xs text-red-500/80">{rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="p-4">{children}</div>
    </section>
  );
}

// ─── Final Approve / Reject Card ───────────────────────────────────────────
function FinalActionCard({ vendor, id }: { vendor: any; id: string }) {
  const approveMutation = useApproveProperty();
  const rejectMutation = useRejectProperty();
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("Vendor approved successfully");
    } catch { toast.error("Failed to approve"); }
    finally { setActionType(null); }
  };

  const handleReject = async () => {
    try {
      const steps = vendor?.rejectedSteps || [2];
      const reasons = vendor?.rejectionReasons || { 2: "Issues found" };
      await rejectMutation.mutateAsync({ id, rejectedSteps: steps, reasons });
      toast.success("Vendor rejected");
    } catch { toast.error("Failed to reject"); }
    finally { setActionType(null); }
  };

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="rounded-2xl p-4 space-y-4 border border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><ShieldAlert size={18} className="text-amber-600" /></div>
        <h3 className="text-sm font-bold uppercase tracking-tight">Final Review</h3>
      </div>
      {vendor?.status === 'approved' ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-800">Property Approved</p>
            <p className="text-[10px] text-emerald-600">This property listing has been fully approved and is live.</p>
          </div>
        </div>
      ) : (
        <>
          {vendor?.rejectedSteps?.length > 0 && (
            <p className="text-xs text-red-500 font-medium">{vendor.rejectedSteps.length} step(s) have issues. Rejecting will notify the vendor.</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <WarningDialog
              open={actionType === 'reject'} onOpenChange={(o) => !o && setActionType(null)} loading={isMutating}
              title="Reject Vendor?" description="The vendor will be notified and must re-submit flagged steps." func={handleReject}
              trigger={
                <button onClick={() => setActionType('reject')} disabled={isMutating} className="flex items-center gap-2 p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-left transition-all active:scale-95 disabled:opacity-50">
                  <ShieldAlert size={16} className="text-red-600" />
                  <p className="text-[10px] font-black text-red-600 uppercase">Reject</p>
                </button>
              }
            />
            {vendor?.status !== 'approved' && (
              <WarningDialog
                open={actionType === 'approve'} onOpenChange={(o) => !o && setActionType(null)} loading={isMutating}
                title="Approve Vendor?" description="All sections will be verified and listing goes live." func={handleApprove}
                trigger={
                  <button onClick={() => setActionType('approve')} disabled={isMutating} className="flex items-center gap-2 p-3 rounded-xl bg-emerald-600 text-white shadow-md active:scale-95 transition-all text-left disabled:opacity-50">
                    <CheckCircle2 size={16} />
                    <p className="text-[10px] font-black uppercase">Approve</p>
                  </button>
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────
function InfoField({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value || "N/A"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    rejected: 'bg-red-500/10 text-red-600 border-red-200',
    verified: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
    under_review: 'bg-blue-500/10 text-blue-600 border-blue-200',
    draft: 'bg-zinc-500/10 text-zinc-500 border-zinc-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status || ''] || styles.pending}`}>
      {status?.replace(/_/g, ' ') || "pending"}
    </span>
  );
}

export default PropertyDetail;