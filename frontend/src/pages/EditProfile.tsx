import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { profilesApi } from '@/lib/api';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    profileName: '',
    email: '',
    fullName: '',
    title: '',
    phone: '',
    location: '',
    summary: '',
    skills: [] as string[],
    links: [] as Array<{ label: string; url: string }>,
    education: [] as Array<{
      institution: string;
      degree: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>,
    experiences: [] as Array<{
      company: string;
      position: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>,
    projects: [] as Array<{
      name: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      technologies?: string[];
    }>,
    activities: [] as Array<{
      name: string;
      description?: string;
    }>,
    volunteering: [] as Array<{
      organization: string;
      role?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>,
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profilesApi.getById(Number(id));
      setFormData({
        profileName: data.profileName || '',
        email: data.email || '',
        fullName: data.fullName || '',
        title: data.title || '',
        phone: data.phone || '',
        location: data.location || '',
        summary: data.summary || '',
        skills: data.skills || [],
        links: data.links || [],
        education: data.education || [],
        experiences: data.experiences || [],
        projects: data.projects || [],
        activities: data.activities || [],
        volunteering: data.volunteering || [],
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await profilesApi.update(Number(id), formData);
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been updated successfully.',
      });
      navigate(`/profiles/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: '', url: '' }],
    });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    });
  };

  const updateEducation = (
    index: number,
    field: keyof (typeof formData.education)[0],
    value: string,
  ) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        { company: '', position: '', startDate: '', endDate: '' },
      ],
    });
  };

  const updateExperience = (
    index: number,
    field: keyof (typeof formData.experiences)[0],
    value: string,
  ) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;
    setFormData({ ...formData, experiences: newExperiences });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          technologies: [],
        },
      ],
    });
  };

  const updateProject = (
    index: number,
    field: keyof (typeof formData.projects)[0],
    value: string | string[],
  ) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value as never;
    setFormData({ ...formData, projects: newProjects });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [...formData.activities, { name: '', description: '' }],
    });
  };

  const updateActivity = (
    index: number,
    field: keyof (typeof formData.activities)[0],
    value: string,
  ) => {
    const newActivities = [...formData.activities];
    newActivities[index][field] = value;
    setFormData({ ...formData, activities: newActivities });
  };

  const removeActivity = (index: number) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index),
    });
  };

  const addVolunteering = () => {
    setFormData({
      ...formData,
      volunteering: [
        ...formData.volunteering,
        {
          organization: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateVolunteering = (
    index: number,
    field: keyof (typeof formData.volunteering)[0],
    value: string,
  ) => {
    const newVolunteering = [...formData.volunteering];
    newVolunteering[index][field] = value;
    setFormData({ ...formData, volunteering: newVolunteering });
  };

  const removeVolunteering = (index: number) => {
    setFormData({
      ...formData,
      volunteering: formData.volunteering.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/profiles/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>

        <Card className="overflow-hidden shadow-xl">
          <div className="bg-gradient-primary p-8 text-white">
            <h1 className="mb-2 text-3xl font-bold">Edit Profile</h1>
            <p className="text-blue-50">Update your profile information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  Basic Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profileName">
                      Profile Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="profileName"
                      value={formData.profileName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Skills</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Links</h2>
                  <Button type="button" size="sm" onClick={addLink}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>
                {formData.links.map((link, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Label (e.g., GitHub)"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(index, 'label', e.target.value)
                          }
                        />
                        <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) =>
                            updateLink(index, 'url', e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeLink(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Work Experience</h2>
                  <Button type="button" size="sm" onClick={addExperience}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
                {formData.experiences.map((exp, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">
                          Experience {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(index, 'company', e.target.value)
                          }
                        />
                        <Input
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(index, 'position', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Start Date (e.g., Jan 2020)"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(index, 'startDate', e.target.value)
                          }
                        />
                        <Input
                          placeholder="End Date (e.g., Present)"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(index, 'endDate', e.target.value)
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(index, 'description', e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button type="button" size="sm" onClick={addEducation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                  </Button>
                </div>
                {formData.education.map((edu, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Education {index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              'institution',
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, 'degree', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Start Date (e.g., 2015)"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(index, 'startDate', e.target.value)
                          }
                        />
                        <Input
                          placeholder="End Date (e.g., 2019)"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEducation(index, 'endDate', e.target.value)
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={edu.description}
                        onChange={(e) =>
                          updateEducation(index, 'description', e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button type="button" size="sm" onClick={addProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </div>
                {formData.projects.map((project, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Project {index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProject(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) =>
                          updateProject(index, 'name', e.target.value)
                        }
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Start Date (e.g., Jan 2020)"
                          value={project.startDate}
                          onChange={(e) =>
                            updateProject(index, 'startDate', e.target.value)
                          }
                        />
                        <Input
                          placeholder="End Date (e.g., Present)"
                          value={project.endDate}
                          onChange={(e) =>
                            updateProject(index, 'endDate', e.target.value)
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={project.description}
                        onChange={(e) =>
                          updateProject(index, 'description', e.target.value)
                        }
                        rows={3}
                      />
                      <Input
                        placeholder="Technologies (comma-separated, e.g., React, Node.js)"
                        value={project.technologies?.join(', ') || ''}
                        onChange={(e) =>
                          updateProject(
                            index,
                            'technologies',
                            e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Activities</h2>
                  <Button type="button" size="sm" onClick={addActivity}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
                {formData.activities.map((activity, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Activity {index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeActivity(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Activity Name"
                        value={activity.name}
                        onChange={(e) =>
                          updateActivity(index, 'name', e.target.value)
                        }
                      />
                      <Textarea
                        placeholder="Description"
                        value={activity.description}
                        onChange={(e) =>
                          updateActivity(index, 'description', e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Volunteering */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-xl font-semibold">Volunteering</h2>
                  <Button type="button" size="sm" onClick={addVolunteering}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Volunteering
                  </Button>
                </div>
                {formData.volunteering.map((vol, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">
                          Volunteering {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVolunteering(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Organization"
                          value={vol.organization}
                          onChange={(e) =>
                            updateVolunteering(
                              index,
                              'organization',
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Role"
                          value={vol.role}
                          onChange={(e) =>
                            updateVolunteering(index, 'role', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Start Date (e.g., Jan 2020)"
                          value={vol.startDate}
                          onChange={(e) =>
                            updateVolunteering(
                              index,
                              'startDate',
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="End Date (e.g., Present)"
                          value={vol.endDate}
                          onChange={(e) =>
                            updateVolunteering(index, 'endDate', e.target.value)
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={vol.description}
                        onChange={(e) =>
                          updateVolunteering(
                            index,
                            'description',
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-primary shadow-lg"
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/profiles/${id}`)}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
