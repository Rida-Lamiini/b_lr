"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, subWeeks, addWeeks, isThisWeek } from "date-fns";
import * as Icons from "@phosphor-icons/react";
import { trpc } from "@/lib/trpc-client";
import { useDebounce } from "use-debounce";

const REVIEW_TEMPLATE = `### 🏆 Wins & Achievements
- 
- 

### 🚧 Challenges & Blockers
- 
- 

### 🧠 Learnings
- 
- 

### 🎯 Focus for Next Week
- 
- 
`;

export function WeeklyReviewEditor() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [debouncedContent] = useDebounce(content, 1000);

  const { data: review, isLoading, refetch } = trpc.weeklyReview.getByWeek.useQuery({
    weekStart: currentWeek,
  });

  const upsertReview = trpc.weeklyReview.upsert.useMutation({
    onSuccess: () => {
      setIsDirty(false);
      refetch();
    },
  });

  // Only update content state when review changes and it's not currently being edited
  useEffect(() => {
    if (review?.content) {
      if (!isDirty) {
        setContent(review.content);
      }
    } else {
      if (!isDirty) {
        setContent("");
      }
    }
  }, [review, isDirty]);

  // Auto-save logic
  useEffect(() => {
    if (debouncedContent !== "" && isDirty) {
      upsertReview.mutate({
        weekStart: currentWeek,
        content: debouncedContent,
      });
    }
  }, [debouncedContent, currentWeek, isDirty, upsertReview]);

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
    setIsDirty(false); // Discard unsaved changes on navigation for simplicity, or we could force save
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
    setIsDirty(false);
  };

  const loadTemplate = () => {
    setContent(REVIEW_TEMPLATE);
    setIsDirty(true); // Trigger auto-save immediately
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const weekLabel = format(currentWeek, "'Week of' MMM d, yyyy");
  const isCurrent = isThisWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className="flex flex-col h-full overflow-hidden w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
          Weekly Review
          {isCurrent && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary uppercase font-bold">
              Current
            </span>
          )}
        </h2>

        <div className="flex items-center gap-2">
          {upsertReview.isPending && (
            <span className="text-xs text-muted-foreground animate-pulse mr-2">Saving...</span>
          )}
          {!upsertReview.isPending && !isDirty && review && (
             <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1">
               <Icons.CheckCircle weight="fill" className="text-green-500" /> Saved
             </span>
          )}

          <div className="gh-box flex items-center rounded-md p-1 bg-white/5">
            <button
              onClick={handlePrevWeek}
              className="p-1 hover:bg-white/10 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.CaretLeft size={16} />
            </button>
            <div className="px-3 py-1 flex items-center gap-2 min-w-[150px] justify-center text-sm font-medium">
              <Icons.CalendarBlank size={14} className="text-muted-foreground" />
              {weekLabel}
            </div>
            <button
              onClick={handleNextWeek}
              disabled={isCurrent}
              className="p-1 hover:bg-white/10 rounded-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icons.CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="gh-box relative flex-1 flex flex-col overflow-hidden min-h-[500px] border border-border/50 bg-[#0d1117] rounded-xl shadow-lg">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icons.Spinner size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {!content && !isDirty ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-xl">
                  <Icons.PencilSimpleLine size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No review for this week</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  Start fresh with an empty canvas or load the strategic weekly review template.
                </p>
                <div className="flex items-center gap-4">
                   <button
                    onClick={() => setContent(" ")}
                    className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
                  >
                    Blank Document
                  </button>
                  <button
                    onClick={loadTemplate}
                    className="px-5 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-lg flex items-center gap-2"
                  >
                    <Icons.FileText size={16} weight="bold" />
                    Load Template
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your weekly review..."
                className="w-full h-full p-6 lg:p-10 bg-transparent resize-none outline-none text-sm lg:text-base text-foreground font-mono leading-relaxed custom-scrollbar placeholder:text-muted-foreground/30"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
