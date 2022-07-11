import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import airtable from '../../airtable';
import ErrorText from '../Loading/ErrorText';
import LoadingText from '../Loading/LoadingText';

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [allPosts, setAllPosts] = useState<any>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)


  const truncateText = (str:string, n:number):string => {
    return (str.length > n) ? str.substr(0, n-1) + '....' : str;
  };

  const removeTags = (str:string | any ) => {
    if ((str===null) || (str===''))
      return false;
    else{
      str = str.toString();
    }

    return str.replace( /(<([^>]+)>)/ig, '');
  }
  
  const nextPage = ():void =>{
    setPageNumber(pageNumber + 1)
  }

  useEffect(()=>{
    setLoading(true)
    airtable.getAllBlogPosts(function page(records:any, fetchNextPage:any){
      console.log('recordzzzzz', records)
      let recordsArray: Array<any> = [];
      recordsArray = [...recordsArray, ...records];
      setAllPosts(recordsArray)
      fetchNextPage()
      setLoading(false)

    }, (error:any)=>{
      error && setLoading(false)
    });
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between py-10 md:py-14" >
        <div className=''>
          <h1 className='heading-text'>Airtable Blog</h1>
        </div>

        <div className=''>
          <Link to="/create" className='route-link py-5 px-3'> create new post </Link>
        </div>
      </div>

      <div>
        <div>
          <div className='md:flex md:flex-wrap md:items-stretch md:-mx-4 -my-8 md:-my-8'>
            {
              !loading ?(
                allPosts ? (
                  allPosts.map((curr:any, idx:number)=>{
                    return(
                      <div className='md:w-6/12 md:px-4 py-8 md:py-8' key={idx}>
                        <Link to={`/posts/${curr?.id}/view`} className='relative inline-block w-full'>
                          <div className='blog-thumbnail p-20'></div>
                          <div className='mt-4'>
                            <h1 className='heading-text'>
                              { curr?.fields?.Name}
                            </h1>
                            <p className='mt-2' style={{ color: "#ccc" }}>
                              created at: { new Date(curr?.fields?.CreatedAt).toUTCString() }
                            </p>
                            <p className='mt-8'>
                              <ReactMarkdown
                                className="prose"
                                remarkPlugins={[gfm]}
                                rehypePlugins={[rehypeRaw]}
                                children={truncateText(removeTags(curr?.fields?.post), 100)}
                              />
                            </p>
                          </div>
                        </Link>
                      </div>
                    )
                  })
                ):(
                  <ErrorText/>
                ) 
              ):(
                <LoadingText />
              )
            }
          </div>

          {/* {
          !loading && (
            <div className='flex items-center justify-center pt-20'>
              <div className=''>
                <button className='py-5 px-3' onClick={nextPage}> Next Page </button>
              </div>
            </div>
            )
          } */}
        </div>
      </div>
    </div>
  );
}

export default Home;
