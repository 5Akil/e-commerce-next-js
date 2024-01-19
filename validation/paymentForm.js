
import * as Yup from 'yup';


export const paymentFormValidation = Yup.object().shape({
    name: Yup.string().required('name required'),
    email: Yup.string().email('Invalid email').trim().required('email required'),
    city:Yup.string().required('city required'),
    postalCode:Yup.string().required('postalCode required'),
    streetAddress:Yup.string().required('streetAddress required'),
    country:Yup.string().required('country required'),

  });