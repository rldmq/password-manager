export async function getData(){

    // await requireAuth
    const res = await fetch('/path/here')

    if(!res.ok){
        throw{
            message: 'Failed to fetch data',
            statusText: res.statusText,
            status: res.status
        }
    }

    // if not logged in
        // throw redirect('/login')
    // if logged in


    const data = res.json()

    return data
}