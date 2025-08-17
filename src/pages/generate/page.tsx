import { FileCog, Link, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Controls from '@/pages/generate/controls';
import type { PreviewProps } from '@/pages/generate/preview';
import Preview from '@/pages/generate/preview';
import Upload from '@/pages/generate/upload';

const defaultPreviewProps: PreviewProps = {
  originalImageUrl: '',
  width: 20,
  height: 20,
  method: 'surface',
  grayscaleThreshold: 190,
  fillPercentage: 15,
};

function GeneratePage() {
  // Pending states (edited by user, not yet applied)
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviewProps, setPendingPreviewProps] = useState<PreviewProps>(defaultPreviewProps);

  // Applied preview props (used for preview)
  const [appliedPreviewProps, setAppliedPreviewProps] = useState<PreviewProps>(defaultPreviewProps);
  const [previewKey, setPreviewKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // When pendingFiles changes, update preview props
  useEffect(() => {
    if (pendingFiles.length > 0) {
      const url = URL.createObjectURL(pendingFiles[0]);
      setPendingPreviewProps((prev) => ({ ...prev, originalImageUrl: url }));
    }
  }, [pendingFiles]);

  const handlePreview = () => {
    setAppliedPreviewProps({ ...pendingPreviewProps });
    setPreviewKey((k) => k + 1);
  };

  const handleGenerate = async () => {
    if (pendingFiles.length === 0) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">Upload your image and generate amazing nonogram for you</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCog className="h-5 w-5" />
              Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Upload files={pendingFiles} setFiles={setPendingFiles} />
            <div className="space-y-6 mt-8">
              <Controls
                height={pendingPreviewProps.height}
                width={pendingPreviewProps.width}
                method={pendingPreviewProps.method}
                grayscaleThreshold={pendingPreviewProps.grayscaleThreshold}
                fillPercentage={pendingPreviewProps.fillPercentage}
                onHeightChange={(v) => setPendingPreviewProps((prev) => ({ ...prev, height: v }))}
                onWidthChange={(v) => setPendingPreviewProps((prev) => ({ ...prev, width: v }))}
                onMethodChange={(v) => setPendingPreviewProps((prev) => ({ ...prev, method: v }))}
                onGrayscaleThresholdChange={(v) =>
                  setPendingPreviewProps((prev) => ({ ...prev, grayscaleThreshold: v }))
                }
                onFillPercentageChange={(v) => setPendingPreviewProps((prev) => ({ ...prev, fillPercentage: v }))}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setPendingPreviewProps((prev) => ({
                      ...defaultPreviewProps,
                      originalImageUrl: prev.originalImageUrl,
                    }))
                  }
                >
                  Reset
                </Button>
                <Button size="lg" onClick={handlePreview} disabled={isPreviewLoading}>
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Preview & Generate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Preview key={previewKey} {...appliedPreviewProps} onLoadingChange={setIsPreviewLoading} />
              <Button className="w-full" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Skeleton className="h-4 w-4 mr-2 bg-white/20" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Generate Playable Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GeneratePage;
