"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LessonContentProps {
  content: string | null;
  className?: string;
}

export function LessonContent({ content, className = "" }: LessonContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for markdown elements
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 font-display text-2xl font-bold text-brand-primary first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 font-display text-xl font-bold text-brand-primary">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 font-display text-lg font-bold text-brand-primary">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-brand-cyan-dark bg-brand-cyan-dark/5 py-2 pl-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-brand-primary">
                  {children}
                </code>
              );
            }
            return (
              <code className="block overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-cyan-dark underline hover:text-brand-cyan"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gray-50 px-4 py-2 text-left text-sm font-bold text-brand-primary">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-gray-200 px-4 py-2 text-sm text-gray-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
          img: ({ src, alt }) => {
            const imageSrc = typeof src === "string" ? src : "";
            if (!imageSrc) return null;
            
            return (
              <Image
                src={imageSrc}
                alt={alt || ""}
                width={800}
                height={600}
                className="my-4 max-w-full rounded-lg shadow-sm"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
