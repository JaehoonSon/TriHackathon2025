import { QuickAddVideoAPI, UploadVideoResponse } from "../Services/api";
import { X, Check, Video, Delete, Loader2, Plus } from "lucide-react";
import { DeleteVideoAPI } from "../Services/api";
import { useState } from "react";
import { useParams } from "react-router-dom";

export interface SuggestedVideoType {
  filename: string;
  file_id: string;
}

type VideoProps = {
  suggestedVideo: SuggestedVideoType;
  setUploadedVideos: React.Dispatch<
    React.SetStateAction<UploadVideoResponse[]>
  >;
};

const SuggestedVideo = ({ suggestedVideo, setUploadedVideos }: VideoProps) => {
  const [Loading, setLoading] = useState<boolean>(false);
  const chatId = useParams<{ chat_id: string }>().chat_id;
  if (chatId == null) return <></>;

  const handleQuickAddVideo = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // const uploadResponses: UploadVideoResponse[] = [];
    try {
      setLoading(true);
      const response: UploadVideoResponse = await QuickAddVideoAPI(
        chatId,
        suggestedVideo.filename,
        suggestedVideo.file_id
      );
      response.selected = true;
      setUploadedVideos((prevUploadedVideos) => [
        ...prevUploadedVideos,
        response,
      ]);
      //   uploadResponses.push(response);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        key={suggestedVideo.file_id}
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors bg-gray-50
        }
        ${!Loading ? "cursor-normal" : "cursor-not-allowed"}`}
      >
        <Video className={`w-5 h-5 flex-shrink-0 text-gray-500`} />
        <span className="text-sm truncate flex-grow">
          {suggestedVideo.filename}
        </span>

        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={(e) => handleQuickAddVideo(e)}
          disabled={Loading} // Disable the button while loading
        >
          {Loading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" /> // Loading spinner
          ) : (
            <Plus className="w-4 h-4 text-gray-500" /> // X icon
          )}
        </button>
      </div>
    </>
  );
};

export default SuggestedVideo;
