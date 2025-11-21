import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Profile, profilesApi } from '@/lib/api';
import {
  ArrowLeft,
  Briefcase,
  Edit,
  FileText,
  GraduationCap,
  History,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profilesApi.getById(Number(id));
      setProfile(data);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await profilesApi.delete(Number(id));
      toast({
        title: 'Profile Deleted',
        description: 'The profile has been deleted successfully.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/profiles/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your profile and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-primary p-6 text-white">
                <div className="mb-4 inline-flex rounded-full bg-white/20 p-4">
                  <User className="h-8 w-8" />
                </div>
                <h2 className="mb-1 text-2xl font-bold">
                  {profile.profileName}
                </h2>
                <p className="text-blue-50">{profile.title}</p>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-primary"
                  onClick={() => navigate(`/generate?profile=${id}`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate CV
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/history')}
                >
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="volunteering">Volunteering</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {profile.summary && (
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Professional Summary
                    </h3>
                    <p className="text-muted-foreground">{profile.summary}</p>
                  </Card>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {!profile.summary &&
                  (!profile.skills || profile.skills.length === 0) && (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">
                        No overview information added yet.
                      </p>
                    </Card>
                  )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {profile.experiences && profile.experiences.length > 0 ? (
                  profile.experiences.map((exp, index) => (
                    <Card key={`exp-${index}`} className="p-6">
                      <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {exp.position}
                          </h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-muted-foreground">
                          {exp.description}
                        </p>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No experience added yet.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <Card key={`edu-${index}`} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                          <GraduationCap className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {edu.degree}
                          </h3>
                          <p className="text-muted-foreground">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No education added yet.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project, index) => (
                    <Card key={`project-${index}`} className="p-6">
                      <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {project.name}
                          </h3>
                          {(project.startDate || project.endDate) && (
                            <p className="text-sm text-muted-foreground">
                              {project.startDate} -{' '}
                              {project.endDate || 'Present'}
                            </p>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="mb-3 text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="bg-accent/5"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No projects added yet.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                {profile.activities && profile.activities.length > 0 ? (
                  profile.activities.map((activity, index) => (
                    <Card key={`activity-${index}`} className="p-6">
                      <h3 className="mb-2 text-lg font-semibold">
                        {activity.name}
                      </h3>
                      {activity.description && (
                        <p className="text-muted-foreground">
                          {activity.description}
                        </p>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No activities added yet.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="volunteering" className="space-y-6">
                {profile.volunteering && profile.volunteering.length > 0 ? (
                  profile.volunteering.map((vol, index) => (
                    <Card key={`vol-${index}`} className="p-6">
                      <div className="mb-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {vol.organization}
                          </h3>
                          {vol.role && (
                            <p className="text-muted-foreground">{vol.role}</p>
                          )}
                          {(vol.startDate || vol.endDate) && (
                            <p className="text-sm text-muted-foreground">
                              {vol.startDate} - {vol.endDate || 'Present'}
                            </p>
                          )}
                        </div>
                      </div>
                      {vol.description && (
                        <p className="text-muted-foreground">
                          {vol.description}
                        </p>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No volunteering experience added yet.
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
