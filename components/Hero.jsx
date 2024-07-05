"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Toast from '@/components/Toast'; 
import app from '@/firebaseconfig';
import { collection, getDocs, getFirestore, query, where, orderBy,doc ,updateDoc ,deleteDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AddToCartButton = () => {
  const router = useRouter();
  
  const handleAddCart = (e) => {
    e.preventDefault();
    // Your logic here
    router.push('/Addtocart'); // Replace with your navigation path
  };
  
  return (
    <button
      className="bg-green-500 w-full p-1 mt-1 rounded-md text-white"
      onClick={handleAddCart}
    >
      Add To Cart
    </button>
  );
};

const Hero = () => {
  const { data: session } = useSession(); // Retrieve session data from NextAuth
  const [userPost, setUserPost] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false); // Moved state inside Hero component
  const [toastMessage, setToastMessage] = useState(''); // Moved state inside Hero component
  const [editingPost, setEditingPost] = useState(null); // Assuming you have defined this state elsewhere
  const [editData, setEditData] = useState({ name: '', price: '', image: '' }); // Assuming you have defined this state elsewhere
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = async () => {
    const q = query(collection(db, "posts"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPost(posts);
  };

  const handleSearch = async () => {
    let q;
    if (searchTerm.trim() === '') {
      q = query(collection(db, "posts"), orderBy("name"));
    } else {
      q = query(collection(db, "posts"), where("name", ">=", searchTerm.trim()), orderBy("name"));
    }
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPost(posts);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (value.trim() === '') {
      getUserPost(); // Show all items when search input is empty
    } else {
      handleSearch(); // Trigger search when typing
    }
  };

  const onDeletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    setToastMessage('Item Deleted Successfully'); // Set the toast message
    setShowToast(true); // Show toast notification
    setTimeout(() => setShowToast(false), 3000);
    window.location.reload();
  };

  const onEditPost = (post) => {
    setEditingPost(post.id);
    setEditData({ name: post.name, price: post.price, image: post.image })
    setToastMessage('Edit Mode Activated'); // Set the toast message
    setShowToast(true); // Show toast notification
    setTimeout(() => setShowToast(false), 3000); 
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const postRef = doc(db, "posts", editingPost);
    await updateDoc(postRef, editData);
    setToastMessage('Item Edited Successfully'); // Set the toast message
    setShowToast(true); // Show toast notification
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    setEditingPost(null);
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div>
        <form className="max-w-md mx-auto">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." onChange={handleChange} />
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e) => { e.preventDefault(); handleSearch(); }}>Search</button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10">
        {userPost.map((post) => (
          <div key={post.id} className="bg-white rounded-lg overflow-hidden border shadow-md">
            <img src={post.image} alt={post.name} className="w-full h-40 object-cover" style={{ minHeight: '300px' }} />
          
            <div className="p-4">
              {editingPost === post.id ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="image"
                    value={editData.image}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Image URL"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 w-full p-1 mt-1 rounded-md text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 w-full p-1 mt-1 rounded-md text-white"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
                  <p className="text-gray-600">${post.price}</p>
                  <div className="p-4">
                     <AddToCartButton />
                       </div>
                  {session && session.user.name === "Xox Xox" ? (
                    <>
                      <button
                        className="bg-gray-500 w-full p-1 mt-1 rounded-md text-white"
                        onClick={() => onEditPost(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 w-full p-1 mt-1 rounded-md text-white"
                        onClick={() => onDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Hero;
