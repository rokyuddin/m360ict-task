"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfo } from "@/lib/form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, Upload } from "lucide-react";
import { useIndexedDBFile } from "@/hooks/use-indexed-db-file";
import Image from "next/image";

interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfo>;
  onSubmit: (data: PersonalInfo) => void;
  onNext: () => void;
}

export function PersonalInfoForm({
  defaultValues,
  onSubmit,
  onNext,
}: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: "onChange",
  });
  const { fileUrl, saveFile } = useIndexedDBFile("profilePicture");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      saveFile(file);
    }
  };

  const handleFormSubmit = (data: PersonalInfo) => {
    onSubmit(data);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="John Doe"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.doe@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="+1-123-456-7890"
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Profile Picture (Optional)</Label>
            <div className="flex items-center gap-4">
              {fileUrl ? (
                <div className="relative">
                  <div className=" relative w-20 h-20 rounded-full object-cover border-2 border-border">
                    <Image
                      src={fileUrl}
                      alt="Profile preview"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG or PNG only, max 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isValid} className="min-w-32">
              Next Step
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
