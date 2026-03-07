"use client";

import { PlayCircle, Check } from "lucide-react";
import { useState } from "react";

import type { LessonResource } from "@/types/academy";

import { VideoPlayer } from "./VideoPlayer";

interface MultiVideoPlayerProps {
  mainVideoUrl: string | null;
  mainVideoTitle: string;
  additionalVideos?: LessonResource[];
}

export function MultiVideoPlayer({ 
  mainVideoUrl, 
  mainVideoTitle,
  additionalVideos = [],
}: MultiVideoPlayerProps) {
  // Filter only video resources
  const videoResources = additionalVideos.filter(r => r.type === "VIDEO");
  
  // All videos including main
  const allVideos = [
    { id: 0, title: mainVideoTitle, url: mainVideoUrl },
    ...videoResources.map(v => ({ id: v.id, title: v.title, url: v.fileUrl })),
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);

  const currentVideo = allVideos[currentVideoIndex];
  const hasMultipleVideos = allVideos.length > 1;

  const handleVideoSelect = (index: number) => {
    // Mark current as watched before switching
    if (!watchedVideos.includes(currentVideoIndex)) {
      setWatchedVideos(prev => [...prev, currentVideoIndex]);
    }
    setCurrentVideoIndex(index);
  };

  // If only one video, just show the regular player
  if (!hasMultipleVideos) {
    return <VideoPlayer url={mainVideoUrl} title={mainVideoTitle} />;
  }

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <VideoPlayer 
        url={currentVideo?.url || null} 
        title={currentVideo?.title || "Video"} 
      />

      {/* Video Playlist */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-primary">
            Lesson Videos
          </h3>
          <span className="text-xs text-gray-500">
            {watchedVideos.length + (watchedVideos.includes(currentVideoIndex) ? 0 : 0)}/{allVideos.length} watched
          </span>
        </div>
        
        <div className="space-y-2">
          {allVideos.map((video, index) => {
            const isActive = index === currentVideoIndex;
            const isWatched = watchedVideos.includes(index);
            
            return (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(index)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all ${
                  isActive
                    ? "bg-brand-cyan-dark text-white shadow-md"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {/* Video Number/Status */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isWatched
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isWatched && !isActive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isActive ? "text-white" : "text-gray-900"
                  }`}>
                    {video.title}
                  </p>
                  <p className={`text-xs ${
                    isActive ? "text-white/70" : "text-gray-500"
                  }`}>
                    {index === 0 ? "Main Video" : `Supplementary Video ${index}`}
                  </p>
                </div>

                {/* Play Icon */}
                {isActive && (
                  <PlayCircle className="h-5 w-5 shrink-0 text-white/80" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
