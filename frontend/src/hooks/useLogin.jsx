import React, { useEffect, useState } from 'react'

function useLogin() {
  
    const [checking, setChecking] = useState(true)
    const [userid, setuserid] = useState(null)
    const [islogged, setIsLogged] = useState(false)
    const [admin , setadmin] = useState(false)

    useEffect(()=>{

        async function call() {
            const auth = sessionStorage.getItem('auth')

            //check if auth object exists in localstorage

            if (!auth){
                setChecking(false)
                setIsLogged(false)
                return
            }

            //fetch user data
        
            const result = await fetch('/api/checklogin', {
                method : "post",
                headers: {
                    "Content-type": "application/json",
                },
                body: auth
            })
        
            const data = await result.json()

            console.log(data);
        
            if (data.status) {

                
                

                setIsLogged(true)
                setuserid(data.data)
                setadmin(data.data.admin)
                console.log(data.data.admin);
                
            }
        
            setChecking(false)
        }

        call()
    }, [])


    return [checking, userid, islogged, admin]

}

export default useLogin