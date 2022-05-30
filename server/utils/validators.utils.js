const validateRegisterUser = (username,email,password,confirmPassword)=>{
    let errors={}
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(username.trim()===""){
        errors.username="The username cannot be empty"
    }

    if(email.trim()===""){

    }else{
        if(!email.match(emailRegex))
        errors.email="Email that you've entered is not valid"
    }
    if(password.trim()==="")
    errors.password="Password cannot be empty"
    if(confirmPassword.trim()==="")
    errors.confirmPassword="confirm password cannot be empty"

    if(password.trim()!==confirmPassword.trim()){
        errors.password="Passwords don't match"
    }   

    return {
        errors,
        valid: Object.keys(errors).length<1
    }
}

const validateLoginUser=(username,password)=>{
    let errors={}
    if(username.trim()===""){
        errors.username="the username cannot be empty"
    }
    if(password.trim()===""){
        errors.password="the password cannot be empty"
    }
    return{
        errors,
        valid :Object.keys(errors).length <1
    }
}

module.exports={
    validateRegisterUser,
    validateLoginUser
}