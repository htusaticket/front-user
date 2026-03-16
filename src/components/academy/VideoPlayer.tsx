"use client";

import { useMemo } from "react";

interface VideoPlayerProps {
  url: string | null;
  title?: string;
  className?: string;
}

// Helper to extract video ID and platform
function parseVideoUrl(url: string): { platform: "youtube" | "vimeo" | "loom" | "direct"; embedUrl: string } | null {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  ];
  
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        platform: "youtube",
        embedUrl: `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`,
      };
    }
  }
  
  // Vimeo patterns
  const vimeoPattern = /(?:vimeo\.com\/)(\d+)/i;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      platform: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }
  
  // Loom patterns
  const loomPattern = /(?:loom\.com\/(?:share|embed)\/)([a-zA-Z0-9]+)/i;
  const loomMatch = url.match(loomPattern);
  if (loomMatch && loomMatch[1]) {
    return {
      platform: "loom",
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }
  
  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) {
    return {
      platform: "direct",
      embedUrl: url,
    };
  }
  
  // Direct video URL (mp4, webm, etc.)
  if (/\.(mp4|webm|ogg)$/i.test(url)) {
    return {
      platform: "direct",
      embedUrl: url,
    };
  }
  
  return null;
}

export function VideoPlayer({ url, title = "Video", className = "" }: VideoPlayerProps) {
  const videoInfo = useMemo(() => {
    if (!url) return null;
    return parseVideoUrl(url);
  }, [url]);

  if (!url || !videoInfo) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center bg-gray-900 ${className}`}>
        <p className="text-gray-400">No video available</p>
      </div>
    );
  }

  // Direct video file
  if (videoInfo.platform === "direct" && /\.(mp4|webm|ogg)$/i.test(videoInfo.embedUrl)) {
    return (
      <div className={`aspect-video w-full bg-black ${className}`}>
        <video
          src={videoInfo.embedUrl}
          controls
          className="h-full w-full"
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Embedded video (YouTube, Vimeo, Loom)
  return (
    <div className={`aspect-video w-full bg-black ${className}`}>
      <iframe
        src={videoInfo.embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
