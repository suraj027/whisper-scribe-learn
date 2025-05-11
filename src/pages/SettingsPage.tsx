
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/components/layout/AppLayout';
import { AlertCircle, Check, Google, Key, UserCog } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Form schemas
const profileSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

const apiKeysSchema = z.object({
  geminiApiKey: z.string().optional(),
  elevenLabsApiKey: z.string().optional(),
});

const integrationsSchema = z.object({
  googleDriveEnabled: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ApiKeysFormValues = z.infer<typeof apiKeysSchema>;
type IntegrationsFormValues = z.infer<typeof integrationsSchema>;

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'Demo User',
      email: 'user@example.com',
    },
  });
  
  // API Keys form
  const apiKeysForm = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      geminiApiKey: '',
      elevenLabsApiKey: '',
    },
  });
  
  // Integrations form
  const integrationsForm = useForm<IntegrationsFormValues>({
    resolver: zodResolver(integrationsSchema),
    defaultValues: {
      googleDriveEnabled: false,
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (values: ProfileFormValues) => {
    toast.success('Profile updated successfully');
    console.log('Profile updated:', values);
  };
  
  // Handle API keys form submission
  const onApiKeysSubmit = (values: ApiKeysFormValues) => {
    toast.success('API keys updated successfully');
    console.log('API keys updated:', values);
  };
  
  // Handle integrations form submission
  const onIntegrationsSubmit = (values: IntegrationsFormValues) => {
    if (values.googleDriveEnabled) {
      // This would trigger Google OAuth flow
      toast.success('Google Drive connected successfully');
    } else {
      toast.success('Integrations updated successfully');
    }
    console.log('Integrations updated:', values);
  };

  // Connect to Google Drive (mock function)
  const connectGoogleDrive = () => {
    // This is a placeholder for a real OAuth flow
    toast.success('Connected to Google Drive successfully');
    integrationsForm.setValue('googleDriveEnabled', true);
  };
  
  // Disconnect from Google Drive (mock function)
  const disconnectGoogleDrive = () => {
    toast.success('Disconnected from Google Drive');
    integrationsForm.setValue('googleDriveEnabled', false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and API integrations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <UserCog className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Google className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your user profile and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your name as it appears in your account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" readOnly />
                          </FormControl>
                          <FormDescription>
                            Your email address cannot be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </form>
                </Form>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Configure API keys for AI services integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiKeysForm}>
                  <form onSubmit={apiKeysForm.handleSubmit(onApiKeysSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Google Gemini API</h3>
                      <FormField
                        control={apiKeysForm.control}
                        name="geminiApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Enter your Google Gemini API key" 
                              />
                            </FormControl>
                            <FormDescription>
                              <a 
                                href="https://ai.google.dev/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Get your Google Gemini API key here
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">ElevenLabs API</h3>
                      <FormField
                        control={apiKeysForm.control}
                        name="elevenLabsApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Enter your ElevenLabs API key" 
                              />
                            </FormControl>
                            <FormDescription>
                              <a 
                                href="https://elevenlabs.io/docs/api-reference/text-to-speech" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Get your ElevenLabs API key here
                              </a>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>API Key Security</AlertTitle>
                      <AlertDescription>
                        Your API keys are stored securely and encrypted in the database.
                      </AlertDescription>
                    </Alert>
                    
                    <Button type="submit">
                      Save API Keys
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect external services to enhance functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...integrationsForm}>
                  <form onSubmit={integrationsForm.handleSubmit(onIntegrationsSubmit)} className="space-y-6">
                    <FormField
                      control={integrationsForm.control}
                      name="googleDriveEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center">
                                <Google className="h-5 w-5 mr-2 text-blue-600" />
                                Google Drive
                              </FormLabel>
                              <FormDescription>
                                Access and import Google Docs directly
                              </FormDescription>
                            </div>
                            {field.value ? (
                              <Button 
                                variant="outline" 
                                type="button" 
                                onClick={disconnectGoogleDrive}
                              >
                                Disconnect
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={connectGoogleDrive}
                              >
                                Connect
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {integrationsForm.watch('googleDriveEnabled') && (
                      <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle>Connected</AlertTitle>
                        <AlertDescription>
                          Google Drive is successfully connected to your account
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit">
                      Save Integration Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
