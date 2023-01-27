import React from 'react'

const Admins = ({adminData}) => {
    const details = [
        { title: 'Profile Photo', value: adminData.profile_photo },
        { value: adminData.last},
        { title: 'Email', value: adminData.email },
        // { title: 'Date of Birth', value: userData.date_of_birth }, // '23 January, 1998'
        // { title: 'Gender', value: userData.gender },
        // { title: 'Address 1', value: userData.null },
        // { title: 'Address 2', value: userData.null },
        // { title: 'City', value: userData.null },
        // { title: 'State', value: userData.null },
        // { title: 'Country', value: userData.null },
     ];
  return (
    <div>
         {details.map((detail, i) => (
            <div key={i} className='flex items-center justify-between '>
               <div className='flex-[50%]  font-medium text-slate-400'>
                  {detail.name}
               </div>
               <div className='flex-[50%]  font-medium '>{detail.value}</div>
            </div>
         ))}

    </div>
  )
}

export default Admins