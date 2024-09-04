import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Text, Rect } from 'react-konva';

const Home = () => {
  const [image, setImage] = useState(null);
  const [showText, setShowText] = useState(true);
  const [textPos, setTextPos] = useState({ x: 100, y: 100 });
  const [textSize, setTextSize] = useState(30);
  const [textContent, setTextContent] = useState('Hello Konva'); // Initial text content
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const videoImageRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = 'https://konvajs.org/assets/lion.png';
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const toggleText = () => setShowText(!showText);

  const moveText = (direction) => {
    const step = 10;
    setTextPos((prevPos) => {
      switch (direction) {
        case 'up':
          return { ...prevPos, y: prevPos.y - step };
        case 'down':
          return { ...prevPos, y: prevPos.y + step };
        case 'left':
          return { ...prevPos, x: prevPos.x - step };
        case 'right':
          return { ...prevPos, x: prevPos.x + step };
        default:
          return prevPos;
      }
    });
  };

  const adjustTextSize = (increment) => {
    setTextSize((prevSize) => prevSize + increment);
  };

  const toggleVideoPlayPause = () => {
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      animate();
    }
    setVideoPlaying(!videoPlaying);
  };

  const stopVideo = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setVideoPlaying(false);
  };

  const animate = () => {
    if (videoPlaying && videoRef.current && videoImageRef.current) {
      videoImageRef.current.getLayer().batchDraw();
      requestAnimationFrame(animate);
    }
  };

  const handleTextInputChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleTextInputBlur = () => {
    if (textInputRef.current) {
      textInputRef.current.style.display = 'none'; 
    }
  };

  const handleTextInputFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.style.display = 'block';
      textInputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-row items-start justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col space-y-4 mr-4">
        <button
          onClick={toggleText}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          {showText ? 'Remove Text' : 'Add Text'}
        </button>
        <button
          onClick={toggleVideoPlayPause}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          {videoPlaying ? 'Pause Video' : 'Play Video'}
        </button>
        <button
          onClick={stopVideo}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Stop Video
        </button>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => moveText('up')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Up
          </button>
          <button
            onClick={() => moveText('down')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Down
          </button>
          <button
            onClick={() => moveText('left')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Left
          </button>
          <button
            onClick={() => moveText('right')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Right
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => adjustTextSize(2)}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition"
          >
            Increase Text Size
          </button>
          <button
            onClick={() => adjustTextSize(-2)}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition"
          >
            Decrease Text Size
          </button>
        </div>
      </div>

      <Stage width={window.innerWidth * 0.7} height={window.innerHeight} className="mb-4">
        <Layer>
        
          <Image
            x={300}
            y={50}
            width={300}
            height={200}
            ref={videoImageRef}
            image={videoRef.current}
            draggable
          />
          <Rect
            x={300}
            y={50}
            width={300}
            height={200}
            fill="transparent"
            stroke="black"
            strokeWidth={1}
          />
        </Layer>
        <Layer>
          
          {image && (
            <Image
              image={image}
              draggable
              width={200}
              height={200}
              x={50}
              y={50}
            />
          )}
          {showText && (
            <Text
              text={textContent}
              x={textPos.x}
              y={textPos.y}
              fontSize={textSize}
              fill="black"
              draggable
              onClick={handleTextInputFocus}
            />
          )}
        </Layer>
      </Stage>

      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        style={{ display: 'none' }}
        onPlay={animate}
      />

      <input
        type="text"
        value={textContent}
        onChange={handleTextInputChange}
        onBlur={handleTextInputBlur}
        ref={textInputRef}
        className="absolute top-0 left-0 p-2 border border-gray-300 rounded shadow"
        style={{ display: 'none', zIndex: 1000 }}
      />
    </div>
  );
};

export default Home;
