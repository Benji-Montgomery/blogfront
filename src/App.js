import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
//import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [title, setTitle] = useState('')

  blogs.sort((a, b) => a.likes - b.likes);
  
  // blog sections
  const blogStyle= {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const Blog = ({blog}) =>  {
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
  
  
  return (
    <div style={blogStyle}>
      {blog.title} 
      <Togglable buttonLabel="show"> 
        {blog.url} 
        likes: {liveLikes} <LikeButton blog={blog}/>
      </Togglable>
    </div>  
  )}
  // end of blog section

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {    
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    }catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const blogsSection = () => (
    <section>
    <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </section>
  )
  const LogoutSection = ({  }) => {
    const zoomer = () => {
      window.localStorage.clear()
      setUser(null)
    }

    return (
      <div>
        <button onClick={() => zoomer()}>log out</button>
      </div>
    )
  }
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    setErrorMessage(`${title} added!`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
      })
  }
  const blogFormRef = useRef()
  return (
    <div>
      <h1>Blogs</h1>

      {<Notification message={errorMessage} />}

      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          <p>{user.name} logged in</p>
          <LogoutSection />
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogsSection()}
        </div>
      }

    </div>
  )
}

export default App