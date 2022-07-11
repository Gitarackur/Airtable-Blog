import Airtable from "airtable";

class AirtableClass {
  base:any;

  constructor(apiKey:string, base:string){
    this.base = new Airtable({apiKey}).base(base);
  }

  async getAllBlogPosts(callback:Function, error:Function){
    try {
      let eachPageRecords = await this.base('blog').select({ view: 'Grid view' })
      .eachPage(callback && typeof callback === 'function' ? callback : ()=>{})
      return eachPageRecords;
    } catch(err) {
      error && typeof error === 'function' && error(err)
      throw new Error('unable to get all records')
    }
  }

  async getSingleBlogPost(id:string, callback:Function){
    try {
      const record = await this.base('blog').find(id);
      console.log('single record', record)
      callback(record, null)
    } catch (err) {
      callback(null, err)
      throw new Error('error getting a single blog')
    }
  }

  async createBlog(post:any, callback:Function){
    try {
      let record = await this.base('blog').create(post);
      console.log('callbackfully created blog')
      callback(record, null)
    } catch(err) {
      callback(null, err)
      throw new Error('error creating blog')
    }
  }

  async updateBlog(post:any, callback:Function){
    try {
      let record = await this.base('blog').update(post)
      console.log('successfully updated blog')
      callback(record, null)
    } catch (err) {
      callback(null, err)
      throw new Error('error creating blog')
    }
  }

  async deleteBlog(postId:any, callback:Function){
    try {
      let record = await this.base('blog').destroy(postId)
      callback(record, null)
    } catch (err) {
      callback(null, err)
      throw new Error('error deleting a blog')
    }
  }
}


export default new AirtableClass(process.env.REACT_APP_AIRTABLE_KEY as string, process.env.REACT_APP_BASE_KEY as string);