import { IconButton, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ToyAvatar from '../../assets/img/toy-avatar.png';
import {
   LabelInput,
   Layout,
   Modals,
   SubPageHeader,
   SVG,
} from '../../components';
import { DataTable } from '../../components/Table';
import { tableSearch } from '../../utils/tableSearch';
import LoadingState from '../../components/LoadingState';
import Router, { useRouter } from 'next/router';


/**
 * This is a getServerSideProps function thats help fetch users from server before the page loads
 */
export async function getServerSideProps() {
   const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
      const deviceToken = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      
      const res = await axios.get(
               `${baseUrl}/api/v1/admin/users`,
               {
                  headers: {
                     Authorization: `Bearer ${bearerToken}`,
                     "device-token": deviceToken
                  }
               }
               
            )
            .then((res) => {
              
               return{
                 
                  props: {
                     userData: res.data?.data
                  }
                  
               }
               
            })
            .catch((error) => {
             
               return{
                  props: {
                     userData: null
                  }
               }
            });
            
            return res
            
  
}


export default function Users({userData}) {
   const router= useRouter()
   console.log(userData)
   const [searchResult, setSearchResult] = useState([]);
   const [modalOpen, setModalOpen] = React.useState(false);
   const [loading, setLoading] = React.useState(false);
   const [username, setUsername] = React.useState('Wale');
   const [firstName, setFirstName] = React.useState('Wale');
   const [lastName, setLastName] = React.useState('Andrew');
   const [phoneNumber, setPhoneNumber] = React.useState('08012345678');
   const [email, setEmail] = React.useState('waleAn@gmail.com');
   const [gender, setGender] = React.useState('male');
   const [id, setId] = React.useState();
   const [success, setSuccess] = useState(false);
   const [data, setData] = useState();
   const [selected, setSelected] = useState();
   const [edited, setEdited] = useState();
   const searchTerm = useSelector((state) => state.searchTerm);
   const [loadingState, setLoadingState] = useState(true);

   /** function to handle each user actions  */
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
         setLoadingState(true)
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
               setLoadingState(true)
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

                        let user = userData.users.filter(
                           (user) => user.id === id
                        );

                        setUsername(user[0].username);
                        setFirstName(user[0].first_name);
                        setLastName(user[0].last_name);
                        setPhoneNumber(user[0].phone_number);
                        setEmail(user[0].email);
                        setGender(user[0].gender.toLowerCase());
                        setId(user[0].id);
                     }}
                  >
                    
                        
                     <SVG.Edit />
                  </MenuItem>
               </div>
            </Menu>
         </div>
      );
   }

   /** Datagrid columns data */
   const columns = useMemo(
      () => [
         {
            Header: 'Name',
            accessor: 'name',
            Cell: ({ value }) => (
               <div className='flex justify-start items-center gap-2'>
                  <span className='py-2 w-[2.5rem]'>
                     <Image
                        src={ToyAvatar}
                        className='w-full'
                        alt='toy avatar'
                     />
                  </span>
                  <span>{value}</span>
               </div>
            ),
         },
         {
            Header: 'Email',
            accessor: 'email',
         },
         {
            Header: 'Phone Number',
            accessor: 'phone',
         },
         
         // {
         //    Header: 'Last active',
         //    accessor: 'last_active',
         // },
         {
            Header: 'Date joined',
            accessor: 'date',
         },
         {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ value }) => (
               <BasicMenu id={value} viewLink={`/users/${value}`} />
            ),
         },
      ],
      []
   );

   /**
    * Datagrid row data
    */
   let rows;
   // check if agentsData is an array
   console.log(userData.users)
   if (typeof userData === 'object' &&
   userData.users &&
   Array.isArray(userData.users)) {
      rows = userData?.users.map((item) => {
         return {
            name: item.name,
            email: item.email,
            phone: item.phone_number,
            // last_active: null, //'Today, 2:14pm',
            date: item.registration_date, // '08-Oct-2022 12:46PM';
            action: item.id,
         };
        
      }
      );
   } else {
      rows = [];
   }
   console.log(rows)

   
   /** This function handles the edit user */
   const handleEditUser = async () => {
      setLoading(true);

      console.log(
         username,
         firstName,
         lastName,
         phoneNumber,
         email,
         gender,
         id
      );
      
      const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
      const deviceToken = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
      const instance = axios.create({
         baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
         headers: {
            Authorization: `Bearer ${bearerToken}`,
            "device-token": deviceToken
         }
      });
      const data = {
         username,
         first_name: firstName,
         last_name: lastName,
         phone_number: phoneNumber,
         email,
         gender,
         id
      };
      await instance
      .post(`/api/v1/admin/users/edit/${id}`, data)
      .then((res) => {
         console.log(res.data);
         setLoading(false);
         setModalOpen(false);
         
          setLoadingState(true)
          toast.success("User Updated Successfully");
         router.replace(router.asPath)
          return res.data
      })
      .catch((err) => {
         setLoading(false);
         setModalOpen(false);
         console.log(err);
         toast.error(err.response?.data.message);
         
      });  
      
      
   };

   
   // console.log(editData)
   /* UseEffect */
   useEffect(() => {
      if (!searchTerm) return;

      const result = tableSearch({
         searchTerm,
         dataList: userData?.users,
      });
      setSearchResult(result);
   }, [userData?.users, searchTerm]);

   return (
      
      <Layout title={'Users'}>
         <SubPageHeader label={'Users'} />

         <div className='w-full py-5'>
            
            <DataTable
               columns={columns}
               data={searchTerm ? searchResult : rows}
            />
         </div>

         {/* Modal */}
         <Modals
            open={modalOpen}
            setOpen={setModalOpen}
            loading={loading}
            title='Edit User'
            buttonLabel='Edit User'
            onClick={handleEditUser}
         >
            <>
               <LabelInput
                  label='username'
                  placeholder='Username'
                  value={username}
                  setState={setUsername}
               />
               <div className='grid sm:grid-cols-2 gap-3.5 sm:gap-5'>
                  <LabelInput
                     label='First name'
                     placeholder='First name'
                     value={firstName}
                     setState={setFirstName}
                  />
                  <LabelInput
                     label='Last name'
                     placeholder='Last name'
                     value={lastName}
                     setState={setLastName}
                  />
               </div>

               <LabelInput
                  label='Gender'
                  combo
                  menuItems={['Male', 'Female']}
                  setState={setGender}
                  value={gender}
                  hasValue
               />
               <LabelInput
                  label='Phone Number'
                  type='tel'
                  placeholder='+2348012345678'
                  value={phoneNumber}
                  setState={setPhoneNumber}
               />

               <LabelInput
                  label='Email'
                  type='email'
                  placeholder='example@lifesaver.com'
                  value={email}
                  setState={setEmail}
               />
            </>
         </Modals>
      </Layout>
   );
}
