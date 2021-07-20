function ApiTester() {

    const getRequestHandler = async()=> {
        const response = await fetch('https://food-api-f23bf-default-rtdb.firebaseio.com/saved-recipes/7eb3edfc916ebf0e4b028c8e5c04b81a.json')
        const data = await response.json()
        console.log(data)
    }

    return <button onClick={getRequestHandler}>Get Request</button>
}

export default ApiTester