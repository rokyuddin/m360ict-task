# Employee Onboarding Form

A comprehensive multi-step employee onboarding form built with Next.js, React Hook Form, Zod validation, and shadcn/ui components.

## Features

### Core Functionality

- **5-Step Multi-Step Form**: Personal Info, Job Details, Skills & Preferences, Emergency Contact, Review & Submit
- **Smart Validation**: Dynamic validation rules based on form data and business logic
- **Conditional Fields**: Fields that show/hide based on user selections
- **Form State Persistence**: Auto-save form state in React state with unsaved changes warning
- **Progress Tracking**: Visual progress indicator with step completion status

### Smart Business Logic

- **Dynamic Salary Fields**: Contract vs Full-time salary validation ranges
- **Department-Based Filtering**: Manager and skills lists filtered by selected department
- **Age-Based Conditional Fields**: Guardian contact fields for users under 21
- **Weekend Restrictions**: HR/Finance employees cannot start on weekends
- **Remote Work Approval**: Manager approval required for >50% remote work preference
- **Cross-Step Validation**: Validation that spans multiple form steps

### User Experience

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessible Forms**: Proper labeling, error states, and keyboard navigation
- **Visual Feedback**: Loading states, validation messages, and completion indicators
- **Navigation Controls**: Ability to go back to previous steps and review data

## Technologies Used

- **Next.js 13** - React framework with app router
- **React Hook Form** - Form state management and validation
- **Zod** - TypeScript-first schema validation
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd employee-onboarding-form
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable components
│   ├── forms/               # Individual form step components
│   │   ├── personal-info-form.tsx
│   │   ├── job-details-form.tsx
│   │   ├── skills-form.tsx
│   │   ├── emergency-contact-form.tsx
│   │   └── review-form.tsx
│   ├── ui/                  # shadcn/ui components
│   └── multi-step-form.tsx  # Main form orchestrator
├── hooks/                   # Custom React hooks
│   └── use-form-persistence.ts
├── lib/                     # Utility functions and schemas
│   ├── form-schema.ts       # Zod validation schemas
│   ├── mock-data.ts         # Mock data for managers and skills
│   └── utils.ts             # Utility functions
```

## Form Steps Detail

### Step 1: Personal Information

- Full Name (required, min 2 words)
- Email (required, valid email format)
- Phone Number (required, +1-123-456-7890 format)
- Date of Birth (must be 18+ years old)
- Profile Picture (optional, JPG/PNG, max 2MB)

### Step 2: Job Details

- Department (dropdown: Engineering, Marketing, Sales, HR, Finance)
- Position Title (required, min 3 characters)
- Start Date (not in past, max 90 days future, weekend restrictions for HR/Finance)
- Job Type (radio: Full-time, Part-time, Contract)
- Salary Expectation (dynamic ranges based on job type)
- Manager (filtered by department selection)

### Step 3: Skills & Preferences

- Primary Skills (min 3, department-specific options)
- Experience Years (for each selected skill)
- Working Hours (time range validation)
- Remote Work Preference (0-100% slider)
- Manager Approval (conditional field for >50% remote)
- Additional Notes (optional, max 500 chars)

### Step 4: Emergency Contact

- Contact Name (required)
- Relationship (dropdown selection)
- Phone Number (required, validated format)
- Guardian Contact (conditional for users under 21)

### Step 5: Review & Submit

- Read-only summary of all entered data
- Organized by sections with clear visual hierarchy
- Confirmation checkbox (required to submit)
- Final submission with success confirmation

## Complex Logic Implementation

### Dynamic Validation

The form uses Zod's `superRefine` method to implement complex cross-field validation:

```typescript
// Weekend validation for HR/Finance departments
.superRefine((data, ctx) => {
  if ((data.department === 'HR' || data.department === 'Finance') && data.startDate) {
    const startDate = new Date(data.startDate);
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'HR and Finance employees cannot start on weekends',
        path: ['startDate'],
      });
    }
  }
});
```

### Conditional Field Rendering

Fields are conditionally rendered based on form state using React Hook Form's `watch` function:

```typescript
const watchedRemotePreference = watch("remoteWorkPreference");

// Show manager approval field when remote work > 50%
{
  watchedRemotePreference > 50 && <ManagerApprovalField />;
}
```

### Department-Based Filtering

Mock data is filtered based on user selections:

```typescript
const filteredManagers = mockManagers.filter(
  (manager) => manager.department === selectedDepartment
);
```

## Assumptions Made

1. **Phone Number Format**: Standardized to US format (+1-123-456-7890) for consistency
2. **File Upload**: Profile picture upload is simulated (files are not actually stored)
3. **Mock Data**: Managers and skills are hardcoded for demo purposes
4. **Form Persistence**: Data is stored in component state, not localStorage or database
5. **Weekend Definition**: Friday and Saturday are considered weekends for start date validation
6. **Age Calculation**: Based on current date, accounting for leap years and exact birthday dates

## Future Enhancements

### Completed Bonus Features

- ✅ Form state persistence with unsaved changes warning
- ✅ Comprehensive keyboard navigation support
- ✅ Custom React hooks for reusable logic
- ✅ Optimistic UI with smooth transitions

### Potential Additional Features

- File upload to cloud storage (AWS S3, etc.)
- Database integration for form submissions
- Email notifications and confirmations
- Advanced analytics and form completion tracking
- Multi-language support
- Dark mode theme support

## Testing

The application includes form validation testing through user interactions. To test:

1. Try submitting forms with invalid data to see validation errors
2. Test conditional fields by changing selections
3. Verify navigation between steps works correctly
4. Test responsive design on different screen sizes
5. Check accessibility with keyboard-only navigation

## Contributing

1. Follow the existing code structure and conventions
2. Add proper TypeScript types for new features
3. Include appropriate validation for new form fields
4. Test responsive design on multiple screen sizes
5. Ensure accessibility standards are maintained

## License

This project is licensed under the MIT License.
