
'use client';

import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
  layoutKey?: string; // For specific layout adjustments if needed, not standard AdSense
}

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className,
  style,
  layoutKey,
}) => {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adClient && adClient !== "YOUR_ADSENSE_CLIENT_ID_HERE" && adSlot) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        // console.log('AdSense ad pushed for slot:', adSlot);
      } catch (e) {
        console.error('Error pushing AdSense ad for slot', adSlot, ':', e);
      }
    }
  }, [adClient, adSlot, layoutKey]); // Added layoutKey to dependencies if it affects re-rendering

  if (!adClient || adClient === "YOUR_ADSENSE_CLIENT_ID_HERE") {
    return (
      <div className={cn("bg-muted text-muted-foreground text-center p-4 rounded-md my-4", className)} style={style}>
        Ad Placeholder (AdSense Client ID not configured or placeholder value used)
      </div>
    );
  }
  
  if (!adSlot) {
    return (
      <div className={cn("bg-muted text-muted-foreground text-center p-4 rounded-md my-4", className)} style={style}>
        Ad Placeholder (Ad Slot ID not provided)
      </div>
    );
  }

  return (
    <div className={cn('adbanner-container text-center my-4', className)} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
        data-ad-layout-key={layoutKey} // Optional: For more advanced layouts like "in-article"
      ></ins>
    </div>
  );
};

export default AdBanner;
