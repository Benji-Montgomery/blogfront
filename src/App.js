import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlogs] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 

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
  const blogForm = () => (
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
  console.log(user)
  return (
    <div>
      <h1>Blogs</h1>

      {<Notification message={errorMessage} />}

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged in</p>
          <LogoutSection />
        {blogForm()}
        </div>
      }

      {/* {user === null ?
      loginForm() :
      blogForm()
    } */}

    </div>
  )
}

export default App
