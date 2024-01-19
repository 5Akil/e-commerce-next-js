
import * as Yup from 'yup';

const getCharacterValidationError = (str ) => {
  return `Your password must have at least 1 ${str} character`;
};


export const registerValidation = Yup.object().shape({
  name: Yup.string().required('name required'),
  email: Yup.string().email('Invalid email').trim().required('email required'),
  password: Yup.string().trim()                                                     
    .required("Please enter a password")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase"))
    .matches(/[^\w]/, 'Password requires a symbol'),

  conf_pass: Yup.string().trim()                                                  
    .required("Please enter Confirm Password")
    //compare this password with above password using ref
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});