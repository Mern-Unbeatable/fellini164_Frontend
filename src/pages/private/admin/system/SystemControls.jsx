import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddMemberModal from './components/AddMemberModal';

export default function SystemControls() {


// const [modle, setModle] = useState(false);
//   // const handleOpenModal = () => setModle(true);
//   const handleCloseModal = () => setModle(false);

//   const handleSavePlan = (data) => {
//     console.log("Saved plan:", data);
    
//   };

  const [controls, setControls] = useState({
    maintenance: false,
    newSignups: true,
    aiSafety: true,
  });

  const toggleControl = (key) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };


  

  return (
    <div className="max-w-7xl mx-auto   p-4  md:p-6 my-10 md:my-24 ">
      {/* First Section */}
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-lg px-4 md:px-6 py-4 md:py-12 mb-4 md:mb-10 ">
        <h2 className="text-xl md:text-2xl font-medium  mb-6">System Controls</h2>
        
        <div className="space-y-6">
          {/* Maintenance Mode */}
          {/* <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Maintenance Mode</h3>
              <p className="text-base text-[#6B7280]">Disable access for non-admins.</p>
            </div>
            <button
              onClick={() => toggleControl('maintenance')}
              className={`w-12 h-7 rounded-full transition-colors ${
                controls.maintenance ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  controls.maintenance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />   
            </button>
          </div> */}

          {/* Allow New Signups */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-300 ">Allow New Signups</h3>
              <p className="text-base text-[#6B7280] dark:text-gray-400">Temporary close registration.</p>
            </div>
            <button
              onClick={() => toggleControl('newSignups')}
              className={`w-12 h-7 rounded-full transition-colors ${
                controls.newSignups ? 'bg-purple-500  ' : 'bg-gray-200 dark:bg-zinc-400'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  controls.newSignups ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* AI Safety Filters */}
          {/* <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">AI Safety Filters</h3>
              <p className="text-base text-[#6B7280]">Strict content filtering for AI.</p>
            </div>
            <button
              onClick={() => toggleControl('aiSafety')}
              className={`w-12 h-7 rounded-full transition-colors ${
                controls.aiSafety ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  controls.aiSafety ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div> */}
        </div>
      </div>

      {/* Second Section */}
     {/* <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-10">
  
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
    <h2 className="text-xl md:text-2xl font-medium">
      System Controls
    </h2>

    <button
      onClick={handleOpenModal}
      className="bg-black text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-900 w-full sm:w-auto"
    >
      <Plus size={18} />
      Add Admin
    </button>
  </div>

  <div className="space-y-4">
    {[1, 2].map((item) => (
      <div
        key={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-200 rounded-lg"
      >

        <div className="flex items-start gap-3 sm:gap-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm shrink-0">
            A
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              AI Safety Filters
            </h3>
            <p className="text-sm md:text-base text-gray-500">
              Strict content filtering for AI.
            </p>
          </div>
        </div>

  
        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center sm:items-end gap-2">
          <span className="text-xs md:text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
            Add Admin
          </span>
          <span className="text-xs md:text-sm font-medium text-gray-700">
            Active: Now
          </span>
        </div>
      </div>
    ))}
  </div>
</div> */}


      {/* Third Section */}
      {/* <div className="bg-white rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-medium  mb-6">System Controls</h2>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-2 md:p-4 border border-gray-200 rounded">
              <div>
                <h3 className="text-lg md:text-xl font-normal text-[#6B7280]">Updated User Plan (ID: 123)</h3>
              </div>
              <div className="text-right">
                <p className="text-base font-medium text-gray-900">Super Admin</p>
                <p className="text-base text-[#6B7280]">10 min ago</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
{/* 
      <AddMemberModal open={modle}
          onClose={handleCloseModal}
          onSave={handleSavePlan}/> */}
    </div>
  );
}