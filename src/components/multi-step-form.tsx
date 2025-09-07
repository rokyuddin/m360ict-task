// 'use client';

// import { useState } from 'react';
// import { useFormPersistence } from '@/hooks/use-form-persistence';
// import { ProgressIndicator } from '@/components/ui/progress-indicator';
// import { PersonalInfoForm } from '@/components/forms/personal-info-form';
// import { JobDetailsForm } from '@/components/forms/job-details-form';
// import { SkillsForm } from '@/components/forms/skills-form';
// import { EmergencyContactForm } from '@/components/forms/emergency-contact-form';
// import { ReviewForm } from '@/components/forms/review-form';
// import { Card, CardContent } from '@/components/ui/card';
// import { CheckCircle } from 'lucide-react';
// import type { PersonalInfo, JobDetails, Skills, EmergencyContact, Review } from '@/lib/form-schema';

// const STEP_NAMES = [
//   'Personal Info',
//   'Job Details',
//   'Skills & Preferences',
//   'Emergency Contact',
//   'Review & Submit'
// ];

// export function MultiStepForm() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(5).fill(false));
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { formData, updateFormData, markAsSaved } = useFormPersistence();

//   const handleNext = () => {
//     if (currentStep < 4) {
//       setCompletedSteps(prev => {
//         const newCompleted = [...prev];
//         newCompleted[currentStep] = true;
//         return newCompleted;
//       });
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handlePersonalInfoSubmit = (data: PersonalInfo) => {
//     updateFormData('personalInfo', data);
//   };

//   const handleJobDetailsSubmit = (data: JobDetails) => {
//     updateFormData('jobDetails', data);
//   };

//   const handleSkillsSubmit = (data: Skills) => {
//     updateFormData('skills', data);
//   };

//   const handleEmergencyContactSubmit = (data: EmergencyContact) => {
//     updateFormData('emergencyContact', data);
//   };

//   const handleReviewSubmit = (data: Review) => {
//     updateFormData('review', data);
//   };

//   const handleFinalSubmit = () => {
//     console.log('Final form submission:', formData);
//     markAsSaved();
//     setIsSubmitted(true);
//   };

//   const calculateAge = (dateOfBirth?: string) => {
//     if (!dateOfBirth) return null;
//     const birth = new Date(dateOfBirth);
//     const today = new Date();
//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const age = calculateAge(formData.personalInfo?.dateOfBirth);
//   const isUnder21 = age !== null && age < 21;

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//         <Card className="w-full max-w-2xl">
//           <CardContent className="text-center py-12">
//             <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               Application Submitted Successfully!
//             </h1>
//             <p className="text-gray-600 mb-6">
//               Thank you for completing the employee onboarding form.
//               Your application has been received and will be reviewed by our team.
//             </p>
//             <div className="bg-gray-50 p-4 rounded-lg text-left">
//               <h3 className="font-semibold mb-2">Next Steps:</h3>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• HR will review your application within 2-3 business days</li>
//                 <li>• You will receive an email confirmation shortly</li>
//                 <li>• Further instructions will be provided via email</li>
//               </ul>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Employee Onboarding
//           </h1>
//           <p className="text-gray-600">
//             Complete all steps to join our team
//           </p>
//         </div>

//         <ProgressIndicator
//           currentStep={currentStep}
//           totalSteps={5}
//           completedSteps={completedSteps}
//           stepNames={STEP_NAMES}
//         />

//         <div className="mt-8">
//           {currentStep === 0 && (
//             <PersonalInfoForm
//               defaultValues={formData.personalInfo}
//               onSubmit={handlePersonalInfoSubmit}
//               onNext={handleNext}
//             />
//           )}

//           {currentStep === 1 && (
//             <JobDetailsForm
//               defaultValues={formData.jobDetails}
//               onSubmit={handleJobDetailsSubmit}
//               onNext={handleNext}
//               onBack={handleBack}
//             />
//           )}

//           {currentStep === 2 && (
//             <SkillsForm
//               defaultValues={formData.skills}
//               department={formData.jobDetails?.department}
//               onSubmit={handleSkillsSubmit}
//               onNext={handleNext}
//               onBack={handleBack}
//             />
//           )}

//           {currentStep === 3 && (
//             <EmergencyContactForm
//               defaultValues={formData.emergencyContact}
//               isUnder21={isUnder21}
//               onSubmit={handleEmergencyContactSubmit}
//               onNext={handleNext}
//               onBack={handleBack}
//             />
//           )}

//           {currentStep === 4 && (
//             <ReviewForm
//               formData={formData}
//               onSubmit={handleReviewSubmit}
//               onBack={handleBack}
//               onFinalSubmit={handleFinalSubmit}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
// import { StorageStatus } from "@/components/ui/storage-status";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { JobDetailsForm } from "@/components/forms/job-details-form";
import { SkillsForm } from "@/components/forms/skills-form";
import { EmergencyContactForm } from "@/components/forms/emergency-contact-form";
import { ReviewForm } from "@/components/forms/review-form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type {
  PersonalInfo,
  JobDetails,
  Skills,
  EmergencyContact,
  Review,
} from "@/lib/form-schema";
import { useIndexedDBFile } from "@/hooks/use-indexed-db-file";

