import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ConfApp from '../appwrite/configuration';
import { PostCard, Container } from '../components';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get authentication status from Redux store with proper selectors
    const authStatus = useSelector((state) => {
        console.log('Auth selector called, state.auth:', state.auth);
        return state.auth?.status || false;
    });
    const userData = useSelector((state) => state.auth?.userData || null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check if user is authenticated
                if (!authStatus) {
                    // For public home page, don't fetch posts - just show welcome message
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                // User is authenticated, fetch posts
                const response = await ConfApp.listPosts([]);
                
                if (response && response.documents) {
                    setPosts(response.documents);
                } else {
                    setPosts([]);
                }
                
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message || "Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [authStatus]); // Re-run when auth status changes

    if (loading) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='w-full py-2'>
                            <h1 className='text-2xl font-bold'>
                                Loading posts...
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='w-full py-2'>
                            <h1 className='text-2xl font-bold text-red-600'>
                                Error loading posts: {error}
                            </h1>
                            {!authStatus && (
                                <p className='mt-2 text-gray-600'>
                                    Please log in to view posts
                                </p>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Show login prompt for unauthenticated users
    if (!authStatus) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='w-full py-2'>
                            <h1 className='text-2xl font-bold'>
                                Welcome to the blog-appwrite project
                            </h1>
                             <p className='mt-4 text-gray-600'>
                                Please signup if you are new
                            </p>
                            <p className='mt-4 text-gray-600'>
                                 Login to view and create posts
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='w-full py-2'>
                            <h1 className='text-2xl font-bold hover:text-gray-500'>
                                No posts available yet
                            </h1>
                            <p className='mt-2 text-gray-600'>
                                Be the first to create a post!
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
      <div className='w-full py-8'>
    <Container>
        <div className='flex flex-wrap'>
            {posts.map((post) => (
                <div key={post.$id} className='w-1/2 p-2 sm:w-1/3 md:w-1/4'>
                    <PostCard {...post} />
                </div>
            ))}
        </div>
    </Container>
</div>

    );
}

export default Home;