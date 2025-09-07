"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobDetailsSchema, type JobDetails } from "@/lib/form-schema";
import { mockManagers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, DollarSign, Calendar, Users } from "lucide-react";

interface JobDetailsFormProps {
  defaultValues?: Partial<JobDetails>;
  onSubmit: (data: JobDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export function JobDetailsForm({
  defaultValues,
  onSubmit,
  onNext,
  onBack,
}: JobDetailsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<JobDetails>({
    resolver: zodResolver(jobDetailsSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchedDepartment = watch("department");
  const watchedJobType = watch("jobType");

  const filteredManagers = mockManagers.filter(
    (manager) => manager.department === watchedDepartment
  );

  const handleFormSubmit = (data: JobDetails) => {
    onSubmit(data);
    onNext();
  };

  const getSalaryPlaceholder = () => {
    switch (watchedJobType) {
      case "Full-time":
        return "Annual salary ($30,000 - $200,000)";
      case "Contract":
        return "Hourly rate ($50 - $150)";
      case "Part-time":
        return "Annual salary ($30,000 - $200,000)";
      default:
        return "Salary expectation";
    }
  };

  const getSalaryLabel = () => {
    return watchedJobType === "Contract" ? "Hourly Rate *" : "Annual Salary *";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={errors.department ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionTitle">Position Title *</Label>
              <Input
                id="positionTitle"
                {...register("positionTitle")}
                placeholder="Software Engineer"
                className={errors.positionTitle ? "border-red-500" : ""}
              />
              {errors.positionTitle && (
                <p className="text-sm text-red-500">
                  {errors.positionTitle.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                min={new Date().toISOString().split("T")[0]}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {getSalaryLabel()}
              </Label>
              <Input
                type="number"
                {...register("salaryExpectation", { valueAsNumber: true })}
                placeholder={getSalaryPlaceholder()}
                className={errors.salaryExpectation ? "border-red-500" : ""}
              />
              {errors.salaryExpectation && (
                <p className="text-sm text-red-500">
                  {errors.salaryExpectation.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Job Type *</Label>
            <Controller
              name="jobType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Full-time" id="fulltime" />
                    <Label htmlFor="fulltime">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Part-time" id="parttime" />
                    <Label htmlFor="parttime">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contract" id="contract" />
                    <Label htmlFor="contract">Contract</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.jobType && (
              <p className="text-sm text-red-500">{errors.jobType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manager *
            </Label>
            <Controller
              name="managerId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!watchedDepartment}
                >
                  <SelectTrigger
                    className={errors.managerId ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={
                        watchedDepartment
                          ? "Select manager"
                          : "Select department first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.managerId && (
              <p className="text-sm text-red-500">{errors.managerId.message}</p>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Previous
            </Button>
            <Button type="submit" disabled={!isValid} className="min-w-32">
              Next Step
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
