import React, { useState, useEffect } from "react";
import { Plus, Menu, X } from "lucide-react"; // Import icons for the mobile menu toggle
import UploadVideos from "../Components/UploadVideos";
import {
  GetMessagesAPI,
  RetrieveVideoAPI,
  TimeStamp,
  UploadVideoResponse,
} from "../Services/api";
import UploadedVideos from "../Components/UploadedVideos";
import ChatMessages from "../Components/ChatMessages";
import { useParams, useLocation } from "react-router-dom";
import SideBar from "../Components/SideBar";
import InputSection, { SuggestedPrompt } from "../Components/InputSection"; // Adjust the import path as needed
import GeneratedClips from "../Components/GeneratedClips";
import SuggestedVideo, {
  SuggestedVideoType,
} from "../Components/SuggestedVideo";

export interface Clip {
  id: string;
  filename: string;
  collapsed: boolean;
  commentary: string;
  videoUrl: string;
  timeStamp: TimeStamp;
}

export interface Message {
  id: string;
  mainMessage: string;
  role: "user" | "assistant";
  message?: string;
  timeStamp: string;
  Clips?: Clip[];
  typing?: boolean;
}

const MainChat: React.FC = () => {
  const { chat_id } = useParams<{ chat_id: string }>(); // Get chat_id from URL params
  const [pendingPrompt, setPendingPrompt] = useState<string>(""); // Add state for pending prompt
  const [textInput, setTextInput] = useState<string>("");
  const [uploadedVideos, setUploadedVideos] = useState<UploadVideoResponse[]>(
    []
  );
  const [history, setHistory] = useState<Message[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const isNewChat = chat_id === "new";
  const isEmptyChat = history.length === 0;

  const suggestedVideo: SuggestedVideoType[] = [
    {
      filename: "Dodgers vs. Yankees.mp4",
      file_id: "preselected/Dodgers vs. Yankees.mp4",
    },
    {
      filename: "Dodgers vs. Padres.mp4",
      file_id: "preselected/Dodgers vs. Padres.mp4",
    },
  ];

  const suggestedPrompts: SuggestedPrompt[] = [
    { id: "1", text: "Give me 1 best moment from the clip" },
    { id: "2", text: "Show me all the home runs" },
    { id: "3", text: "Show me the strikeouts" },
    { id: "4", text: "Action sequence" },
  ];

  useEffect(() => {
    if (isNewChat) return;
    const fetchVideos = async () => {
      if (!chat_id) return;
      const videoData = await RetrieveVideoAPI({ chat_id });
      setUploadedVideos(videoData);
    };
    fetchVideos();
  }, [chat_id, isNewChat]);

  useEffect(() => {
    const getMessages = async () => {
      if (!chat_id) return;
      const messages: Message[] = await GetMessagesAPI(chat_id);
      setHistory(messages);
    };
    getMessages();
  }, [chat_id, isNewChat]);

  const handlePromptClick = (prompt: string) => {
    setTextInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Mobile Top Bar with Menu Button */}
        <div className="lg:hidden bg-gray-50 flex items-center p-4">
          <button
            className="text-gray-700"
            onClick={() => setShowMobileSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">
            Main Chat
          </h1>
        </div>

        {/* Sidebar for Large Screens */}
        <div className="hidden lg:block">
          <SideBar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-white shadow-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button onClick={() => setShowMobileSidebar(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SideBar mobileView={true} />
            </div>
            <div
              className="flex-1 bg-black opacity-50"
              onClick={() => setShowMobileSidebar(false)}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {isEmptyChat ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                {/* Custom welcome message */}
                <div className="mb-4 p-4 text-center text-3xl  rounded-lg">
                  What can I help you with?
                </div>
                <InputSection
                  textInput={textInput}
                  setTextInput={setTextInput}
                  uploadedVideos={uploadedVideos}
                  setUploadedVideos={setUploadedVideos}
                  history={history}
                  setHistory={setHistory}
                  suggestedPrompts={suggestedPrompts}
                  handlePromptClick={handlePromptClick}
                  pendingPrompt={pendingPrompt}
                  clearPendingPrompt={() => setPendingPrompt("")}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <ChatMessages history={history} />
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                  <InputSection
                    textInput={textInput}
                    setTextInput={setTextInput}
                    uploadedVideos={uploadedVideos}
                    setUploadedVideos={setUploadedVideos}
                    history={history}
                    setHistory={setHistory}
                    suggestedPrompts={suggestedPrompts}
                    handlePromptClick={handlePromptClick}
                    pendingPrompt={pendingPrompt}
                    clearPendingPrompt={() => setPendingPrompt("")}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Upload Panel (Only on Large Screens) */}
        <div className="hidden lg:block lg:w-96 xl:w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-4">Video Library</h2>
            <UploadVideos
              uploadedVideos={uploadedVideos}
              setUploadedVideos={setUploadedVideos}
            />
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Content
              </h3>
              <div className="space-y-2">
                {uploadedVideos.length === 0 ? (
                  <>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Quick Add
                    </h4>
                    {suggestedVideo.map((video) => (
                      <SuggestedVideo
                        key={video.file_id}
                        suggestedVideo={video}
                        setUploadedVideos={setUploadedVideos}
                      />
                    ))}
                  </>
                ) : (
                  uploadedVideos.map((video) => (
                    <UploadedVideos
                      key={video.file_id}
                      uploadedVideo={video}
                      setUploadedVideos={setUploadedVideos}
                    />
                  ))
                )}
              </div>
            </div>
            <GeneratedClips history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
