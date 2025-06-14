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

export default AllPost;
