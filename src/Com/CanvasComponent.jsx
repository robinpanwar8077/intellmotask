import  { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import 'tailwindcss/tailwind.css';

const KonvaCanvas = () => {
  const stageRef = useRef(null);
  const [textVisible, setTextVisible] = useState(false);
  const [textSize, setTextSize] = useState(30);
  const [textContent, setTextContent] = useState('Hello Konva');
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
  const [videoPlaying, setVideoPlaying] = useState(false);

  const inputRef = useRef(null);
  const textRef = useRef(null);
  const transformerRef = useRef(null);
  const layerRef = useRef(null);
  const videoRef = useRef(null);

  const handleTextToggle = () => {
    setTextVisible(prevVisible => {
      const newVisible = !prevVisible;
      if (newVisible) {
        const text = new Konva.Text({
          text: textContent,
          x: textPosition.x,
          y: textPosition.y,
          fontSize: textSize,
          fill: 'black',
          draggable: true,
        });
        const transformer = new Konva.Transformer({
          nodes: [text],
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        });
        layerRef.current.add(text);
        layerRef.current.add(transformer);
        textRef.current = text;
        transformerRef.current = transformer;

        text.on('dragmove', () => {
          setTextPosition({
            x: text.x(),
            y: text.y()
          });
        });

        text.on('click', () => {
          if (inputRef.current) {
            inputRef.current.style.left = `${text.x()}px`;
            inputRef.current.style.top = `${text.y()}px`;
            inputRef.current.style.width = `${text.width()}px`;
            inputRef.current.style.height = 'auto';
            inputRef.current.style.fontSize = `${text.fontSize()}px`;
            inputRef.current.style.display = 'block';
            inputRef.current.focus();
          }
        });

        layerRef.current.batchDraw();
      } else {
        textRef.current?.destroy();
        transformerRef.current?.destroy();
        layerRef.current.batchDraw();
      }
      return newVisible;
    });
  };

  const moveText = (direction) => {
    const step = 10;
    setTextPosition(prevPos => {
      const newPos = { ...prevPos };
      switch (direction) {
        case 'up':
          newPos.y -= step;
          break;
        case 'down':
          newPos.y += step;
          break;
        case 'left':
          newPos.x -= step;
          break;
        case 'right':
          newPos.x += step;
          break;
        default:
          break;
      }
      if (textRef.current) {
        textRef.current.position(newPos);
        transformerRef.current?.nodes([textRef.current]);
        layerRef.current.batchDraw();
      }
      return newPos;
    });
  };

  const handlePlayPause = () => {
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setVideoPlaying(!videoPlaying);
  };

  const handleStop = () => {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setVideoPlaying(false);
  };

  const handleInputChange = (e) => {
    setTextContent(e.target.value);
    textRef.current?.text(e.target.value);
    layerRef.current?.batchDraw();
  };

  const handleInputBlur = () => {
    if (textRef.current) {
      textRef.current.text(inputRef.current.value);
      layerRef.current?.batchDraw();
    }
    inputRef.current.style.display = 'none';
  };

  useEffect(() => {
    const stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth * 0.7,
      height: window.innerHeight,
    });
    stageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);
    layerRef.current = layer;

    const imageObj = new Image();
    imageObj.onload = function() {
      const konvaImage = new Konva.Image({
        image: imageObj,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        draggable: true,
      });
      const transformer = new Konva.Transformer({
        nodes: [konvaImage],
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      });
      layer.add(konvaImage);
      layer.add(transformer);
      layer.batchDraw();
    };
    imageObj.src = 'https://konvajs.org/assets/lion.png';

    const videoElement = document.createElement('video');
    videoElement.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    videoElement.width = 300;
    videoElement.height = 200;
    videoElement.style.display = 'none';
    videoElement.autoplay = false;
    videoElement.controls = false;
    const konvaVideo = new Konva.Image({
      image: videoElement,
      x: 300,
      y: 50,
      width: 300,
      height: 200,
      draggable: true,
    });
    layer.add(konvaVideo);
    layer.batchDraw();
    videoRef.current = videoElement;

    document.getElementById('toggleText').onclick = handleTextToggle;
    document.getElementById('playPauseBtn').onclick = handlePlayPause;
    document.getElementById('stopBtn').onclick = handleStop;

    document.getElementById('moveUp').onclick = () => moveText('up');
    document.getElementById('moveDown').onclick = () => moveText('down');
    document.getElementById('moveLeft').onclick = () => moveText('left');
    document.getElementById('moveRight').onclick = () => moveText('right');

    document.getElementById('increaseTextSize').onclick = () => {
      setTextSize(prevSize => {
        const newSize = prevSize + 2;
        if (textRef.current) {
          textRef.current.fontSize(newSize);
          layerRef.current?.batchDraw();
        }
        return newSize;
      });
    };

    document.getElementById('decreaseTextSize').onclick = () => {
      setTextSize(prevSize => {
        const newSize = prevSize - 2;
        if (textRef.current) {
          textRef.current.fontSize(newSize);
          layerRef.current?.batchDraw();
        }
        return newSize;
      });
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('blur', handleInputBlur);
      input.addEventListener('input', handleInputChange);
    }

    return () => {
      stage.destroy();
      if (input) {
        input.removeEventListener('blur', handleInputBlur);
        input.removeEventListener('input', handleInputChange);
      }
    };
  }, [textContent, textSize, textPosition, videoPlaying]);

  return (
    <div className="flex">
      <div className="w-1/4 p-4 border-r border-gray-300">
        <div className="space-y-2">
          <button
            id="toggleText"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Toggle Text
          </button>
          <button
            id="playPauseBtn"
            className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            Play/Pause Video
          </button>
          <button
            id="stopBtn"
            className="w-full px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
          >
            Stop Video
          </button>
          <div className="space-y-2">
            <button
              id="moveUp"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
            >
              Move Text Up
            </button>
            <button
              id="moveDown"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
            >
              Move Text Down
            </button>
            <button
              id="moveLeft"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
            >
              Move Text Left
            </button>
            <button
              id="moveRight"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
            >
              Move Text Right
            </button>
          </div>
          <div className="space-y-2">
            <button
              id="increaseTextSize"
              className="w-full px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
            >
              Increase Text Size
            </button>
            <button
              id="decreaseTextSize"
              className="w-full px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
            >
              Decrease Text Size
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={textContent}
          onChange={handleInputChange}
          className="absolute border border-gray-300 rounded p-2 bg-white"
          style={{ display: 'none', zIndex: 1000, position: 'absolute' }}
        />
      </div>
      <div className="flex-1 p-4">
        <div id="container" className="w-full h-full bg-gray-100"></div>
      </div>
    </div>
  );
};

export default KonvaCanvas;
