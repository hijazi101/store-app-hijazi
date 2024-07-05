import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Nav from '@/components/Nav';
import app from '@/firebaseconfig'; // Assuming this is correctly configured

const Orders = () => {
  const { data: session } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (session) {
      fetchUserOrders();
    }
  }, [session]);

  const fetchUserOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'),
        where('username', '==', session.user.name),
        where('isDelivered', '==', 0)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      const postsPromises = ordersSnapshot.docs.map(async (orderDoc) => {
        const orderId = orderDoc.id;
        const orderData = orderDoc.data();
        const postId = orderData.itemId;

        // Fetch post details from 'posts' collection
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          return { id: orderId, ...postData };
        } else {
          console.warn(`Post with ID ${postId} not found.`);
          return null;
        }
      });

      const resolvedPosts = await Promise.all(postsPromises);
      const validPosts = resolvedPosts.filter(post => post !== null);

      setUserPosts(validPosts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
    <Nav />
    <div className="bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10">
        {userPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg overflow-hidden border shadow-md">
            <img
              src={post.image}
              alt={post.name}
              className="w-full h-auto object-cover object-center"
              style={{ minHeight: '300px' }} // Adjust the minHeight as needed for layout consistency
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
              <p className="text-gray-600">Price: ${post.price}</p>
              {/* Add more details as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  );
};

export default Orders;
