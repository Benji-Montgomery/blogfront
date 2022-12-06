import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')  

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
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type='text'
            value={username}
            name="Username"
            onChange={({ target}) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
  )
  const handleTitleChange = (event) => {
    setTitle(event.target.value)
    console.log(title)
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
    console.log(author)
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
    console.log(url)
  }
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const Togglable = forwardRef((props, ref) => {

  
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }
  
  
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
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  })
  const blogForm = () => (
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
          <button type="submit" onClick={toggleVisibility}>create</button>
        </form>
      </div>
    </section>
  )
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
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      author: author,
      url: url,
      title: title,
      id: blogs.length + 1,
    }
    console.log(author,title,url)
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
  return (
    <div>
      <h1>Blogs</h1>

      {<Notification message={errorMessage} />}

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
            <LogoutSection />
          <Togglable buttonLabel="create new blog">
          {blogForm()}
          </Togglable>
          {blogsSection()}
        </div>
      }

    </div>
  )
}

export default App