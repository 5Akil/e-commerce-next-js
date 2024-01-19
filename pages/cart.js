import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { paymentFormValidation } from "@/validation/paymentForm";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const { status, data: session } = useSession()
  const [products, setProducts] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          console.log(response);
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
      localStorage.removeItem('cart')
    }
  }, []);
  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  const { errors, touched, values, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      name: '',
      email: '',
      city: '',
      postalCode: '',
      streetAddress: '',
      country: ''
    },
    validationSchema: paymentFormValidation,
    onSubmit: async values => {
      if (!session?.user) {
        alert('first login ');
        window.location = '/login';
      }
      const response = await axios.post('/api/checkout', {
        ...values,
        cartProducts,
      });
      if (response.data.url) {
        window.location = response.data.url;
      }
    }
  })
  console.log(errors);
  console.log(values);
  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p.id === productId)?.price || 0;
    total += price;
  }
  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>Your cart is empty</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.image} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: "100%" }}>
                        <Button
                          onClick={() => lessOfThisProduct(product.id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product.id).length}
                        </QuantityLabel>
                        <Button
                          onClick={() => moreOfThisProduct(product.id)}>+</Button>
                      </td>
                      <td>
                        ${cartProducts.filter(id => id === product.id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>
              <form onSubmit={handleSubmit}>

                <Input type="text"
                  placeholder="Name"
                  value={values.name}
                  name="name"
                  onBlure={handleBlur}
                  onChange={handleChange} />
                {touched.name && errors.name ? <span>{errors.name}</span> : null}
                <Input type="text"
                  placeholder="Email"
                  value={values.email}
                  name="email"
                  onBlure={handleBlur}
                  onChange={handleChange} />
                {touched.email && errors.email ? <span>{errors.email}</span> : null}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <CityHolder>
                    <Input type="text"
                      placeholder="City"
                      value={values.city}
                      name="city"
                      onBlure={handleBlur}
                      onChange={handleChange} />
                    <Input type="text"
                      placeholder="Postal Code"
                      value={values.postalCode}
                      name="postalCode"
                      onBlure={handleBlur}
                      onChange={handleChange} />
                  </CityHolder>
                  <div>
                    {touched.city && errors.city ? <span>{errors.city}</span> : null}  <br />
                    {touched.postalCode && errors.postalCode ? <span>{errors.postalCode}</span> : null}
                  </div>
                </div>
                <Input type="text"
                  placeholder="Street Address"
                  value={values.streetAddress}
                  name="streetAddress"
                  onBlure={handleBlur}
                  onChange={handleChange} />
                {touched.streetAddress && errors.streetAddress ? <span>{errors.streetAddress}</span> : null}
                <Input type="text"
                  placeholder="Country"
                  value={values.country}
                  name="country"
                  onChange={handleChange}
                  onBlure={handleBlur} />
                {touched.country && errors.country ? <span>{errors.country}</span> : null}
                <Button black block type='submit'>
                  Continue to payment
                </Button>
              </form>
            </Box>
          )}
        </ColumnsWrapper>
      </Center >
    </>
  );
}
