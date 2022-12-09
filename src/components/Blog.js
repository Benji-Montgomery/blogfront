import { useState } from "react"
import { forwardRef, useImperativeHandle } from "react"
import blogService from '../services/blogs'
import app from '../App'


const blogStyle= {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({blog}) =>  {
  const blogs = app.blogs
  const [liveLikes, setLiveLikes] = useState(blog.likes)
  const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
  
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }
  
    const toggleVisibility = async () => {
      setVisible(!visible)
    }
  
    useImperativeHandle(ref, () => {
      return {
        toggleVisibility
      }
    })
  
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          <button onClick={toggleVisibility}>hide</button>
          {props.children}
        </div>
      </div>
    )
  })

  const LikeButton = ({ blog }) => {

    const updateLikes = (event) => {
      event.preventDefault()
      console.log(blog.likes)
      const likes = blog.likes +1
      const newBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: likes
      }
      console.log(blog)
      blogService
        .update(blog.id, newBlog)
        .then(returnedBlog => {
          console.log(returnedBlog)
          console.log(app.blogs)
          app.setBlogs(blogs.concat(returnedBlog))
        })
    }
    return (
      <button onClick={updateLikes}>like</button>
    )
  
  }


return (
  <div style={blogStyle}>
    {blog.title} 
    <Togglable buttonLabel="show"> 
      {blog.url} 
      likes: {liveLikes} <LikeButton blog={blog}/>
    </Togglable>
  </div>  
)}

export default Blog