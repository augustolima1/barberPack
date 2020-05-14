import styled from "styled-components";

export const Header = styled.header`
    display: flex;
    position: relative;
    max-height: 100px;
    background-color: #282832;
    z-index: 1030;
    height: 50px;
`;

export const Icon = styled.div`
    visibility:hidden;
    padding: 14px 15px;
    display: -webkit-flex;
    display: none;
    float: left;
    cursor:pointer;

    :hover{
        background-color:#367fa9;
    }

    @media (max-width: 767px){
        display:flex;
    }

`; 

export const Logo = styled.div`
    -webkit-transition: width .3s ease-in-out;
    -o-transition: width .3s ease-in-out;
    transition: width .3s ease-in-out;
    display: block;
    float: left;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    width: 230px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    padding: 0 15px;
    font-weight: 300;
    overflow: hidden;

    background-color: #000;
    color: #fff;
    border-bottom: 0 solid transparent;

    @media (max-width: 767px){
        width: 100%;
        float: none;
    }
`; 
    



export const Title = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  letter-spacing: 1px;
  margin-left: 15px;
`;

export const AlignItem = styled.div`
  display: flex;
  align-items: center;
`;