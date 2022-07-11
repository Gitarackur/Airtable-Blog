import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import airtable from '../../airtable';
import LoadingText from '../Loading/LoadingText';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ErrorText from '../Loading/ErrorText';


const PostView = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [singlePost, setSinglePost] = useState<any>(null)
  const [loadingApiState, setloadingApiState] = useState<boolean>(false)

  const { id } = useParams();
  let navigate = useNavigate();

  const deletePost = async()=> {
    const postId = []
    postId.push(id)
    setloadingApiState(true)
    airtable.deleteBlog(postId, (record:any, error:any)=>{
      if(record){
        navigate(`/`)
      }
      if(error){

      }
      setloadingApiState(false)
    })
    setLoading(false)
  }

  useEffect(()=>{
    setLoading(true)
    airtable.getSingleBlogPost(id as string, (records:any, error:any)=>{
      if(records){
        setSinglePost(records)
      }
      if(error){

      }
      setLoading(false)
    });
  }, [])

  return (
    <div>
      <div>
        <div className="flex items-center justify-between py-10 md:py-6" >
          <div className='py-10 md:py-20'>
            <div className=''>
              <a className='cursor-pointer' onClick={() => navigate(-1)}> BACK </a>
            </div>
          </div>

          <div className=''>
            <Link to={"/"} className='heading-text'>Airtable Blog</Link>
          </div>
        </div>


        {
          !loading ? (
            singlePost ? (
              <div className=''>
                <div className='flex items-center justify-end mb-10 md:mb-20 -mx-2'>
                  <div className='px-2'>
                    <Link to={`/posts/${id}/edit`} className='route-link py-5 px-3'> Update Post </Link>
                  </div>
                  
                  <div className='px-2'>
                    <button 
                        className='inline-block w-full py-5 px-3' 
                        onClick={deletePost}
                        disabled={loadingApiState ? true: false}
                        style={{ opacity : loadingApiState ? '0.5': '1' }}
                      > 
                      { loadingApiState ? <><span>loading...</span></>: <><span>Delete Post </span></>}
                      </button>
                  </div>
                </div>

                <div className=''>
                  <div className='relative inline-block w-full'>
                    <div className='blog-thumbnail p-20'></div>
                    <p className='mt-8' style={{ color: "#ccc" }}>
                      created at: { new Date(singlePost?.fields?.CreatedAt).toUTCString() }
                    </p>
                    <div className='mt-20'>
                      <h1 className='heading-text'>
                        { singlePost?.fields?.Name }
                      </h1>
                      <div className='mt-8'>
                        <div>
                          <ReactMarkdown
                            className="prose"
                            remarkPlugins={[gfm]}
                            rehypePlugins={[rehypeRaw]}
                            children={singlePost?.fields?.post}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ):(
              <ErrorText />
            )
          ):(
            <LoadingText />
          )
        }
      </div>
    </div>
  );
}

export default PostView;
