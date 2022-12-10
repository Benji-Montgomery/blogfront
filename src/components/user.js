import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

const userFunction = (x) => {
const [user, setUser] = useState(null)
if(x){
    setUser(x)
}
return user
}

export default {userFunction}