"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner"; // ✅ use toast and Toaster from sonner
import {
  Camera,
  User as UserIcon,
  Phone,
  Mail,
  Wallet,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  CreditCard,
  Shield,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const supabase = createClient();

const BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "US Bank",
  "Capital One",
  "PNC Bank",
  "TD Bank",
  "Goldman Sachs",
  "HSBC",
  "Other",
];

const profileSchema = z.object({
  display_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  bank_name: z.string().optional(),
  account_holder_name: z
    .string()
    .max(100, "Name is too long")
    .optional()
    .or(z.literal("")),
  account_number: z
    .string()
    .regex(/^[0-9]{4,20}$/, "Account number must be 4-20 digits")
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and a number",
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Profile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: "",
      email: "",
      phone: "",
      bank_name: "",
      account_holder_name: "",
      account_number: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Auth check + load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        setUserId(user.id);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (profile) {
          profileForm.reset({
            display_name: profile.display_name || "",
            email: user.email || "",
            phone: profile.phone || "",
            bank_name: profile.bank_name || "",
            account_holder_name: profile.account_holder_name || "",
            account_number: profile.account_number || "",
          });
          setAvatarUrl(profile.avatar_url || null);
          setDisplayName(
            profile.display_name || user.email?.split("@")[0] || "User",
          );
          setPhone(profile.phone || "");
        } else {
          profileForm.reset({
            display_name: user.email?.split("@")[0] || "",
            email: user.email || "",
            phone: "",
            bank_name: "",
            account_holder_name: "",
            account_number: "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, profileForm]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file.",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl;
      setAvatarUrl(publicUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);

      toast.success("Avatar updated", {
        description: "Your profile picture has been changed.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", {
        description: "Could not upload your avatar. Please try again.",
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: values.display_name,
          phone: values.phone,
          bank_name: values.bank_name || null,
          account_holder_name: values.account_holder_name || null,
          account_number: values.account_number || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      setDisplayName(values.display_name);
      setPhone(values.phone);

      toast.success("Profile saved", {
        description: "Your changes have been saved successfully.",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      });
    } catch (err) {
      console.error(err);
      toast.error("Save failed", {
        description: "Could not save your profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setChangingPassword(true);
    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: profileForm.getValues("email"),
          password: values.current_password,
        });

      if (signInError || !signInData.session) {
        passwordForm.setError("current_password", {
          message: "Current password is incorrect",
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: values.new_password,
      });

      if (updateError) throw updateError;

      toast.success("Password changed", {
        description: "Your password has been updated successfully.",
      });

      passwordForm.reset();
    } catch (err) {
      console.error(err);
      toast.error("Update failed", {
        description: "Could not change your password. Please try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const maskedAccount = profileForm.watch("account_number");
  const maskedDisplay =
    maskedAccount && maskedAccount.length >= 4
      ? `•••• ${maskedAccount.slice(-4)}`
      : "•••• ••••";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-72 w-full rounded-3xl" />
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:pb-10">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 rounded-full text-slate-600 dark:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Pro Member
            </div>
          </div>

          {/* Profile Header Card */}
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-white/30 shadow-lg sm:h-28 sm:w-28">
                    <AvatarImage src={avatarUrl || ""} alt={displayName} />
                    <AvatarFallback className="bg-white/20 text-2xl font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg transition-all hover:scale-110 hover:bg-indigo-50 disabled:opacity-50"
                    aria-label="Change avatar"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {displayName}
                  </h1>
                  <div className="mt-1 flex items-center justify-center gap-2 text-white/80 sm:justify-start">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="text-sm">{phone || "No phone set"}</span>
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Available Balance
                    </span>
                  </div>
                  <div className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
                    USD
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                    $12,450.80
                  </span>
                  <span className="text-xs font-medium text-emerald-300">
                    +2.4%
                  </span>
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {maskedDisplay}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">User Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      {...profileForm.register("display_name")}
                      className="rounded-xl bg-slate-50 dark:bg-slate-950/50"
                    />
                    {profileForm.formState.errors.display_name && (
                      <p className="text-xs text-rose-500">
                        {profileForm.formState.errors.display_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        value={profileForm.watch("email")}
                        className="rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-950/50"
                      />
                      <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      readOnly
                      value={profileForm.watch("phone")}
                      className="rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-950/50"
                    />
                    <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Contact support to update your phone number
                  </p>
                </div>

                <Separator className="my-2" />

                {/* Bank Information */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">
                        Bank Information
                      </h3>
                      <p className="text-sm text-slate-500">
                        For withdrawals and deposits
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Controller
                        name="bank_name"
                        control={profileForm.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-slate-950/50">
                              <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {BANKS.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_holder_name">
                        Account Holder Name
                      </Label>
                      <Input
                        id="account_holder_name"
                        {...profileForm.register("account_holder_name")}
                        placeholder="Full name as on bank account"
                        className="rounded-xl bg-slate-50 dark:bg-slate-950/50"
                      />
                      {profileForm.formState.errors.account_holder_name && (
                        <p className="text-xs text-rose-500">
                          {
                            profileForm.formState.errors.account_holder_name
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
                    <div className="relative">
                      <Input
                        id="account_number"
                        type="text"
                        inputMode="numeric"
                        {...profileForm.register("account_number")}
                        placeholder="Enter your account number"
                        className="rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/50"
                      />
                      <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    {profileForm.formState.errors.account_number && (
                      <p className="text-xs text-rose-500">
                        {profileForm.formState.errors.account_number.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save button - desktop */}
                <div className="hidden sm:block">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-5 font-medium shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mt-6 rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>
                    Keep your account safe with a strong password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? "text" : "password"}
                      {...passwordForm.register("current_password")}
                      placeholder="Enter current password"
                      className="rounded-xl bg-slate-50 pr-10 dark:bg-slate-950/50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.current_password && (
                    <p className="text-xs text-rose-500">
                      {passwordForm.formState.errors.current_password.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("new_password")}
                        placeholder="At least 8 characters"
                        className="rounded-xl bg-slate-50 pr-10 dark:bg-slate-950/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.new_password && (
                      <p className="text-xs text-rose-500">
                        {passwordForm.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirm_password")}
                        placeholder="Re-enter new password"
                        className="rounded-xl bg-slate-50 pr-10 dark:bg-slate-950/50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirm_password && (
                      <p className="text-xs text-rose-500">
                        {passwordForm.formState.errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={changingPassword}
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 py-5 font-medium transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Save Button - Mobile */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-lg sm:hidden dark:border-slate-800 dark:bg-slate-900/90">
          <Button
            type="button"
            onClick={profileForm.handleSubmit(onProfileSubmit)}
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-5 font-medium shadow-lg shadow-indigo-500/30"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
