'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, User, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface SettingsPageProps {
  initialData: {
    name: string;
    email: string;
    imageUrl: string;
  };
}

function SettingsPage({ initialData }: SettingsPageProps) {
  const [isPending, startTransition] = React.useTransition();
  const [formState, setFormState] = React.useState({
    name: initialData.name,
    email: initialData.email,
    imageUrl: initialData.imageUrl
  });

  return (
    <main className='flex-1 p-4 md:p-8 pt-16 md:pt-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8'>
        <div className='w-full sm:flex-9'>
          <h1 className='font-bold text-2xl'>Settings</h1>
          <p>Manage your account preferences</p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card className='mb-8'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='font-medium'>Profile Settings</CardTitle>
          <User className='h-4 w-4 text-muted-foreground'/>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 mb-6'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={formState.imageUrl} />
              <AvatarFallback>UC</AvatarFallback>
            </Avatar>
            <Button variant='outline'>Change Avatar</Button>
          </div>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Display Name</Label>
              <Input 
                id='name' 
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className='max-w-md'
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input 
                id='email' 
                type='email' 
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className='max-w-md'
              />
            </div>
            <div className='flex justify-end'>
              <Button 
                onClick={() => {
                  startTransition(async () => {
                    try {
                      // Here you would implement the actual update logic
                      toast.success('Profile updated successfully');
                    } catch (error) {
                      console.error('Error updating profile:', error);
                      toast.error('Failed to update profile');
                    }
                  });
                }}
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className='mb-8'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='font-medium'>Notification Settings</CardTitle>
          <Bell className='h-4 w-4 text-muted-foreground'/>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Email Notifications</p>
                <p className='text-sm text-muted-foreground'>Receive email about your account activity</p>
              </div>
              <Button variant='outline'>Configure</Button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Comment Notifications</p>
                <p className='text-sm text-muted-foreground'>Get notified when someone comments on your articles</p>
              </div>
              <Button variant='outline'>Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='font-medium'>Appearance</CardTitle>
          <Palette className='h-4 w-4 text-muted-foreground'/>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Theme Preferences</p>
                <p className='text-sm text-muted-foreground'>Customize your interface theme</p>
              </div>
              <Button variant='outline'>Customize</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default SettingsPage;