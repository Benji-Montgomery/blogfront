/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
/* eslint-disable linebreak-style */
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import user from '../App'
import blogService from '../services/blogs'
import Notification from '../components/Notification'
import loginService from '../services/login'
import LoginForm from '../components/LoginForm'
import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'

const blogStyle= {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}
const Blog = ({blog}) =>  {
  const [liveLikes, setLiveLikes] = useState(blog.likes)
  const [visible, setVisible] = useState(false)

  const Togglable = forwardRef((props, ref) => {
  
    //const [visible, setVisible] = useState(false)
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
      const likes = liveLikes +1
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
          setLiveLikes(returnedBlog.likes)
        })
    }
    return (
      <button id="meow" onClick={updateLikes}>like</button>
    )
  
  }

  const DeleteButton = ({ blog }) => {

    const deleteIt = (event) => {
      event.preventDefault()
      console.log(blog.id)
      console.log(user.user)
      blogService
        .deleteBlog(blog.id)
    }
    if(user.username === blog.author){
    return (
      <button id="gone" onClick={deleteIt}>delete!</button>
    )}else{
      return
    }

  }


return (
  <div style={blogStyle}>
    {blog.title} 
    <Togglable buttonLabel="show"> 
      {blog.url} 
      likes: {liveLikes} <LikeButton blog={blog}/>
      <section>
        <DeleteButton blog={blog}/>
      </section>
    </Togglable>
  </div>  
)}

export default Blog