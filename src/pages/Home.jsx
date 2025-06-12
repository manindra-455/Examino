import React from 'react'
import Navbaar from '../components/layout/Navbaar'
import AddRoomPage from '../components/home/AddRoomPage'
import AllotmentSuccess from '../components/home/AllotmentSuccess'
import CourseFormPage from '../components/home/CourseFormPage'

const Home = () => {
    const [step,setStep] = React.useState(1);
   
    return (
        <>
            <Navbaar />
            {step === 1 && <AddRoomPage setStep={setStep}/>}
            {step === 2 && <CourseFormPage setStep={setStep}/>}
            {step === 3 && <AllotmentSuccess />}
        </>
    )
}

export default Home
