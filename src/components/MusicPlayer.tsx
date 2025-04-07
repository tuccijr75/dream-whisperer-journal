
import { useMusicPlayer } from "./audio/useMusicPlayer";
import VolumeControl from "./audio/VolumeControl";
import AudioUploader from "./audio/AudioUploader";
import { AMBIENT_AUDIO_ID } from "./audio/constants";

const MusicPlayer = () => {
  const {
    isPlaying,
    isAudioInitialized,
    showUploader,
    togglePlay,
    toggleUploader,
    handleCustomAudioUpload,
  } = useMusicPlayer();

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <VolumeControl
          audioId={AMBIENT_AUDIO_ID}
          isPlaying={isPlaying} 
          onPlayStateChange={togglePlay}
          initialVolume={30}
        />
        
        <AudioUploader
          isActive={showUploader}
          onToggle={toggleUploader}
          onFileSelected={handleCustomAudioUpload}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
