import Center from "@/components/Center";
import { Form } from "@/components/Form";
import Input from "@/components/Input";
import Link from "next/link";
import { useFormik } from 'formik';
import { registerValidation } from "@/validation/registrationvalidation";
import axios from "axios";
import { useRouter } from "next/router";




export default function Register() {
  const router = useRouter();
const { handleChange ,handleSubmit ,touched,errors ,values ,handleBlur} =useFormik({
  initialValues: {
    name: '',
    email: '',
    password:'',
    conf_pass:'',
  },
  validationSchema:registerValidation,
  onSubmit:async  values => {
    console.log(values);
    const response = await axios.post('/api/auth/signup' ,values)
    if (response) {
      router.push('/login')
    }
  },})
  
  console.log(errors);


  return (
    <div>
      <Center>
        <Form>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-screen-md"
          >
        <h1 className="mb-4 text-xl">Create Account</h1>
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <Input type="text"
                placeholder="Name"
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                 />
                 {touched.name && errors.name ? 
                  <span>{errors.name}</span> 
                  : null
                }
              
            </div>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <Input type="text"
                placeholder="Email"
                value={values.email}
                name="email"
                onChange={handleChange} 
                onBlur={handleBlur}/>
                { errors.email && touched.email ? 
                  <span>{errors.email}</span> 
                  : null
                }
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <Input type="password"
                placeholder="password"
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur} />
                  {touched.password && errors.password ? 
                  <span>{errors.password}</span> 
                  : null
                }
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Input type="password"
                placeholder="Confirm password"
                value={values.conf_pass}
                name="conf_pass"
                onChange={handleChange} 
                onBlur={handleBlur}/>
                  {touched.conf_pass && errors.conf_pass ? 
                  <span>{errors.conf_pass}</span> 
                  : null
                }
            </div>
            <div className="mb-4">
              <button type="submit" className="primary-button">Register</button>
            </div>
            <div className="mb-4">
              Already have an account? &nbsp;
              <Link href={`/login`}>Login</Link>
            </div>
          </form>
        </Form>
      </Center>
    </div>
  );
}