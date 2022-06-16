
import { useState } from "react"
import {Toast} from "react-bootstrap"
const ToastMessage=({messageHeader,messageBody,show,onClose})=>{
  function closeToast(e){
    e.preventDefault()
    onClose(false)
  }
  console.log(show)
    return (
        <Toast show={show} onClose={closeToast}style={{position:"absolute",top:30,right:20,zIndex:1,}}>
        <Toast.Header  >
          <strong className="me-auto text-dark">{messageHeader}</strong>
        </Toast.Header>
        <Toast.Body className="text-white bg-dark">{messageBody}</Toast.Body>
      </Toast>
    )

}

export default ToastMessage