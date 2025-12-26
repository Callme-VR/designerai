import { fetchRealtimeSubscriptionToken } from "@/app/actions/realtime";
import { THEME_LIST, ThemeType } from "@/lib/themes";
import { FrameType } from "@/types/project";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";

export type LoadingStatusType =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "completed"
  | "failed";

interface CanvasContextType {
  theme?: ThemeType;
  setTheme: (id: string) => void;
  themes: ThemeType[];
  frames: FrameType[];
  setFrames: (frames: FrameType[]) => void;
  updateFrame: (id: string, data: Partial<FrameType>) => void;
  addFrame: (frame: FrameType) => void;
  selectedFrameId: string | null;
  selectedFrame: FrameType | null;
  setSelectedFrameId: (id: string | null) => void;
  loadingStatus: LoadingStatusType;
  setLoadingStatus: (status: LoadingStatusType) => void;
}

export const CanvasContext = createContext<CanvasContextType | undefined>(
  undefined
);

export default function CanvasProvider({
  children,
  initialThemeId,
  initialFrames = [],
  hasInitialData = false,
  projectId,
}: {
  children: ReactNode;
  initialThemeId?: string;
  initialFrames?: FrameType[];
  hasInitialData?: boolean;
  projectId: string | null;
}) {
  const [themeId, setThemeId] = useState<string>(
    initialThemeId || THEME_LIST[0].id
  );
  const [frames, setFrames] = useState<FrameType[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>(
    hasInitialData ? "idle" : "running"
  );

  const [prevProjectId, setPrevProjectId] = useState(projectId);
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId);
    setFrames(initialFrames);
    setThemeId(initialThemeId || THEME_LIST[0].id);
    setSelectedFrameId(null);
    // setLoadingStatus("running");
  }

  const theme = THEME_LIST.find((t) => t.id === themeId);
  const selectedFrame =
    frames.find((frame) => frame.id === selectedFrameId) ?? null;

  const setTheme = useCallback((id: string) => {
    setThemeId(id);
  }, []);

  const { freshData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  useEffect(() => {
    if (!freshData || freshData.length === 0) return;
    freshData.forEach((message) => {
      const { data, topic } = message;

      if (data.projectId !== projectId) return;
    });
  });

  const addFrame = useCallback((frame: FrameType) => {
    setFrames((prevFrames) => [...prevFrames, frame]);
  }, []);

  const updateFrame = useCallback((id: string, data: Partial<FrameType>) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === id ? { ...frame, ...data } : frame
      )
    );
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        theme,
        themes: THEME_LIST,
        setTheme,
        frames,
        setFrames,
        updateFrame,
        addFrame,
        selectedFrameId,
        selectedFrame,
        setSelectedFrameId,
        loadingStatus,
        setLoadingStatus,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used within CanvasProvider");
  return ctx;
};
