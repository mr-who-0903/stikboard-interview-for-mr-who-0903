import React, {useState, useEffect, useContext} from 'react'
import { UserContext } from '../App';

const Home = () => {

    const {state, dispatch} = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [flag, setFlag] = useState(false);

    const callHomePage = async () => {
        try{
            const res = await fetch('/getdata', {
                method:"GET",
                headers:{
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();
            setUsername(data.name);
            setFlag(true);
            dispatch({type:"USER", payload:true});  // true means user is signed in
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        callHomePage();
    }, [])



    return (
        <>
        <div className="home-page"> 
            <div className="home-div">
                <p className="pt-5">WELCOME</p>
                <h1>{ username }</h1>
                <h2> { flag ? 'Happy to see you back' : 'We Are The MERN Developers'}</h2>
            </div>
        </div>
        </>
    )
}

export default Home
