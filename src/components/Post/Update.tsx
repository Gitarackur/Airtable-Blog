import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import airtable from '../../airtable';
import LoadingText from '../Loading/LoadingText';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import JoditReact from "jodit-react-ts";
import 'jodit/build/jodit.min.css';
import ErrorText from '../Loading/ErrorText';


const UpdatePost = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingApiState, setloadingApiState] = useState<boolean>(false)

  const [singlePost, setSinglePost] = useState<any>({
    id: null,
    fields: {
      Name: '',
      post: ''
    }
  })
  const config = {
    readonly: false,
    height: '450px',
    width: '100%',
    enableDragAndDropFileToEditor: true,
    buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'fullsize',
    ],
    uploader: { insertImageAsBase64URI: true },
    removeButtons: ['brush', 'file'],
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
    style: {
      background: '#040404',
      color: 'rgba(255,255,255,1)',
    },
    // theme : 'dark'
    // container: null,
    // toolbar: null,
  };

  const { id } = useParams();
  let navigate = useNavigate();

  const updatePost = async()=> {
    const post = []
    post.push(singlePost)
    setloadingApiState(true)
    airtable.updateBlog(post, ()=>{
      setloadingApiState(false)
      navigate(`/posts/${id}/view`)
    })
    setLoading(false)
  }

  useEffect(()=>{
    setLoading(true)
    airtable.getSingleBlogPost(id as string, (records:any, error:any)=>{
      if(records){
        setSinglePost({
          id: records.id,
          fields: {
            Name: records.fields.Name,
            post: records.fields.post
          }
        })
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
          !loading ?(
            singlePost ? (
              <div className=''>
                <div className=''>
                  <h1 className='text-center heading-text'>
                    Update post:
                    <span>{singlePost?.fields?.Name}</span>
                  </h1>
                </div>

                <div className=''>
                  <div className='relative inline-block w-full'>
                    <div className='mt-20'>
                      <div className=''>
                        <label className='label-text py-2'>Name of post</label>
                        <input 
                          name="Name"
                          value={singlePost?.fields?.Name}
                          className='outline-none inline-block bg-transparent w-full py-6 px-4 input' 
                          placeholder='type your text' 
                          onChange={(e: any)=> setSinglePost({...singlePost, fields: { ...singlePost.fields, Name: e.target.value }})}
                        />
                      </div>
        
                      <div className='mt-20'>
                        <label className='label-text py-2'>Type your Content</label>
                        <div className='mt-9'>
                          <JoditReact 
                            onChange={(content) => setSinglePost({...singlePost, fields: { ...singlePost.fields, post: content } })} 
                            config={config}
                            defaultValue={singlePost?.fields?.post} 
                          />

                          {/* <ReactMarkdown
                            className="prose"
                            remarkPlugins={[gfm]}
                            rehypePlugins={[rehypeRaw]}
                            children={singlePost?.fields?.post}
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-center py-20'>
                  <div className='md:w-3/12'>
                    <button 
                      className='inline-block w-full py-5 px-3' 
                      onClick={updatePost}
                      disabled={loadingApiState ? true: false}
                      style={{ opacity : loadingApiState ? '0.5': '1' }}
                    > 
                    { loadingApiState ? <><span>loading...</span></>: <><span>Update Post </span></>}
                    </button>
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

export default UpdatePost;
