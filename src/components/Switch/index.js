import React from "react";
import styled from "styled-components";


const Block = styled.div`
display: flex;
align-items: center;
margin: ${props => props.margin ?? '0'};
`
const Line = styled.div`
position: relative;
width: 32px;
height: 16px;
background: var(--gray100);
border-radius: 20px;
cursor: pointer;

&:before{
    content: "";
    display: block;
    background: var(--white);
    width: calc(50% - 2px);
    height: calc(100% - 2px);
    position: absolute;
    top: 0;
    left: ${props => props.isChecked ? '50%' : '0'};
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.3);
    transition: var(--trans);
}
`


export default function Switch({ onChange, style, isChecked }){
    return (
        <Block
            {...style}
        >
            <Line
                isChecked={isChecked}
                onClick={onChange}
            />
        </Block>
    )
}