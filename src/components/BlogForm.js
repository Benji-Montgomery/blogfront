import { useState } from "react"

const BlogForm = ({
    addBlog,
    handleAuthorChange,
    handleTitleChange,
    handleUrlChange,
    title,
    author,
    url,
    blogs,
    Blog
}) => {
    
    return (
    <section>
      <div>
        <h3>Create a new Blog post</h3>
        <form onSubmit={addBlog}>
          <h6>title:<input value={title} 
          onChange={handleTitleChange}></input></h6>
          <h6>author:<input value={author}
          onChange={handleAuthorChange}></input></h6>
          <h6>url:<input value={url}
          onChange={handleUrlChange}></input></h6>
          <button type="submit">create</button>
        </form>
      </div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </section>
  )}

  export default BlogForm