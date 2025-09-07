'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emergencyContactSchema, type EmergencyContact } from '@/lib/form-schema';
import { relationships } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Users, Shield } from 'lucide-react';

interface EmergencyContactFormProps {
  defaultValues?: Partial<EmergencyContact>;
  isUnder21?: boolean;
  onSubmit: (data: EmergencyContact) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EmergencyContactForm({ 
  defaultValues, 
  isUnder21,
  onSubmit, 
  onNext, 
  onBack 
}: EmergencyContactFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<EmergencyContact>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handleFormSubmit = (data: EmergencyContact) => {
    onSubmit(data);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Primary Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Primary Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  {...register('contactName')}
                  placeholder="John Smith"
                  className={errors.contactName ? 'border-red-500' : ''}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">{errors.contactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.relationship ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((relationship) => (
                          <SelectItem key={relationship} value={relationship}>
                            {relationship}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.relationship && (
                  <p className="text-sm text-red-500">{errors.relationship.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="+1-123-456-7890"
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Guardian Contact (conditional) */}
          {isUnder21 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Guardian Contact (Required for under 21)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name *</Label>
                  <Input
                    id="guardianName"
                    {...register('guardianName')}
                    placeholder="Jane Doe"
                    className={errors.guardianName ? 'border-red-500' : ''}
                  />
                  {errors.guardianName && (
                    <p className="text-sm text-red-500">{errors.guardianName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Guardian Phone *
                  </Label>
                  <Input
                    id="guardianPhone"
                    {...register('guardianPhone')}
                    placeholder="+1-123-456-7890"
                    className={errors.guardianPhone ? 'border-red-500' : ''}
                  />
                  {errors.guardianPhone && (
                    <p className="text-sm text-red-500">{errors.guardianPhone.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

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