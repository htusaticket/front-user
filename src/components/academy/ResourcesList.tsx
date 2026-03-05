"use client";

import { Download, FileText, Link as LinkIcon, Video, File } from "lucide-react";

import type { LessonResource } from "@/types/academy";

interface ResourcesListProps {
  resources: LessonResource[];
}

const typeConfig: Record<string, { icon: React.ElementType; bgColor: string; iconColor: string }> = {
  PDF: { icon: FileText, bgColor: "bg-red-100", iconColor: "text-red-600" },
  LINK: { icon: LinkIcon, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
  VIDEO: { icon: Video, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  DOCUMENT: { icon: File, bgColor: "bg-green-100", iconColor: "text-green-600" },
};

export function ResourcesList({ resources }: ResourcesListProps) {
  // Filter out videos (they are shown in MultiVideoPlayer)
  const nonVideoResources = resources?.filter(r => r.type !== "VIDEO") || [];
  
  if (nonVideoResources.length === 0) {
    return null;
  }

  const handleDownload = (resource: LessonResource) => {
    // Open in new tab for links, download for files
    if (resource.type === "LINK") {
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      // Create a download link
      const link = document.createElement("a");
      link.href = resource.fileUrl;
      link.download = resource.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-brand-cyan-dark" />
        <h2 className="font-display text-lg font-bold text-brand-primary">
          Downloadable Resources
        </h2>
      </div>
      <div className="space-y-3">
        {nonVideoResources.map((resource) => {
          const config = typeConfig[resource.type] || typeConfig.DOCUMENT;
          const Icon = config.icon;

          return (
            <div
              key={resource.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-brand-cyan-dark hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div>
                  <p className="font-bold text-brand-primary">{resource.title}</p>
                  {resource.size && (
                    <p className="text-xs text-gray-500">{resource.size}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDownload(resource)}
                className="flex items-center gap-2 rounded-lg bg-brand-cyan-dark px-4 py-2 text-sm font-bold text-white transition-all hover:bg-brand-cyan"
              >
                {resource.type === "LINK" ? (
                  <>
                    <LinkIcon className="h-4 w-4" />
                    Open
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
