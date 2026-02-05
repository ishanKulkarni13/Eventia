import { useEffect, useMemo, useRef, useState } from 'react';
import { Expand, Shrink } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

const AttendanceCodeCard = ({
  event,
  code,
  remainingSeconds,
  status,
  onRefresh,
  className,
}) => {
  const [localRemaining, setLocalRemaining] = useState(remainingSeconds || 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setLocalRemaining(remainingSeconds || 0);
  }, [remainingSeconds]);

  useEffect(() => {
    if (!code || status !== 'ready') return undefined;

    const timer = setInterval(() => {
      setLocalRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [code, status]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isStale = status !== 'ready';
  const expiryLabel = useMemo(() => {
    if (!code || status !== 'ready') return 'Waiting for a valid code';
    return `Expires in ${localRemaining}s`;
  }, [code, status, localRemaining]);

  const statusLabel = useMemo(() => {
    if (!event) return 'Select an event';
    if (status === 'error') return 'Attendance not live';
    if (status === 'loading') return 'Fetching live code';
    return 'Live';
  }, [event, status]);

  const toggleFullscreen = async () => {
    if (!cardRef.current || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await cardRef.current.requestFullscreen();
      }
    } catch (error) {
      // Ignore fullscreen errors silently to avoid blocking UI.
    }
  };

  return (
    <Card className={className} ref={cardRef}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Live Attendance Code</CardTitle>
          <p className="text-xs text-muted-foreground">{statusLabel}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className={cn(
          'flex flex-col items-center gap-4',
          isFullscreen && 'min-h-[70vh] justify-center gap-8'
        )}>
          <div className={cn(
            'relative flex items-center justify-center rounded-xl border bg-background p-4',
            status !== 'ready' && 'opacity-60'
          )}>
            {status === 'ready' && code ? (
              <QRCodeCanvas value={code} size={isFullscreen ? 360 : 180} includeMargin />
            ) : (
              <div className={cn(
                'flex flex-col items-center justify-center text-center text-xs text-muted-foreground',
                isFullscreen ? 'h-[360px] w-[360px]' : 'h-[180px] w-[180px]'
              )}>
                <span className="font-medium text-foreground">Attendance not live</span>
                <span className="mt-1">Start attendance to show the QR code.</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">{event ? event.title : 'Select an event'}</p>
            <p className={cn(
              'mt-2 font-semibold tracking-widest',
              isFullscreen ? 'text-6xl' : 'text-3xl'
            )}>
              {code || '------'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{expiryLabel}</p>
          </div>

          {event ? (
            <button
              type="button"
              onClick={onRefresh}
              className="text-xs text-primary"
            >
              Refresh code
            </button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCodeCard;
