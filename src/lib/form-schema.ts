import { z } from "zod";

const phoneRegex = /^\+1-\d{3}-\d{3}-\d{4}$/;

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine(
      (value) => value.trim().split(" ").length >= 2,
      "Full name must contain at least 2 words"
    ),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Phone number must be in format +1-123-456-7890"),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "Must be at least 18 years old"),
  profilePicture: z.any().optional(),
});

export const jobDetailsSchema = z
  .object({
    department: z.enum(["Engineering", "Marketing", "Sales", "HR", "Finance"]),
    positionTitle: z
      .string()
      .min(3, "Position title must be at least 3 characters"),
    startDate: z.string().refine((date) => {
      const startDate = new Date(date);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 90);
      return startDate >= today && startDate <= maxDate;
    }, "Start date must be today or within the next 90 days"),
    jobType: z.enum(["Full-time", "Part-time", "Contract"]),
    salaryExpectation: z
      .number()
      .min(1, "Salary  is required")
      .max(200000, "Salary  cannot exceed $200,000"),
    managerId: z.string().min(1, "Please select a manager"),
  })
  .superRefine((data, ctx) => {
    // Weekend validation for HR and Finance
    if (
      (data.department === "HR" || data.department === "Finance") &&
      data.startDate
    ) {
      const startDate = new Date(data.startDate);
      const dayOfWeek = startDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        // Friday (5) or Saturday (6)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "HR and Finance employees cannot start on weekends",
          path: ["startDate"],
        });
      }
    }

    // Salary validation based on job type
    if (
      data.jobType === "Full-time" &&
      (data.salaryExpectation < 30000 || data.salaryExpectation > 200000)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Full-time annual salary must be between $30,000 and $200,000",
        path: ["salaryExpectation"],
      });
    } else if (
      data.jobType === "Contract" &&
      (data.salaryExpectation < 50 || data.salaryExpectation > 150)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contract hourly rate must be between $50 and $150",
        path: ["salaryExpectation"],
      });
    }
  });

export const skillsSchema = z
  .object({
    primarySkills: z
      .array(z.string())
      .min(3, "Please select at least 3 skills"),
    skillExperience: z.record(z.string(), z.number().min(0).max(20)),
    workingHoursStart: z.string().min(1, "Start time is required"),
    workingHoursEnd: z.string().min(1, "End time is required"),
    remoteWorkPreference: z.number().min(0).max(100),
    managerApproved: z.boolean().optional(),
    extraNotes: z
      .string()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.workingHoursStart && data.workingHoursEnd) {
      const start = new Date(`2000-01-01T${data.workingHoursStart}`);
      const end = new Date(`2000-01-01T${data.workingHoursEnd}`);
      if (start >= end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["workingHoursEnd"],
        });
      }
    }
  });

export const emergencyContactSchema = z
  .object({
    contactName: z.string().min(1, "Contact name is required"),
    relationship: z.string().min(1, "Please select a relationship"),
    phoneNumber: z
      .string()
      .regex(phoneRegex, "Phone number must be in format +1-123-456-7890"),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Guardian validation will be handled dynamically based on age
    if (data.guardianName && !data.guardianPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guardian phone number is required",
        path: ["guardianPhone"],
      });
    }
    if (data.guardianPhone && !data.guardianName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guardian name is required",
        path: ["guardianName"],
      });
    }
  });

export const reviewSchema = z.object({
  confirmationChecked: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must confirm the information is correct"
    ),
});

export const completeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  jobDetails: jobDetailsSchema,
  skills: skillsSchema,
  emergencyContact: emergencyContactSchema,
  review: reviewSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type JobDetails = z.infer<typeof jobDetailsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;
