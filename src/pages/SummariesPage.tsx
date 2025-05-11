
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Mock data for summaries
const MOCK_SUMMARIES = [
  { 
    id: '1', 
    documentId: '1',
    documentName: 'Research Paper.pdf', 
    generatedOn: '2023-05-16', 
    snippet: 'This paper examines the impact of artificial intelligence on modern healthcare systems...' 
  },
  { 
    id: '2', 
    documentId: '2',
    documentName: 'Meeting Notes.pdf', 
    generatedOn: '2023-05-11', 
    snippet: 'The quarterly meeting focused on three key initiatives: customer acquisition strategy...' 
  },
  { 
    id: '3', 
    documentId: '3',
    documentName: 'Project Proposal.pdf', 
    generatedOn: '2023-05-03', 
    snippet: 'This proposal outlines a new approach to renewable energy storage using advanced materials...' 
  },
];

const SummariesPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Summaries</h1>
            <p className="text-muted-foreground">
              View and manage your AI-generated document summaries
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard">
              View All Documents
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {MOCK_SUMMARIES.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {MOCK_SUMMARIES.map((summary) => (
                <Card key={summary.id} className="document-card">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <span>{summary.documentName}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Generated on {new Date(summary.generatedOn).toLocaleDateString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{summary.snippet}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/document/${summary.documentId}`}>
                        View Document
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/document/${summary.documentId}?tab=summary`}>
                        View Full Summary
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-muted/30">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No summaries yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Generate a summary from any of your documents to see it here
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

export default SummariesPage;
