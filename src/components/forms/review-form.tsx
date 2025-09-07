"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reviewSchema,
  type Review,
  type CompleteFormData,
} from "@/lib/form-schema";
import { mockManagers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  User,
  Briefcase,
  Brain,
  Phone,
  Upload,
} from "lucide-react";
import { useIndexedDBFile } from "@/hooks/use-indexed-db-file";
import Image from "next/image";

interface ReviewFormProps {
  formData: Partial<CompleteFormData>;
  onSubmit: (data: Review) => void;
  onBack: () => void;
  onFinalSubmit: () => void;
}

export function ReviewForm({
  formData,
  onSubmit,
  onBack,
  onFinalSubmit,
}: ReviewFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    mode: "onChange",
  });

  const { fileUrl } = useIndexedDBFile("profilePicture");

  const handleFormSubmit = (data: Review) => {
    onSubmit(data);
    onFinalSubmit();
  };

  const getManagerName = (managerId?: string) => {
    return mockManagers.find((m) => m.id === managerId)?.name || managerId;
  };

  const formatSalary = (amount?: number, jobType?: string) => {
    if (!amount) return "N/A";
    return jobType === "Contract"
      ? `$${amount}/hour`
      : `$${amount.toLocaleString()}/year`;
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.personalInfo?.dateOfBirth);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review & Submit
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review all information before submitting your application.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Full Name:</span>{" "}
                  {formData.personalInfo?.fullName}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.personalInfo?.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {formData.personalInfo?.phoneNumber}
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {formData.personalInfo?.dateOfBirth}
                  {age && (
                    <span className="text-sm text-gray-600"> (Age: {age})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Job Details</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Department:</span>{" "}
                  {formData.jobDetails?.department}
                </div>
                <div>
                  <span className="font-medium">Position:</span>{" "}
                  {formData.jobDetails?.positionTitle}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span>{" "}
                  {formData.jobDetails?.startDate}
                </div>
                <div>
                  <span className="font-medium">Job Type:</span>{" "}
                  {formData.jobDetails?.jobType}
                </div>
                <div>
                  <span className="font-medium">Salary:</span>{" "}
                  {formatSalary(
                    formData.jobDetails?.salaryExpectation,
                    formData.jobDetails?.jobType
                  )}
                </div>
                <div>
                  <span className="font-medium">Manager:</span>{" "}
                  {getManagerName(formData.jobDetails?.managerId)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills & Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Skills & Preferences</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <span className="font-medium">Primary Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills?.primarySkills?.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill} ({formData.skills?.skillExperience?.[skill] || 0}{" "}
                      years)
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Working Hours:</span>{" "}
                  {formData.skills?.workingHoursStart} -{" "}
                  {formData.skills?.workingHoursEnd}
                </div>
                <div>
                  <span className="font-medium">Remote Preference:</span>{" "}
                  {formData.skills?.remoteWorkPreference}%
                </div>
              </div>
              {formData.skills?.remoteWorkPreference &&
                formData.skills.remoteWorkPreference > 50 && (
                  <div>
                    <span className="font-medium">Manager Approved:</span>{" "}
                    {formData.skills?.managerApproved ? "Yes" : "No"}
                  </div>
                )}
              {formData.skills?.extraNotes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 text-gray-700">
                    {formData.skills.extraNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Contact Name:</span>{" "}
                  {formData.emergencyContact?.contactName}
                </div>
                <div>
                  <span className="font-medium">Relationship:</span>{" "}
                  {formData.emergencyContact?.relationship}
                </div>
                <div>
                  <span className="font-medium">Phone Number:</span>{" "}
                  {formData.emergencyContact?.phoneNumber}
                </div>
              </div>
              {age && age < 21 && (
                <div className="pt-2 border-t border-gray-200 mt-4">
                  <h4 className="font-medium mb-2">Guardian Contact:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Guardian Name:</span>{" "}
                      {formData.emergencyContact?.guardianName}
                    </div>
                    <div>
                      <span className="font-medium">Guardian Phone:</span>{" "}
                      {formData.emergencyContact?.guardianPhone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Controller
                  name="confirmationChecked"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="confirmation"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="confirmation"
                    className="text-sm font-medium cursor-pointer"
                  >
                    I confirm that all information provided above is accurate
                    and complete
                  </Label>
                  <p className="text-xs text-gray-600">
                    By checking this box, you agree to submit this employee
                    onboarding form.
                  </p>
                </div>
              </div>
              {errors.confirmationChecked && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.confirmationChecked.message}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Previous
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                className="min-w-32 bg-green-600 hover:bg-green-700"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
