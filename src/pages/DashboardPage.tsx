
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Search, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Mock data for documents
const MOCK_DOCUMENTS = [
  { id: '1', name: 'Research Paper.pdf', date: '2023-05-15', type: 'pdf' },
  { id: '2', name: 'Meeting Notes.pdf', date: '2023-05-10', type: 'pdf' },
  { id: '3', name: 'Project Proposal.pdf', date: '2023-05-01', type: 'pdf' },
  { id: '4', name: 'Financial Report.gdoc', date: '2023-04-22', type: 'gdoc' },
  { id: '5', name: 'Product Roadmap.pdf', date: '2023-04-15', type: 'pdf' },
];

const DashboardPage: React.FC = () => {
  // We're using hardcoded placeholder data for now
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your documents and generate insights
            </p>
          </div>
          <Button asChild>
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
          </Button>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Add PDF or Google Docs files to your library
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" asChild className="w-full">
                <Link to="/upload">Upload Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Ask Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze your documents and get AI-powered insights
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={documents.length === 0}>
                Select Document
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your recent documents and activities
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View History
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent documents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Documents</h2>
          </div>

          {documents.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {documents.map((doc) => (
                <Link to={`/document/${doc.id}`} key={doc.id}>
                  <Card className="document-card cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        <span className="truncate">{doc.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-24 flex items-center justify-center bg-muted/30">
                      <FileText className="h-10 w-10 text-muted-foreground/60" />
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="text-xs text-muted-foreground w-full flex justify-between">
                        <span>{doc.type.toUpperCase()}</span>
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-muted/30">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Upload your first document to get started
              </p>
              <Button asChild>
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
