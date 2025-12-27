import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, User, Phone, Linkedin, Briefcase, Calendar, Save } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().max(100, 'Name must be less than 100 characters').optional().nullable(),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().nullable(),
  linkedin_url: z.string().url('Please enter a valid URL').max(255, 'URL must be less than 255 characters').optional().nullable().or(z.literal('')),
  target_role: z.string().max(100, 'Role must be less than 100 characters').optional().nullable(),
  experience_years: z.number().min(0, 'Experience must be 0 or more').max(50, 'Experience must be 50 or less').optional().nullable(),
});

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    linkedin_url: '',
    target_role: '',
    experience_years: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        linkedin_url: profile.linkedin_url || '',
        target_role: profile.target_role || '',
        experience_years: profile.experience_years?.toString() || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsed = profileSchema.parse({
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        target_role: formData.target_role || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
      });
      setErrors({});
      
      setIsSubmitting(true);
      const { error } = await updateProfile(parsed);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-8 shadow-elevated">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              {errors.full_name && (
                <p className="text-destructive text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-muted-foreground mb-2">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                  className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              {errors.linkedin_url && (
                <p className="text-destructive text-sm mt-1">{errors.linkedin_url}</p>
              )}
            </div>

            {/* Target Role */}
            <div>
              <label htmlFor="target_role" className="block text-sm font-medium text-muted-foreground mb-2">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="target_role"
                  type="text"
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  placeholder="Software Engineer"
                  className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              {errors.target_role && (
                <p className="text-destructive text-sm mt-1">{errors.target_role}</p>
              )}
            </div>

            {/* Experience Years */}
            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-muted-foreground mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="5"
                  className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              {errors.experience_years && (
                <p className="text-destructive text-sm mt-1">{errors.experience_years}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
