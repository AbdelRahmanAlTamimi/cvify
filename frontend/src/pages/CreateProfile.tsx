import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { profilesApi } from '@/lib/api';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    profileName: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const profile = await profilesApi.create(formData);
      toast({
        title: 'Profile Created!',
        description: 'Your new profile has been created successfully.',
      });
      navigate(`/profiles/${profile.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-gradient-primary p-8 text-white">
            <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
              <User className="h-6 w-6" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Create New Profile</h1>
            <p className="text-blue-50">
              Start by creating a profile with your basic information
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="profileName"
                  className="text-base font-semibold"
                >
                  Profile Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="profileName"
                  placeholder="e.g., John Doe - Software Engineer"
                  value={formData.profileName}
                  onChange={(e) =>
                    setFormData({ ...formData, profileName: e.target.value })
                  }
                  required
                  className="h-12 text-base"
                />
                <p className="text-sm text-muted-foreground">
                  Choose a unique name to identify this profile
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-12 text-base"
                />
                <p className="text-sm text-muted-foreground">
                  This email will appear on your generated CVs
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Creating...' : 'Create Profile'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-accent/20 bg-accent/5 p-6">
          <h3 className="mb-2 font-semibold text-accent">Next Steps</h3>
          <p className="text-sm text-muted-foreground">
            After creating your profile, you'll be able to add detailed
            information like work experience, education, skills, and projects.
            Then you can generate AI-tailored CVs for specific job
            opportunities.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
