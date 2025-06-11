import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import ConfApp from '../appwrite/configuration';

function AllPost() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        ConfApp.getPost([]).then((psts) => {
            if (psts) {
                setPosts(psts.documents);
            }
        });
    }, []);

    return (
        <div className='py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='w-1/4 p-2'>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPost;
