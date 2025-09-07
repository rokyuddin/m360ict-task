"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsSchema, type Skills } from "@/lib/form-schema";
import { skillsByDepartment, type Department } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Clock, Home, FileText } from "lucide-react";

interface SkillsFormProps {
  defaultValues?: Partial<Skills>;
  department?: Department;
  onSubmit: (data: Skills) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SkillsForm({
  defaultValues,
  department,
  onSubmit,
  onNext,
  onBack,
}: SkillsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<Skills>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      primarySkills: [],
      skillExperience: {},
      remoteWorkPreference: 0,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const watchedSkills = watch("primarySkills") || [];
  const watchedRemotePreference = watch("remoteWorkPreference");

  const availableSkills = department ? skillsByDepartment[department] : [];

  useEffect(() => {
    // Reset skills when department changes
    if (department && defaultValues?.primarySkills?.length === 0) {
      setValue("primarySkills", []);
      setValue("skillExperience", {});
    }
  }, [department, setValue, defaultValues?.primarySkills]);

  const handleFormSubmit = (data: Skills) => {
    onSubmit(data);
    onNext();
  };

  const handleSkillChange = (skillName: string, checked: boolean) => {
    const currentSkills = watchedSkills || [];
    let newSkills;

    if (checked) {
      newSkills = [...currentSkills, skillName];
    } else {
      newSkills = currentSkills.filter((skill) => skill !== skillName);
    }

    setValue("primarySkills", newSkills, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Skills & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Primary Skills */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Primary Skills (Select at least 3) *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={watchedSkills.includes(skill)}
                    onCheckedChange={(checked) =>
                      handleSkillChange(skill, checked as boolean)
                    }
                  />
                  <Label htmlFor={skill} className="text-sm font-normal">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {errors.primarySkills && (
              <p className="text-sm text-red-500">
                {errors.primarySkills.message}
              </p>
            )}
          </div>

          {/* Experience for Selected Skills */}
          {watchedSkills.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Experience (Years)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchedSkills.map((skill) => (
                  <div key={skill} className="space-y-2">
                    <Label htmlFor={`experience-${skill}`} className="text-sm">
                      {skill}
                    </Label>
                    <Input
                      id={`experience-${skill}`}
                      type="number"
                      min="0"
                      max="10"
                      {...register(`skillExperience.${skill}`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Working Hours */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Clock className="h-4 w-4" />
              Preferred Working Hours *
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHoursStart">Start Time</Label>
                <Input
                  id="workingHoursStart"
                  type="time"
                  {...register("workingHoursStart")}
                  className={errors.workingHoursStart ? "border-red-500" : ""}
                />
                {errors.workingHoursStart && (
                  <p className="text-sm text-red-500">
                    {errors.workingHoursStart.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingHoursEnd">End Time</Label>
                <Input
                  id="workingHoursEnd"
                  type="time"
                  {...register("workingHoursEnd")}
                  className={errors.workingHoursEnd ? "border-red-500" : ""}
                />
                {errors.workingHoursEnd && (
                  <p className="text-sm text-red-500">
                    {errors.workingHoursEnd.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Remote Work Preference */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Home className="h-4 w-4" />
              Remote Work Preference: {watchedRemotePreference}%
            </Label>
            <Controller
              name="remoteWorkPreference"
              control={control}
              render={({ field }) => (
                <Slider
                  min={0}
                  max={100}
                  step={10}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Manager Approval (conditional) */}
          {watchedRemotePreference > 50 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="managerApproved"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="managerApproved"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="managerApproved">
                  Manager has approved remote work preference above 50%
                </Label>
              </div>
            </div>
          )}

          {/* Extra Notes */}
          <div className="space-y-2">
            <Label htmlFor="extraNotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="extraNotes"
              {...register("extraNotes")}
              placeholder="Any additional information you'd like to share..."
              rows={4}
              maxLength={500}
              className={errors.extraNotes ? "border-red-500" : ""}
            />
            {errors.extraNotes && (
              <p className="text-sm text-red-500">
                {errors.extraNotes.message}
              </p>
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
