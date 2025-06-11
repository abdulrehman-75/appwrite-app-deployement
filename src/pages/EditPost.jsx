import React, { useEffect, useState } from 'react';
import { Container, PostForm } from '../components';
import ConfApp from '../appwrite/configuration';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            ConfApp.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    navigate('/');
                }
            });
        }
    }, [slug, navigate]);

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;
