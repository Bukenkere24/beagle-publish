import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Linkedin,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateLinkedInDraft } from "../lib/linkedin-generator";
import { generateBlogDraft } from "../lib/blog-generator";
import { useAuth } from "../hooks/useAuth";
import type { TopicRow } from "../types/topic";

interface DraftEditorProps {
  topic: TopicRow;
  onUpdate: (updates: Partial<TopicRow>) => void;
}

type Tab = "blog" | "linkedin";

export default function DraftEditor({ topic, onUpdate }: DraftEditorProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [blogContent, setBlogContent] = useState(topic.draft_content || "");
  const [linkedinDraft, setLinkedinDraft] = useState(
    topic.linkedin_draft || "",
  );
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState(false);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [researchBrief, setResearchBrief] = useState<string | null>(null);
  const [showResearch, setShowResearch] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBlogContent(topic.draft_content || "");
    setLinkedinDraft(topic.linkedin_draft || "");
  }, [topic.id, topic.draft_content, topic.linkedin_draft]);

  const handleBlogChange = (content: string) => {
    setBlogContent(content);
    debouncedSave({ draft_content: content });
  };

  const handleLinkedInChange = (content: string) => {
    setLinkedinDraft(content);
    debouncedSave({ linkedin_draft: content });
  };

  const debouncedSave = (updates: Partial<TopicRow>) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(updates);
    }, 1000);
  };

  const handleGenerateBlogDraft = async () => {
    setIsGeneratingBlog(true);
    try {
      const prefs = (profile?.preferences || {}) as Record<string, any>;
      const data = await generateBlogDraft({
        topic: topic.topic,
        tone: prefs.defaultTone || "professional",
        publicationName: prefs.publicationName || "",
        topicsOfInterest: prefs.topicsOfInterest || [],
        existingDraft: blogContent || undefined,
      });

      setBlogContent(data.content);
      setResearchBrief(data.researchBrief);
      setShowResearch(true);
      onUpdate({
        draft_content: data.content,
        draft_title: data.title,
        slug: data.slug,
        status: topic.status === "queued" ? "review" : topic.status,
      });
    } catch (error) {
      alert("Blog generation failed. Please try again.");
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    if (!blogContent) return;
    setIsGeneratingLinkedIn(true);
    try {
      const prefs = (profile?.preferences || {}) as Record<string, any>;
      const generated = await generateLinkedInDraft(
        blogContent,
        topic.draft_title || topic.topic,
        prefs.defaultTone || "professional",
      );
      setLinkedinDraft(generated);
      onUpdate({ linkedin_draft: generated });
      setActiveTab("linkedin");
    } catch (error) {
      alert("LinkedIn generation failed. Please try again.");
    } finally {
      setIsGeneratingLinkedIn(false);
    }
  };

  return (
    <div className="bg-beagle-surface border border-beagle-border rounded-beagle overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-beagle-border bg-white/[0.02]">
        <button
          onClick={() => setActiveTab("blog")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "blog"
              ? "text-beagle-primary"
              : "text-beagle-text-muted hover:text-beagle-text-body"
          }`}
        >
          <FileText size={16} />
          Blog Draft
          {activeTab === "blog" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-beagle-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("linkedin")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === "linkedin"
              ? "text-beagle-primary"
              : "text-beagle-text-muted hover:text-beagle-text-body"
          }`}
        >
          <Linkedin size={16} />
          LinkedIn Post
          {activeTab === "linkedin" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-beagle-primary"
            />
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          {activeTab === "blog" && (
            <button
              onClick={handleGenerateBlogDraft}
              disabled={isGeneratingBlog}
              className="flex items-center gap-2 bg-beagle-primary text-white hover:bg-beagle-primary-hover disabled:opacity-50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-beagle-primary/20"
            >
              {isGeneratingBlog ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  AI Researching...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  {blogContent ? "Regenerate Blog" : "Generate Blog Draft"}
                </>
              )}
            </button>
          )}
          {activeTab === "linkedin" && (
            <button
              onClick={handleGenerateLinkedIn}
              disabled={isGeneratingLinkedIn || !blogContent}
              className="flex items-center gap-2 bg-beagle-primary/10 text-beagle-primary hover:bg-beagle-primary/20 disabled:opacity-50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              {isGeneratingLinkedIn ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Post...
                </>
              ) : (
                <>
                  <Linkedin size={14} />
                  {linkedinDraft ? "Regenerate Post" : "Generate LinkedIn Post"}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Research Brief (Collapsible) */}
      <AnimatePresence>
        {researchBrief && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: showResearch ? "auto" : 0,
              opacity: showResearch ? 1 : 0,
            }}
            className="overflow-hidden border-b border-beagle-border bg-beagle-primary/5"
          >
            <div className="p-4">
              <button
                onClick={() => setShowResearch(!showResearch)}
                className="flex items-center justify-between w-full text-beagle-text-muted hover:text-beagle-text-heading transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Agent Pipeline: Research Brief Generated
                </span>
                {showResearch ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              {showResearch && (
                <div className="mt-4 prose prose-invert prose-xs max-w-none prose-p:text-beagle-text-body/80 bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {researchBrief}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Content */}
      <div className="p-4 bg-black/20">
        <AnimatePresence mode="wait">
          {activeTab === "blog" ? (
            <motion.div
              key="blog"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]"
            >
              <div className="flex flex-col h-full bg-beagle-bg/50 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">
                    Markdown Editor
                  </span>
                  <span className="text-[10px] text-beagle-text-faint">
                    {blogContent.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  value={blogContent}
                  onChange={(e) => handleBlogChange(e.target.value)}
                  placeholder="Paste or write your blog content here..."
                  className="flex-1 w-full bg-transparent p-6 text-beagle-text-body font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-beagle-text-faint/30"
                />
              </div>

              <div className="flex flex-col h-full bg-beagle-bg/30 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05]">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">
                    Live Preview
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-8 prose prose-invert prose-headings:font-heading prose-p:text-beagle-text-body max-w-none">
                  <ReactMarkdown>{blogContent}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]"
            >
              <div className="flex flex-col h-full bg-beagle-bg/50 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">
                    LinkedIn Post Editor
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold ${linkedinDraft.length > 3000 ? "text-red-400" : "text-beagle-text-faint"}`}
                    >
                      {linkedinDraft.length}/3000 chars
                    </span>
                  </div>
                </div>
                <textarea
                  value={linkedinDraft}
                  onChange={(e) => handleLinkedInChange(e.target.value)}
                  placeholder="Post content optimized for LinkedIn..."
                  className="flex-1 w-full bg-transparent p-6 text-beagle-text-body font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-beagle-text-faint/30"
                />
              </div>

              <div className="flex flex-col h-full bg-beagle-bg/30 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05]">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">
                    LinkedIn Preview
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-8 prose prose-invert max-w-none prose-p:text-beagle-text-body prose-p:my-2">
                  <p className="font-bold text-beagle-text-heading mb-4">
                    Post Preview (Simulated)
                  </p>
                  <div className="whitespace-pre-wrap font-sans text-sm text-beagle-text-body leading-relaxed">
                    {linkedinDraft ||
                      "Click 'Generate LinkedIn Post' to create a targeted post from your blog content."}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
