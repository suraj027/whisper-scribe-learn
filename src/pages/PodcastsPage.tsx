
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Calendar, Play, Download } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Mock data for podcasts
const MOCK_PODCASTS = [
  { 
    id: '1', 
    documentId: '1',
    documentName: 'Research Paper.pdf', 
    generatedOn: '2023-05-16', 
    duration: '5:23',
  },
  { 
    id: '2', 
    documentId: '2',
    documentName: 'Meeting Notes.pdf', 
    generatedOn: '2023-05-11', 
    duration: '3:45',
  },
  { 
    id: '3', 
    documentId: '4',
    documentName: 'Financial Report.gdoc', 
    generatedOn: '2023-04-24', 
    duration: '7:12',
  },
];

const PodcastsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Podcasts</h1>
            <p className="text-muted-foreground">
              Listen to your documents as podcast-style audio discussions
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard">
              View All Documents
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {MOCK_PODCASTS.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {MOCK_PODCASTS.map((podcast) => (
                <Card key={podcast.id} className="document-card">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Headphones className="mr-2 h-5 w-5 text-primary" />
                      <span>{podcast.documentName}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>Generated on {new Date(podcast.generatedOn).toLocaleDateString()}</span>
                      <span>{podcast.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-12 bg-black rounded-md flex items-center px-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                        <Play className="h-4 w-4 text-white ml-0.5" />
                      </div>
                      <div className="w-full bg-white/20 h-1 rounded-full">
                        <div className="bg-primary w-1/3 h-1 rounded-full"></div>
                      </div>
                      <div className="ml-3 text-white text-sm">{podcast.duration}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/document/${podcast.documentId}`}>
                        View Document
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/document/${podcast.documentId}?tab=podcast`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-muted/30">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No podcasts yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Generate a podcast from any of your documents to see it here
              </p>
              <Button asChild>
                <Link to="/dashboard">
                  View Documents
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PodcastsPage;
