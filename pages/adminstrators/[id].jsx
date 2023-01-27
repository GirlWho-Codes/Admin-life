import {
   Avatar,
   Button,
   FormControl,
   FormGroup,
   IconButton,
 } from '@mui/material';
 import axios from 'axios';
 import e from 'cors';
 import Image from 'next/image';
 import React, { useEffect, useState } from 'react';
 import { useSelector } from 'react-redux';
 import { toast } from 'react-toastify';
 import {
   DataTable,
   LabelInput,
   Layout,
   Modals,
   SearchBox,
   SVG,
 } from '../../components';
 import Link from 'next/link';
 import { Menu, MenuItem } from '@mui/material';
 
 import { tableSearch } from '../../utils/tableSearch';
 
 /**
 * This is a getServerSideProps function thats help fetch users from server before the page loads
 */
 export async function getServerSideProps() {
   let status, adminData;
   try{
      const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
      const deviceToken = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
 
      const response = await axios.get (
         `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/view-admins`,
         {
            headers: {
               
               Authorization: `Bearer ${bearerToken}`,
               "Device-Token": deviceToken
            }
 
         }
      );
      status = response.status;
      adminData = response.data?.data;
      console.log(response.data)
      
 
   } catch(error) {
         
            status= error.response?.status,
            adminData= null
            // data ={ data: error.response?.statusText },
            console.log(error)
      };
      
      return {
         props: {
            // status,
            adminData,
         },
      };
      
   
   
 }
 
 const Administrator = ({ status, adminData }) => {
   
   const [open, setOpen] = React.useState(false);
   const [firstName, setFirstName] = React.useState('Wale');
   const [lastName, setLastName] = React.useState('Andrew');
   const [phoneNumber, setPhoneNumber] = React.useState('08012345678');
   const [password, setPassword] = React.useState('111111111');
   const [role, setRole] = React.useState('1');
   const [fileOn, setFileOn] = useState(null);
   const [profilePic, setProfilePic] = useState("")
   const [profilePhoto, setProfilePhoto] = React.useState(null);
   const [email, setEmail] = React.useState('waleAn@gmail.com');
   const [gender, setGender] = React.useState('male');
   const [loading, setLoading] = React.useState(false);
   const [searchResult, setSearchResult] = useState([]);
   const searchTerm = useSelector((state) => state.searchTerm);
   
 
   function BasicMenu({ viewLink = '', id = '' }) {
      const [anchorEl, setAnchorEl] = React.useState(null);
 
      const open = Boolean(anchorEl);
 
      const handleClick = (event) => {
         setAnchorEl(event.currentTarget);
      };
 
      const handleClose = () => {
         setAnchorEl(null);
      };
 
 
      const handleDeactivateAccount = async () => {
         setAnchorEl(null);
        
         const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
         const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
         const deviceToken = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
 
         const instance = axios.create({
            baseURL: `${baseUrl}`,
            headers: {
               Authorization: `Bearer ${bearerToken} `,
               "device-token": deviceToken
            }
         });
        
         await instance
            .post(`/api/v1/admin/users/delete/${id}`, {status: 'deactivated'})
            
            .then((res) => {
               console.log(res);
               
               router.replace(router.asPath)
               toast.success('User deactivated successfully');
               
 
               return res.data
               
            })
            .catch((err) => {
               console.log(err);
              
            });
      };
 
      return (
         <div>
            <IconButton
               className='p-2'
               aria-controls={open ? 'basic-menu' : undefined}
               aria-haspopup='true'
               aria-expanded={open ? 'true' : undefined}
               onClick={handleClick}
            >
               <SVG.DotsHambugger />
            </IconButton>
            <Menu
               anchorEl={anchorEl}
               open={open}
               onClose={handleClose}
               MenuListProps={{
                  'aria-labelledby': 'basic-button',
               }}
               sx={{
                  '& .MuiList-root': {
                     padding: 0,
                  },
               }}
            >
               <div className='flex'>
                  <MenuItem onClick={handleClose} className='p-0'>
                     <Link href={viewLink}>
                        <a className='p-4'>
                           <SVG.View />
                        </a>
                     </Link>
                  </MenuItem>
                  <MenuItem onClick={handleDeactivateAccount}>
                     <SVG.Delete />
                  </MenuItem>
                  <MenuItem
                     onClick={() => {
                        handleClose();
                        setModalOpen(true);
 
                        let item = adminData.filter(
                           (item) => item.id === id
                        );
 
                        setFirstName(item[0].first_name);
                        setLastName(item[0].last_name);
                        setGender(item[0].gender.toLowerCase());
                        setPhoneNumber(item[0].phone_number);
                        setEmail(item[0].email);
                        setPassword(item[0].password);
                        setPassword(item[0].role_id);
                        setId(item[0].profile_photo);
                     }}
                  >
                    
                        
                     <SVG.Edit />
                  </MenuItem>
               </div>
            </Menu>
         </div>
      );
   }
 
  
   
 
   
 
   return (
      <Layout title='Administrator'>
         <div className='md:flex md:justify-between md:items-center mb-3 lg:mb-5'>
            <div>
               <h3 className='text-black-80 font-bold text-lg lg:text-2xl xl:text-[32px] tracking-[-0.05em] xl:leading-[48px]'>
                  Admin details
               </h3>
            </div>
                      
         </div>
         <div className="p-5 col-span-1 flex flex-col items-center justify-center gap-5 rounded-xl h-full border-2 border-[#FF4500]">
          <div className='flex flex-row gap-80 items-stretch justify-between'>
             <div>
             <img src="" alt="" />
             <h1>Name</h1>
             </div>
             <div className="">
                <p className=' '>Role</p>
                <h1>Super Admin</h1>
             </div>
          </div>
            </div>
 
            <div className='mt-10 flex flex-col gap-7 flex-[50%]  font-medium text-slate-400'>
             <div className='flex gap-20'>
             <p>Email</p>
             <p>EMail</p>
             </div>
             <div style={{border: '1px solid #ccc'}} />
             
             <div className='flex gap-20'>
             <p>Lorem</p>
             <p>EMail</p>
             </div>
             <div style={{border: '1px solid #ccc'}} />
             
             <div className='flex gap-10'>
             <p>Date Joined</p>
             <p>EMail</p>
             </div>
             <div style={{border: '1px solid #ccc'}} />
             
             <div className='flex gap-11 '>
             <p>Priviledges</p>
             <p>EMail</p>
             </div>
             
            </div>
           
 
         
      </Layout>
   );
 };
 
 export default Administrator;
 
 