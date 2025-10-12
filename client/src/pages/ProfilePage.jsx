import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'  

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState("Nabadeep Das")
  const [bio, setBio] = useState("Hey, welcome to Messeger!")


  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg p-6'>
        
   
        <form onSubmi={handleSubmit} className="flex flex-col gap-5 flex-1">
          <h3 className="text-lg font-semibold text-white">Profile Details</h3>

         
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input 
              onChange={(e) => setSelectedImg(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.png, .jpg, .jpeg' 
              hidden 
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} 
              alt="avatar" 
              className={`w-12 h-12 object-cover ${selectedImg ? 'rounded-full' : ''}`} 
            />
            <span className='text-sm text-gray-200'>Upload profile picture</span>
          </label>

          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
          />

          
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
          />

          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="py-2 px-4 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md text-white font-medium hover:opacity-90 transition"
          >
            Save & Continue
          </button>
        </form>

        
        <div className="flex flex-col items-center gap-4 p-6">
          <img 
            src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
            alt="Profile Preview"
            className='w-24 h-24 rounded-full object-cover border border-gray-500'
          />
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-gray-300 text-sm text-center">{bio}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
