import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import airtable from '../../airtable';
import JoditReact from "jodit-react-ts";
import 'jodit/build/jodit.min.css';


const CreatePost = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [placeholder, setPlaceholder] = useState('type your text')
  const [form, setForm] = React.useState<any>({
    Name: null,
    post: null,
  });
  const { id } = useParams();
  let navigate = useNavigate();


  const createPost = async()=> {
    setLoading(true)
    airtable.createBlog(form, (records:any, error:any)=>{
      if(records){
        navigate('/')
      }
      if(error){
        alert('unable to create post')
      }
      setLoading(false)
    })
  }
  

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


        <div className=''>
          <div className=''>
            <h1 className='text-center heading-text'>Create a post</h1>
          </div>


          <div className=''>
            <div className='relative inline-block w-full'>
              <div className='mt-20'>
                <div className=''>
                  <label className='label-text py-2'>Name of post</label>
                  <input 
                    name="Name"
                    className='outline-none inline-block bg-transparent w-full py-6 px-4 input' 
                    placeholder='type your text' 
                    onChange={(e: any)=> setForm({...form, Name: e.target.value})}
                  />
                </div>
  
                <div className='mt-20'>
                  <label className='label-text py-2'>Type your Content</label>
                  <div className='mt-9'>
                    <JoditReact 
                      onChange={(content) => setForm({...form, post: content})} 
                      config={config}
                      defaultValue="" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='flex items-center justify-center py-20'>
          <div className='md:w-3/12'>
            <button 
              className='inline-block w-full py-5 px-3' 
              onClick={createPost}
              disabled={loading ? true: false}
              style={{ opacity : loading ? '0.5': '1' }}
            > 
            { loading ? <><span>loading...</span></>: <><span>Create Post </span></>}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CreatePost;
