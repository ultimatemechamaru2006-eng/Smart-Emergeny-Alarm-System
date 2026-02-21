import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, Check, User, Phone, Mic, MicOff } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'sos' | 'sending'>('sos');
  const [messagesSent, setMessagesSent] = useState<number[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceRecognized, setVoiceRecognized] = useState(false);

  const contacts = [
    { id: 1, name: 'Dr. Rajesh Kumar', role: 'Primary Doctor', phone: '+91 98765 43210' },
    { id: 2, name: 'Priya Sharma', role: 'Daughter', phone: '+91 98765 43211' },
    { id: 3, name: 'Amit Patel', role: 'Son', phone: '+91 98765 43212' },
    { id: 4, name: 'Neha Singh', role: 'Caregiver', phone: '+91 98765 43213' },
    { id: 5, name: 'Emergency Services', role: '108 Ambulance', phone: '108' },
  ];

  const handleSOSClick = () => {
    setScreen('sending');
    // Simulate sending messages one by one
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        setMessagesSent((prev) => [...prev, contact.id]);
      }, 800 + index * 600);
    });
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceText('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      setVoiceText(transcript);

      // Check for emergency keywords
      const emergencyKeywords = ['help', 'emergency', 'sos', 'alert', 'danger'];
      const hasEmergencyWord = emergencyKeywords.some(keyword => 
        transcript.toLowerCase().includes(keyword)
      );

      if (hasEmergencyWord && event.results[0].isFinal) {
        setVoiceRecognized(true);
        setTimeout(() => {
          handleSOSClick();
        }, 1500);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setVoiceText('Error: Please try again');
    };

    recognition.onend = () => {
      if (!voiceRecognized) {
        setIsListening(false);
        if (!voiceText.includes('Error')) {
          setVoiceText('No emergency detected. Try again.');
        }
      }
    };

    recognition.start();
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
    setVoiceText('');
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Phone Screen Container */}
      <div className="relative w-full max-w-md h-[700px] bg-black rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Screen Content */}
        <div className="relative size-full bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            {screen === 'sos' ? (
              <motion.div
                key="sos-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="size-full flex flex-col items-center justify-center p-8"
              >
                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Emergency Alert
                  </h1>
                  <p className="text-gray-600 text-lg">Mrs. Lakshmi</p>
                </motion.div>

                {/* Voice Recognition Section */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full mb-6"
                >
                  <button
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    disabled={voiceRecognized}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      voiceRecognized
                        ? 'bg-green-500 text-white'
                        : isListening
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                    }`}
                  >
                    {voiceRecognized ? (
                      <>
                        <Check size={24} />
                        Voice Emergency Detected!
                      </>
                    ) : isListening ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <Mic size={24} />
                        </motion.div>
                        Listening...
                      </>
                    ) : (
                      <>
                        <Mic size={24} />
                        Voice Alert
                      </>
                    )}
                  </button>
                  
                  {/* Voice text display */}
                  {voiceText && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-xl text-center ${
                        voiceRecognized
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {voiceRecognized ? '✓ ' : '🎤 '}{voiceText}
                      </p>
                    </motion.div>
                  )}
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Say "Help", "Emergency", or "SOS"
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-3 w-full mb-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* SOS Button */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <motion.button
                    onClick={handleSOSClick}
                    className="relative w-56 h-56 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Pulsing rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500"
                      animate={{
                        scale: [1, 1.2, 1.2, 1],
                        opacity: [0.5, 0, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500"
                      animate={{
                        scale: [1, 1.3, 1.3, 1],
                        opacity: [0.3, 0, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                    
                    {/* Button content */}
                    <div className="relative z-10 text-center">
                      <AlertOctagon size={70} className="text-white mb-3 mx-auto" strokeWidth={2.5} />
                      <p className="text-white text-3xl font-bold tracking-wider">SOS</p>
                    </div>
                  </motion.button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-500 text-center"
                >
                  Tap to send emergency alert
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="sending-screen"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="size-full flex flex-col bg-gradient-to-b from-red-50 to-white"
              >
                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-600 text-white p-6 text-center"
                >
                  <AlertOctagon size={48} className="mx-auto mb-3" />
                  <h2 className="text-2xl font-bold mb-1">Emergency Alert Sent</h2>
                  <p className="text-red-100">Notifying emergency contacts...</p>
                </motion.div>

                {/* Loading bar */}
                <div className="w-full bg-red-200 h-1">
                  <motion.div
                    className="h-full bg-red-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Receiving Alert:
                  </h3>
                  
                  <div className="space-y-3">
                    {contacts.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                          messagesSent.includes(contact.id)
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          messagesSent.includes(contact.id)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}>
                          {messagesSent.includes(contact.id) ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check size={28} className="text-white" strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <User size={24} className="text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={12} />
                            {contact.phone}
                          </p>
                        </div>

                        {messagesSent.includes(contact.id) && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-green-600 font-semibold text-sm"
                          >
                            Sent ✓
                          </motion.div>
                        )}
                        
                        {!messagesSent.includes(contact.id) && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* All sent confirmation */}
                  {messagesSent.length === contacts.length && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 p-4 bg-green-600 text-white rounded-xl text-center"
                    >
                      <Check size={32} className="mx-auto mb-2" strokeWidth={3} />
                      <p className="font-bold text-lg">All alerts delivered!</p>
                      <p className="text-sm text-green-100">Help is on the way</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}