const STEP_NAMES = [
  "Personal Info",
  "Job Details",
  "Skills & Preferences",
  "Emergency Contact",
  "Review & Submit",
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(5).fill(false)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { formData, updateFormData, markAsSaved, clearPersistedData } =
    useFormPersistence();
  const { removeFile } = useIndexedDBFile("profilePicture");

  const handleNext = () => {
    if (currentStep < 4) {
      setCompletedSteps((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    updateFormData("personalInfo", data);
  };

  const handleJobDetailsSubmit = (data: JobDetails) => {
    updateFormData("jobDetails", data);
  };

  const handleSkillsSubmit = (data: Skills) => {
    updateFormData("skills", data);
  };

  const handleEmergencyContactSubmit = (data: EmergencyContact) => {
    updateFormData("emergencyContact", data);
  };

  const handleReviewSubmit = (data: Review) => {
    updateFormData("review", data);
  };

  const handleFinalSubmit = () => {
    console.log("Final form submission:", formData);
    markAsSaved();
    // Clear persisted data after successful submission
    setTimeout(() => {
      clearPersistedData();
      removeFile();
    }, 1000);
    setIsSubmitted(true);
  };

  const handleSaveNow = () => {
    markAsSaved();
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all saved form data? This action cannot be undone."
      )
    ) {
      clearPersistedData();
      setCurrentStep(0);
      setCompletedSteps(new Array(5).fill(false));
    }
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
  const isUnder21 = age !== null && age < 21;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for completing the employee onboarding form. Your
              application has been received and will be reviewed by our team.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • HR will review your application within 2-3 business days
                </li>
                <li>• You will receive an email confirmation shortly</li>
                <li>• Further instructions will be provided via email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Onboarding
          </h1>
          <p className="text-gray-600">Complete all steps to join our team</p>
        </div>
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={5}
          completedSteps={completedSteps}
          stepNames={STEP_NAMES}
        />

        <div className="mt-8">
          {currentStep === 0 && (
            <PersonalInfoForm
              defaultValues={formData.personalInfo}
              onSubmit={handlePersonalInfoSubmit}
              onNext={handleNext}
            />
          )}

          {currentStep === 1 && (
            <JobDetailsForm
              defaultValues={formData.jobDetails}
              onSubmit={handleJobDetailsSubmit}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <SkillsForm
              defaultValues={formData.skills}
              department={formData.jobDetails?.department}
              onSubmit={handleSkillsSubmit}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <EmergencyContactForm
              defaultValues={formData.emergencyContact}
              isUnder21={isUnder21}
              onSubmit={handleEmergencyContactSubmit}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <ReviewForm
              formData={formData}
              onSubmit={handleReviewSubmit}
              onBack={handleBack}
              onFinalSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
