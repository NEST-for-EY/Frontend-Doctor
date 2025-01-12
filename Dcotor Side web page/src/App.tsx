import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar as CalendarIcon, 
  FileText, 
  Send, 
  User2,
  Bot,
  LineChart,
  Droplets,
  Wind,
  History,
  Plus,
  Users
} from 'lucide-react';

// Mock data for initial render
const INITIAL_PATIENT_DATA = {
  1: {
    heartRate: "120",
    bloodPressure: "160/100",
    temperature: "102.5",
    oxygenLevel: "92",
    airQuality: "85",
    humidity: "70"
  },
  2: {
    heartRate: "115",
    bloodPressure: "150/95",
    temperature: "101.2",
    oxygenLevel: "94",
    airQuality: "88",
    humidity: "68"
  },
  3: {
    heartRate: "110",
    bloodPressure: "145/90",
    temperature: "100.8",
    oxygenLevel: "95",
    airQuality: "90",
    humidity: "65"
  },
  4: {
    heartRate: "85",
    bloodPressure: "135/85",
    temperature: "99.5",
    oxygenLevel: "96",
    airQuality: "92",
    humidity: "62"
  }
};

// Severity thresholds for patient classification
const SEVERITY_THRESHOLDS = {
  RED: {
    heartRate: 110,
    systolicBP: 140,
    temperature: 101,
    oxygenLevel: 94
  },
  YELLOW: {
    heartRate: 100,
    systolicBP: 130,
    temperature: 99.5,
    oxygenLevel: 96
  }
};

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);
  const [view, setView] = useState('patients');
  const [doctorHistory, setDoctorHistory] = useState([
    "January 10, 2024 - Conducted virtual consultations with 5 patients",
    "January 9, 2024 - Updated treatment plans for chronic patients",
    "January 8, 2024 - Emergency consultation for Patient #7",
    "January 7, 2024 - Reviewed lab results for 3 patients",
    "January 6, 2024 - Conducted follow-up appointments"
  ]);

  // Calculate patient severity
  const calculateSeverity = (data) => {
    if (!data) return 'green';
    
    const heartRate = parseInt(data.heartRate);
    const systolicBP = parseInt(data.bloodPressure?.split('/')[0]);
    const temperature = parseFloat(data.temperature);
    const oxygenLevel = parseInt(data.oxygenLevel);

    if (
      heartRate >= SEVERITY_THRESHOLDS.RED.heartRate ||
      systolicBP >= SEVERITY_THRESHOLDS.RED.systolicBP ||
      temperature >= SEVERITY_THRESHOLDS.RED.temperature ||
      oxygenLevel <= SEVERITY_THRESHOLDS.RED.oxygenLevel
    ) {
      return 'red';
    }

    if (
      heartRate >= SEVERITY_THRESHOLDS.YELLOW.heartRate ||
      systolicBP >= SEVERITY_THRESHOLDS.YELLOW.systolicBP ||
      temperature >= SEVERITY_THRESHOLDS.YELLOW.temperature ||
      oxygenLevel <= SEVERITY_THRESHOLDS.YELLOW.oxygenLevel
    ) {
      return 'yellow';
    }

    return 'green';
  };

  // Group patients by severity
  const groupedPatients = Object.entries(patientData).reduce((acc, [id, data]) => {
    const severity = calculateSeverity(data);
    if (!acc[severity]) acc[severity] = [];
    acc[severity].push({ id, data });
    return acc;
  }, { red: [], yellow: [], green: [] });

  const openGoogleCalendar = () => {
    window.open('https://calendar.google.com', '_blank');
  };

  const renderPatientList = () => (
    <div className="space-y-4">
      {/* Red severity patients */}
      <div className="bg-red-100 p-4 rounded-xl">
        <h3 className="text-red-700 font-semibold mb-2">Critical Attention Required</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {groupedPatients.red.map(({ id, data }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedPatient(id);
                setView('dashboard');
              }}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2">
                <User2 className="text-red-500" />
                <span>Patient {id}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Yellow severity patients */}
      <div className="bg-yellow-100 p-4 rounded-xl">
        <h3 className="text-yellow-700 font-semibold mb-2">Moderate Attention</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {groupedPatients.yellow.map(({ id, data }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedPatient(id);
                setView('dashboard');
              }}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2">
                <User2 className="text-yellow-500" />
                <span>Patient {id}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Green severity patients */}
      <div className="bg-green-100 p-4 rounded-xl">
        <h3 className="text-green-700 font-semibold mb-2">Stable</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {groupedPatients.green.map(({ id, data }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedPatient(id);
                setView('dashboard');
              }}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2">
                <User2 className="text-green-500" />
                <span>Patient {id}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const data = patientData[selectedPatient];
    if (!data) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient #{selectedPatient}</h2>
            <p className="text-gray-600">ID: #{String(selectedPatient).padStart(5, '0')}</p>
          </div>
          <div className="bg-emerald-100 p-4 rounded-full">
            <User2 size={32} className="text-emerald-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Activity className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Heart Rate</h3>
            <p className="text-2xl text-blue-600">{data.heartRate} BPM</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <LineChart className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Blood Pressure</h3>
            <p className="text-2xl text-blue-600">{data.bloodPressure}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Activity className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Temperature</h3>
            <p className="text-2xl text-blue-600">{data.temperature}°F</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Activity className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Oxygen Level</h3>
            <p className="text-2xl text-blue-600">{data.oxygenLevel}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Wind className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Air Quality</h3>
            <p className="text-2xl text-blue-600">{data.airQuality}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <Droplets className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Humidity</h3>
            <p className="text-2xl text-blue-600">{data.humidity}%</p>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Doctor's History</h2>
      <div className="space-y-3">
        {doctorHistory.map((entry, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );

  const renderNew = () => (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">New Entry</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Patient Name" 
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
        <textarea 
          placeholder="Notes" 
          className="w-full p-3 border border-gray-200 rounded-lg h-32"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Entry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Navigation Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setView('patients')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Users />
            <span>Patient List</span>
          </button>
          <button 
            onClick={openGoogleCalendar}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <CalendarIcon />
            <span>Calendar</span>
          </button>
          <button 
            onClick={() => setView('history')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <History />
            <span>History</span>
          </button>
          <button 
            onClick={() => setView('new')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Plus />
            <span>New</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User2 className="text-blue-600" />
          </div>
          <span className="font-semibold">Dr. Sarah Johnson</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        {view === 'patients' && renderPatientList()}
        {view === 'dashboard' && renderDashboard()}
        {view === 'history' && renderHistory()}
        {view === 'new' && renderNew()}
      </div>
    </div>
  );
}

export default App;