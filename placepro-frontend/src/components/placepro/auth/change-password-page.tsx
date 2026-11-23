"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/placepro/api";
import { useAppStore } from "@/lib/placepro/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ChangePasswordPage() {
  const router = useRouter();
  const user = useAppStore(s => s.user);
  const required = !!user?.mustChangePassword;
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <main className="grid min-h-screen place-items-center bg-background p-4">
    <Card className="w-full max-w-md p-6">
      <h1 className="text-xl font-semibold">{required ? "Change your temporary password" : "Change password"}</h1>
      <p className="text-sm text-muted-foreground">{required ? "Set a new password before using PlacePro. " : ""}Use at least 12 characters including letters and numbers.</p>
      <form className="space-y-4" onSubmit={async event => {
        event.preventDefault(); setError("");
        if (password !== confirm) { setError("New passwords do not match."); return; }
        if (password === current) { setError("Choose a different password."); return; }
        setBusy(true);
        try {
          const { user } = await api.changePassword(current, password);
          setCurrent(""); setPassword(""); setConfirm("");
          useAppStore.setState({ user });
          toast({ title: "Password changed", description: "Your password has been updated." });
          router.replace(`/${user.role}/dashboard`);
          if (required) void useAppStore.getState().refreshData();
        } catch (err) { setError(err instanceof Error ? err.message : "Unable to change password."); }
        finally { setBusy(false); }
      }}>
        <fieldset disabled={busy} className="space-y-4">
          <div className="space-y-1"><Label htmlFor="initial-password">Current password</Label><Input id="initial-password" type="password" autoComplete="current-password" required value={current} onChange={e => setCurrent(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" type="submit">{busy ? "Saving..." : "Change password and continue"}</Button>
          {required ? <Button type="button" variant="outline" className="w-full" onClick={() => void useAppStore.getState().logout()}>Sign out</Button> : <Button type="button" variant="outline" className="w-full" onClick={() => router.push(`/${user?.role}/dashboard`)}>Cancel</Button>}
        </fieldset>
      </form>
    </Card>
  </main>;
}
