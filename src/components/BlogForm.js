import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')  

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

    return (
    <section>
      <div>
        <h3>Create a new Blog post</h3>
        <form onSubmit={addBlog}>
          <h6>title:<input value={newTitle} 
          onChange={handleTitleChange}></input></h6>
          <h6>author:<input value={newAuthor}
          onChange={handleAuthorChange}></input></h6>
          <h6>url:<input value={newUrl}
          onChange={handleUrlChange}></input></h6>
          <button type="submit">create</button>
        </form>
      </div>
    </section>
  )}

  export default BlogForm