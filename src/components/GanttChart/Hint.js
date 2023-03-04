import React from 'react';
import styled from 'styled-components';
import { getNumberOfDays } from "../../utils/index.js";


const Block = styled.div`
position: fixed;
top: ${props => props.top}px;
left: ${props => props.left}px;
z-index: 100;
width: 210px;
padding: 6px 10px;
background: var(--white);
color: var(--gray600);
border-radius: 7px;
font-size: var(--fs4);
line-height: var(--lh4);
box-shadow: 4px 4px 4px rgb(0 0 0 / 10%);
border: 1px solid rgba(0,0,0,0.1);
opacity: 0;
animation: var(--showOpacityFast);
animation-delay: 1s;
`

export default function Hint({ styles, startDate, endDate }){
    return (
        <Block
            top={styles.top}
            left={styles.left}
        >
            <b>Start date:</b> {startDate}<br />
            <b>End date:</b> {endDate}<br />
            <b>Task duration:</b> {(getNumberOfDays(startDate,endDate) + 1)} days
        </Block>
    )
}