"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Calculator,
  Percent,
  Clock,
  Loader2,
} from "lucide-react";
import {
  useActiveTax,
  useVerifyTaxPassword,
  useSetTaxWithPassword,
} from "../_calls/queryes";

export default function TaxSettings({
  isTaxUnlocked,
  setIsTaxUnlocked,
}: {
  isTaxUnlocked: boolean;
  setIsTaxUnlocked: (val: boolean) => void;
}) {
  const { data: initialTaxData, isLoading: isInitialTaxLoading } = useActiveTax();
  const verifyTaxMutation = useVerifyTaxPassword();
  const setTaxMutation = useSetTaxWithPassword();

  const [taxUnlockPassword, setTaxUnlockPassword] = useState("");
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);

  const [currentTaxRate, setCurrentTaxRate] = useState<number>(12);
  const [pendingTaxRate, setPendingTaxRate] = useState<number>(12);
  const [taxConfirmPassword, setTaxConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [simulatorAmount, setSimulatorAmount] = useState<number>(10000);

  // Sync initial tax rate when fetched
  React.useEffect(() => {
    if (initialTaxData?.data?.data?.taxPercentage !== undefined) {
      const rate = initialTaxData.data.data.taxPercentage;
      setCurrentTaxRate(rate);
      setPendingTaxRate(rate);
    }
  }, [initialTaxData]);

  const handleUnlockTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxUnlockPassword.trim()) {
      toast.error("Please enter your admin password");
      return;
    }

    try {
      const res = await verifyTaxMutation.mutateAsync(taxUnlockPassword);
      const taxRate =
        res.data?.data?.taxPercentage ?? res.data?.taxPercentage ?? 12;
      setCurrentTaxRate(taxRate);
      setPendingTaxRate(taxRate);
      setIsTaxUnlocked(true);
      setTaxUnlockPassword("");
      toast.success("Tax Vault Unlocked: Access granted for this session");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Incorrect admin password. Access denied."
      );
    }
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingTaxRate < 0 || pendingTaxRate > 100) {
      toast.error("Tax rate percentage must be between 0 and 100");
      return;
    }
    if (!taxConfirmPassword.trim()) {
      toast.error(
        "Admin password is required to authorize changing the tax rate"
      );
      return;
    }

    try {
      await setTaxMutation.mutateAsync({
        taxPercentage: Number(pendingTaxRate),
        password: taxConfirmPassword,
      });
      setCurrentTaxRate(pendingTaxRate);
      setTaxConfirmPassword("");
      toast.success(
        `Tax rate updated to ${pendingTaxRate}% successfully across all bookings`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update tax. Please check your password."
      );
    }
  };

  const simulatedTaxAmount = (simulatorAmount * pendingTaxRate) / 100;
  const simulatedVendorPayout = simulatorAmount - simulatedTaxAmount;

  return (
    <div className="space-y-6 w-full">
      {!isTaxUnlocked ? (
        /* --- LOCKED VAULT VIEW --- */
        <Card className="border border-amber-500/30 bg-gradient-to-br from-card via-card/95 to-amber-950/10 shadow-lg relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Lock className="w-64 h-64 text-amber-500" />
          </div>

          <CardHeader className="space-y-2 border-b border-border/50 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  Protected Platform Tax Commission Vault
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold"
                  >
                    🔒 Confidential
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  Global tax rate directly controls platform fee deduction and vendor revenue payouts.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 pb-6 space-y-6 w-full">
            <div className="rounded-xl bg-muted/50 border border-border/60 p-4 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Tax Rate
                </span>
                <Badge variant="secondary" className="font-mono text-xs">
                  Rate Encrypted
                </Badge>
              </div>
              <div className="flex items-center gap-3 font-mono text-3xl font-extrabold tracking-widest text-muted-foreground select-none">
                <span>•••• %</span>
                <span className="text-xs font-sans text-muted-foreground/80 font-normal">
                  (Hidden for security)
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                To prevent unauthorized inspection or tampering, please enter your admin password below to reveal and edit the tax configuration.
              </p>
            </div>

            <form onSubmit={handleUnlockTax} className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <label
                  htmlFor="unlockPassword"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4 text-amber-500" /> Admin Master Password
                </label>
                <div className="relative w-full">
                  <Input
                    id="unlockPassword"
                    type={showUnlockPassword ? "text" : "password"}
                    placeholder="Enter your administrator password"
                    value={taxUnlockPassword}
                    onChange={(e) => setTaxUnlockPassword(e.target.value)}
                    className="pr-10 h-11 bg-background"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showUnlockPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={verifyTaxMutation.isPending || !taxUnlockPassword}
                className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium shadow-md shadow-amber-500/20"
              >
                {verifyTaxMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying Clearance...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock & View Tax Rate
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/30 border-t border-border/40 py-3 px-6 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            All password attempts and tax modifications are cryptographically audited with timestamp and IP.
          </CardFooter>
        </Card>
      ) : (
        /* --- UNLOCKED VAULT VIEW --- */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
          {/* Main Control Card */}
          <Card className="xl:col-span-2 border border-emerald-500/30 bg-card shadow-sm w-full">
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      Active Tax Commission Rate
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Commission percentage retained by Trivllo on all vendor booking checkouts.
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs">
                  Session Unlocked
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6 w-full">
              {/* Current Active Rate Stat Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between flex-wrap gap-4 w-full">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Currently Applied Platform Commission
                  </div>
                  <div className="text-3xl font-black text-foreground mt-0.5">
                    {currentTaxRate}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <div>Status: Enforced Globally</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Active across all categories
                  </div>
                </div>
              </div>

              {/* Adjust Tax Rate Form */}
              <form onSubmit={handleSaveTax} className="space-y-6 w-full">
                <div className="space-y-3 w-full">
                  <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                    <span>New Tax Rate Percentage</span>
                    <span className="font-mono text-base font-bold text-primary">
                      {pendingTaxRate}%
                    </span>
                  </label>

                  <div className="flex items-center gap-4 w-full">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={pendingTaxRate}
                      onChange={(e) => setPendingTaxRate(Number(e.target.value))}
                      className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                    />
                    <div className="relative w-28 shrink-0">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={pendingTaxRate}
                        onChange={(e) => setPendingTaxRate(Number(e.target.value))}
                        className="pr-7 text-center font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs pointer-events-none">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password confirmation */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-primary" /> Confirm Admin Password to Authorize Rate Change
                  </label>
                  <div className="relative w-full">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter administrator password to save"
                      value={taxConfirmPassword}
                      onChange={(e) => setTaxConfirmPassword(e.target.value)}
                      className="pr-10 h-11 bg-background"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Modifying platform tax rates immediately alters settlement calculations for all future bookings.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTaxUnlocked(false)}
                    className="text-xs h-10"
                  >
                    Lock Vault Again
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      setTaxMutation.isPending ||
                      !taxConfirmPassword ||
                      pendingTaxRate === currentTaxRate
                    }
                    className="px-6 h-10 font-semibold"
                  >
                    {setTaxMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Rate...
                      </>
                    ) : (
                      "Apply New Platform Tax Rate"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Calculator Simulator Card */}
          <Card className="xl:col-span-1 border border-border bg-card shadow-sm h-fit w-full">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" /> Live Payout Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time projection of commission deduction at {pendingTaxRate}%.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Test Booking Value (₹)
                </label>
                <Input
                  type="number"
                  min="100"
                  step="500"
                  value={simulatorAmount}
                  onChange={(e) => setSimulatorAmount(Number(e.target.value))}
                  className="font-bold text-base"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-border/50 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Customer Pays:</span>
                  <span className="font-semibold text-foreground">
                    ₹{simulatorAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                  <span className="text-xs flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Trivllo Commission ({pendingTaxRate}%):
                  </span>
                  <span className="font-bold">
                    -₹{simulatedTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 font-bold text-foreground">
                  <span className="text-xs">Net Vendor Payout:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">
                    ₹{simulatedVendorPayout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">
                  Settlement Pipeline
                </span>
                Net amounts are automatically disbursed to the vendor bank account upon booking completion.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

