import Center from "@/components/Center";
import { Form } from "@/components/Form";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  console.log(session, '<=session');
  const router = useRouter()
  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session]);


  const { errors, values, handleBlur, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async values => {
      const email = values.email
      const password = values.password
      console.log(values);
       await signIn("credentials", {
        redirect: false,
        email,
        password

      });
      
    }
  })

  return (
    <div>
      <Center>
        <Form>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-screen-md"
          >
            <h1 className="mb-4 text-xl">Login</h1>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <Input type="text"
                placeholder="Email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange} />
              {errors & errors.email ?
                <span>{errors.email}</span> : null
              }
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <Input type="password"
                placeholder="password"
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange} />
              {errors & errors.password ?
                <span>{errors.password}</span> : null
              }
            </div>
            <div className="mb-4">
              <button className="primary-button">Login</button>
            </div>
            <div className="mb-4">
              Don&apos;t have an account? &nbsp;
              <Link href={`/register`}>Register</Link>
            </div>
          </form>
        </Form>
      </Center>
    </div>
  );
}