import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const StyledHeader = styled.header`
  background-color: #222;
`;
const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;
const StyledNav = styled.nav`
  ${props => props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display:flex;
    align-items:center;
    justify-content:space-between;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding:0;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border:0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export default function Header() {
  const { cartProducts ,clearCart } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { data: session, status } = useSession();

    const logoutClickHandler = () => {
      clearCart()
      signOut({ callbackUrl: "/login" });
    }
  return (
    <StyledHeader>
      <Center>
        <Wrapper >
          <Logo href={'/'}>Ecommerce</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={'/'}>Home</NavLink>
            <NavLink href={'/products'}>All products</NavLink>
            <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
            <div style={{ display: 'inline' }}>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ?
                <NavLink href='#' onClick={logoutClickHandler}>
                  <div>
                    {session.user.name} <br />
                    Logout
                  </div>
                </NavLink>
                : (
                  <NavLink href={'/login'}>Login</NavLink>
                )}
            </div>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}