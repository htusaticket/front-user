"use client";

import { motion } from "framer-motion";
import { Mic, Square, Pause, Play } from "lucide-react";

import { useAudioRecorder, formatRecordingTime } from "@/hooks";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, disabled = false }: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  // When recording is complete and we have a blob
  const handleStopRecording = () => {
    stopRecording();
  };

  // Pass blob to parent when ready
  if (audioBlob && !isRecording) {
    // This effect will be handled in parent component
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 w-full rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Recording State - Waveform Animation */}
      {isRecording && (
        <div className="mb-4 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            const barId = `waveform-bar-${index}`;
            return (
              <motion.div
                key={barId}
                className="w-1 rounded-full bg-red-500"
                animate={{
                  height: isPaused ? 8 : [8, 24, 8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: isPaused ? 0 : Infinity,
                  delay: index * 0.1,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Recording Timer */}
      {isRecording && (
        <p className="mb-4 font-mono text-2xl font-bold text-brand-primary">
          {formatRecordingTime(recordingTime)}
        </p>
      )}

      {/* Main Record Button */}
      {!audioUrl ? (
        <div className="flex flex-col items-center gap-4">
          <motion.button
            onClick={isRecording ? handleStopRecording : startRecording}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`flex h-24 w-24 items-center justify-center rounded-full transition-all ${
              isRecording
                ? "bg-red-500 shadow-2xl shadow-red-500/50"
                : disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-brand-cyan-dark shadow-xl shadow-brand-cyan-dark/30 hover:bg-brand-cyan"
            }`}
          >
            {isRecording ? (
              <Square className="h-10 w-10 text-white" fill="white" />
            ) : (
              <Mic className="h-10 w-10 text-white" />
            )}
          </motion.button>

          <p className="text-center text-sm font-bold text-gray-900">
            {isRecording
              ? "Recording... Press to stop"
              : "Press to record"}
          </p>

          {/* Pause/Resume buttons during recording */}
          {isRecording && (
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        /* Audio Preview */
        <AudioPreview
          audioUrl={audioUrl}
          duration={recordingTime}
          onDelete={resetRecording}
          onSubmit={() => audioBlob && onRecordingComplete(audioBlob)}
        />
      )}
    </div>
  );
}

interface AudioPreviewProps {
  audioUrl: string;
  duration: number;
  onDelete: () => void;
  onSubmit: () => void;
}

function AudioPreview({ audioUrl, duration, onDelete, onSubmit }: AudioPreviewProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <audio src={audioUrl} controls className="flex-1" />
        <span className="text-sm font-semibold text-gray-600">
          {formatRecordingTime(duration)}
        </span>
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
        >
          Re-record
        </motion.button>
        <motion.button
          onClick={onSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-cyan-dark px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-cyan-dark/20 transition-all hover:bg-brand-cyan"
        >
          Submit Recording
        </motion.button>
      </div>
    </div>
  );
}
