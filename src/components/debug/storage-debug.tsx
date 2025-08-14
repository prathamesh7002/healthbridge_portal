'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { listAvailableBuckets } from "@/lib/supabase-storage";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, RefreshCw, Plus, Database } from 'lucide-react';

export function StorageDebugPanel() {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const loadBuckets = async () => {
    setLoading(true);
    try {
      const availableBuckets = await listAvailableBuckets();
      setBuckets(availableBuckets);
      setMessage({ type: 'success', text: `Found ${availableBuckets.length} bucket(s)` });
    } catch (error) {
      setMessage({ type: 'error', text: `Error loading buckets: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const createHealthReportsBucket = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.storage.createBucket('health-reports', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Successfully created health-reports bucket!' });
      await loadBuckets(); // Refresh the list
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error creating bucket: ${error?.message || error}` 
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Storage Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={loadBuckets} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Load Buckets
          </Button>
          
          <Button 
            onClick={createHealthReportsBucket} 
            disabled={creating || buckets.includes('health-reports')}
            className="flex items-center gap-2"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create health-reports Bucket
          </Button>
        </div>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">Available Buckets:</h4>
          {buckets.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {buckets.map((bucket) => (
                <Badge 
                  key={bucket} 
                  variant={bucket === 'health-reports' ? 'default' : 'secondary'}
                >
                  {bucket}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No buckets found. Click "Load Buckets" to check or create a new bucket.
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Required bucket:</strong> health-reports</p>
          <p><strong>Status:</strong> {buckets.includes('health-reports') ? '✅ Found' : '❌ Missing'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
