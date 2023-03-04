import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import monthNames from '../../constants/monthNames.js';
import { formatDate, isToday } from '../../utils/index.js';



const Block = styled.div`
display: flex;
width: ${props => props.width ?? '0'};
min-width: ${props => props.width ?? '0'};
font-size: var(--fs4);
font-weight: 600;
line-height: var(--lh4);
text-align: center;
border-bottom: 1px solid var(--gray500);
`;
const Month = styled.div`
width: ${props => props.width ?? '0'}px;
min-width: ${props => props.width ?? '0'}px;

&:nth-of-type(2n){
    background: var(--gray100);
}
`
const MonthName = styled.div`
padding: 4px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`
const Days = styled.div`
display: flex;
padding-top: 2px;
`
const DayWrapper = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;
width: ${props => props.width ?? '0'}px;
min-width: ${props => props.width ?? '0'}px;
background: var(--blue);
color: var(--white);

&:nth-of-type(2n){
    background: var(--white);
    color: var(--gray800);
}
`
const Day = styled.div`
display: inline-block;
width: 100%;
border-top: 1px solid var(--gray500);
`
const Today = styled.div`
position: absolute;
left: 50%;
bottom: 0;
z-index: 20;
width: 0;
transform: translate(0, calc(100% + 4px));

&:before{
    content: "";
    display: block;
    width: 1px;
    height: ${props => props.height - 14}px;
    background-color: var(--gray600);
}

span{
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 80px;
    padding: 3px 4px;
    background-color: var(--gray600);
    color: var(--white);
    font-size: var(--fs4);
    line-height: 1;
    text-align: center;
    border-radius: 2px;
    transform: translate(-50%, 0);
}
`


export default function Timelines({ cellWidth, numberOfCells, firstDate, dateFormat, refBody }){
    const [months, setMonths] = useState([]);
    const [todayHeight, setTodayHeight] = useState(0);

    useEffect(() => {
        let prevMonth = null;
        const arrMonths = [];
        let arrDays = [];

        for(let i = 0; i < numberOfCells; i++){
            const date = new Date(firstDate);
            date.setDate(date.getDate() + i);
            const currentMonth = date.getMonth();
            if(currentMonth !== prevMonth){
                if(prevMonth !== null) arrMonths.push(arrDays);
                prevMonth = currentMonth;
                arrDays = [];
            }
            arrDays.push(+date);
        }
        arrMonths.push(arrDays);
        setMonths(arrMonths);
    }, [firstDate, numberOfCells]);

    useEffect(() => {
        if(!refBody?.current) return;
        setTodayHeight(parseFloat(getComputedStyle(refBody.current).height))
    }, [refBody])

    return (
        <Block width={`${numberOfCells * cellWidth}px`}>
            {months.map(month => {
                const date = new Date(month[0]);
                
                if(!month.length) return null;
                return (
                    <Month
                        key={+date}
                        width={cellWidth * month.length}
                    >
                        <MonthName>
                            {`${monthNames[date.getMonth()]}, ${date.getFullYear()}`}
                        </MonthName>
                        <Days>
                            {month.map(day => {
                                const date = new Date(day);

                                return (
                                    <DayWrapper
                                        key={+date}
                                        width={cellWidth}
                                    >
                                        {dateFormat === 'days' && (
                                            <Day>
                                                {date.getDate()}
                                            </Day>
                                        )}
                                        {isToday(date) && (
                                            <Today
                                                height={todayHeight}
                                            >
                                                <span>{formatDate(date)}</span>
                                            </Today>
                                        )}
                                    </DayWrapper>
                                )
                            })}
                        </Days>
                    </Month>
                )
            })}
        </Block>
    )
}