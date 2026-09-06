import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const alternativesRef = useRef([]);
  const processIntentRef = useRef(null);

  const { backendUrl, navigate, products, addToCart, token } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        let currentTranscript = '';
        const alts = [];
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            for (let j = 0; j < event.results[i].length; j++) {
              alts.push(event.results[i][j].transcript);
            }
          }
        }
        transcriptRef.current = currentTranscript;
        if (alts.length > 0) alternativesRef.current = alts;
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        let errorMessage = "Speech recognition error occurred.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "No microphone was found. Ensure it is plugged in.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access was denied. Please allow access in browser settings.";
            break;
          case 'network':
            errorMessage = "Network error. Speech recognition may require an internet connection.";
            break;
          case 'aborted':
            errorMessage = "Speech recognition was aborted.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        console.warn(errorMessage);
        setResponse(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcriptRef.current && processIntentRef.current) {
          processIntentRef.current(transcriptRef.current, alternativesRef.current);
          transcriptRef.current = '';
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition is not supported in this browser.");
    }
  }, []);

  const VALID_ROUTES = ['/', '/collection', '/about', '/contact', '/login', '/cart', '/place-order', '/orders'];

  const processIntent = async (text, alternatives) => {
    setIsProcessing(true);
    try {
      const payload = { text };
      if (alternatives && alternatives.length > 1) {
        payload.alternatives = alternatives;
      }

      const res = await axios.post(backendUrl + '/api/ai/intent', payload);

      if (res.data.success && res.data.intent) {
        const intent = res.data.intent;
        speakResponse(intent.reply || "Done.");
        executeAction(intent);
      } else {
        speakResponse(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Intent API error:", error);
      if (error.response && error.response.status === 429) {
        speakResponse("I am receiving too many requests. Please wait a moment and try again.");
      } else {
        speakResponse("Sorry, I could not process your request right now.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processIntentRef.current = processIntent;
  }, [processIntent]);

  const executeAction = (intent) => {
    switch (intent.action) {
      case 'NAVIGATE':
        if (intent.target && VALID_ROUTES.includes(intent.target)) {
          setTimeout(() => navigate(intent.target), 600);
        }
        break;

      case 'SEARCH': {
        const params = new URLSearchParams();
        if (intent.query) params.set('query', intent.query);
        if (intent.category) params.set('category', intent.category);
        if (intent.subCategory) params.set('subCategory', intent.subCategory);
        if (intent.priceMin != null) params.set('priceMin', String(intent.priceMin));
        if (intent.priceMax != null) params.set('priceMax', String(intent.priceMax));
        if (intent.sort) params.set('sort', intent.sort);
        const qs = params.toString();
        setTimeout(() => navigate(`/collection${qs ? '?' + qs : ''}`), 600);
        break;
      }

      case 'ADD_TO_CART': {
        const match = location.pathname.match(/^\/product\/(.+)$/);
        if (!match) {
          speakResponse("Please open a product first, then ask me to add it to your cart.");
          return;
        }
        if (!token) {
          speakResponse("Please log in first to add items to your cart.");
          setTimeout(() => navigate('/login'), 600);
          return;
        }
        const productId = match[1];
        const product = products.find(p => p._id === productId);
        if (!product) {
          speakResponse("I could not find this product.");
          return;
        }
        if (product.sizes && product.sizes.length > 0) {
          const requestedSize = intent.size ? intent.size.toUpperCase() : null;
          if (!requestedSize) {
            speakResponse(`Please specify a size. Available sizes are ${product.sizes.join(', ')}.`);
            return;
          }
          const validSize = product.sizes.find(s => s.toUpperCase() === requestedSize);
          if (!validSize) {
            speakResponse(`Size ${requestedSize} is not available. Available sizes are ${product.sizes.join(', ')}.`);
            return;
          }
          addToCart(productId, validSize);
          speakResponse(`Added ${product.name} in size ${validSize} to your cart.`);
        } else {
          addToCart(productId, 'default');
          speakResponse(`Added ${product.name} to your cart.`);
        }
        break;
      }

      case 'GET_LATEST_ORDER': {
        if (!token) {
          speakResponse("Please log in to check your orders.");
          setTimeout(() => navigate('/login'), 600);
          return;
        }
        fetchLatestOrder();
        break;
      }

      default:
        break;
    }
  };

  const fetchLatestOrder = async () => {
    try {
      const res = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (res.data.success && res.data.orders && res.data.orders.length > 0) {
        const latest = res.data.orders[res.data.orders.length - 1];
        speakResponse(`Your latest order status is ${latest.status}.`);
      } else {
        speakResponse("You don't have any orders yet.");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      speakResponse("Sorry, I could not fetch your order information right now.");
    }
  };

  const speakResponse = (text) => {
    setResponse(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      transcriptRef.current = '';
      alternativesRef.current = [];
      recognitionRef.current?.start();
      setIsListening(true);
      setIsOpen(true);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen && isListening) {
      toggleListening();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Assistant Popup */}
      {isOpen && (
        <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-80 mb-4 p-4 transition-all duration-300">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">AI Assistant</h3>
            <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="min-h-32 flex flex-col gap-3 justify-end">
            {transcript && (
              <div className="bg-gray-100 p-3 rounded-2xl rounded-br-sm self-end max-w-[85%] text-sm text-gray-800 shadow-sm border border-gray-100">
                {transcript}
              </div>
            )}
            
            {response && (
              <div className="bg-black text-white p-3 rounded-2xl rounded-bl-sm self-start max-w-[85%] text-sm shadow-md">
                {response}
              </div>
            )}
            
            {!transcript && !response && (
              <div className="text-gray-500 text-sm text-center my-6">
                {isListening ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                    </span>
                    Listening...
                  </span>
                ) : isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </span>
                ) : (
                  "Click the microphone to speak"
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleListening}
        disabled={isProcessing}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 border-transparent ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse border-red-200' 
              : 'bg-black hover:bg-gray-800'
        }`}
        aria-label="Voice Assistant"
      >
        {isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;
