import { useSession } from "next-auth/react"





export default function Dashboard (){

    const {status , data:session} =useSession()

    if (status === 'loading') {
        return <>
        <p>Loading</p>
        </>
    }

    return (
        <>
        <p>admin dashboard</p>
        </>
    )
}

Dashboard.auth ={ adminOnly: true }