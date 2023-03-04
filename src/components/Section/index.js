import React from "react";
import styled from "styled-components";


const Block = styled.section`
padding: ${props => props.padding ?? '0'};
`
const CenterBlock = styled.div`
max-width: 1232px;
padding: 0 16px;
margin: 0 auto;
`


export default function Section(props){
    return (
        <Block {...props.style}>
            <CenterBlock>
                {props.children}
            </CenterBlock>
        </Block>
    )
}