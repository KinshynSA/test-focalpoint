import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getNumberOfDays, formatDate } from "../../utils/index.js";
import Hint from './Hint.js';


const Block = styled.div`
display: flex;
width: ${props => props.width ?? '0'};
min-width: ${props => props.width ?? '0'};
margin-top: 10px;
background-color: var(--gray100);

&:nth-first-of-type{
    margin-top: 0;
}
`;
const SpaceLeft = styled.div`
width: ${props => props.width ?? '0'};
min-width: ${props => props.width ?? '0'};
`;
const Task = styled.div`
position: relative;
display: flex;
justify-content: space-between;
align-items: center;
width: ${props => props.width ?? '0'};
min-width: ${props => props.width ?? '0'};
padding: 8px;
background: var(--blue);
color: var(--white);
font-size: var(--fs3);
line-height: var(--lh3);
border-radius: 6px;
`;
const BorderLeft = styled.div`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 5px;
min-width: 5px;
background: var(--red);
transition: var(--trans);
border-top-left-radius: 6px;
border-bottom-left-radius: 6px;
touch-action: none;
`
const BorderRight = styled(BorderLeft)`
left: auto;
right: 0;
border-top-left-radius: 0;
border-bottom-left-radius: 0;
border-top-right-radius: 6px;
border-bottom-right-radius: 6px;
`
const TaskContent = styled.div`
flex-grow: 100;
overflow: hidden;
`
const TaskName = styled.span`
display: block;
width: 100%;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`


export default function TaskRow({ task, firstDate, lastDate, cellWidth, refBody, changeTaskDuration }){
    const [spaceLeftWidth, setSpaceLeftWidth] = useState();
    const [taskWidth, setTaskWidth] =  useState();
    const refTask = useRef(null);
    const [hint, setHint] = useState(false);

    useEffect(() => {
        if(!task) return;
        setSpaceLeftWidth(`${getNumberOfDays(firstDate,task.start_date) * cellWidth}px`);
        setTaskWidth(`${(getNumberOfDays(task.start_date,task.end_date) + 1) * cellWidth}px`);
    }, [task, firstDate, lastDate, cellWidth]);

    function handleTaskBorderMove(event, isMobile, isStartDate){
        let newDate;
        const leftBorderX = parseInt(spaceLeftWidth);
        const prevTaskWidth = parseInt(taskWidth);
        const rightBorderX = leftBorderX + prevTaskWidth;
        let pageX = event.pageX;
        if(isMobile) pageX = event.touches[0].pageX;

        moveAt(pageX);
        function moveAt(pageX) {
            const body = refBody.current
            const bodyScroll = body.scrollLeft - body.offsetLeft;

            let x = pageX + bodyScroll;
            if(isStartDate){
                if(x >= rightBorderX - (cellWidth / 2)) x = rightBorderX - (cellWidth / 2);
                if(x <= 0) x = 0;
                setSpaceLeftWidth(`${x}px`);
                setTaskWidth(`${leftBorderX + prevTaskWidth - x}px`);

                newDate = new Date(task.start_date);
                newDate.setDate(newDate.getDate() + Math.floor((x - leftBorderX) / cellWidth));
                newDate = formatDate(newDate);
            } else {
                if(x <= leftBorderX + (cellWidth / 2)) x = leftBorderX + (cellWidth / 2);
                setTaskWidth(`${x - leftBorderX}px`);

                newDate = new Date(task.end_date);
                newDate.setDate(newDate.getDate() + Math.ceil((x - rightBorderX) / cellWidth));
                newDate = formatDate(newDate);
            }
        }


        if(isMobile){
            function onTouchMove(event) {
                moveAt(event.touches[0].pageX);
            }

            document.addEventListener('touchmove', onTouchMove);

            document.ontouchend = document.ontouchcancel = function() {
                changeTaskDuration(task.name, isStartDate, newDate);
    
                document.removeEventListener('touchmove', onTouchMove);
            };
        } else {
            function onMouseMove(event) {
                moveAt(event.pageX);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                changeTaskDuration(task.name, isStartDate, newDate);
    
                document.removeEventListener('mousemove', onMouseMove);
            };
        }
    }

    return (
        <Block
            width={`${getNumberOfDays(firstDate,lastDate) * cellWidth}px`}
        >
            <SpaceLeft width={spaceLeftWidth} />
            <Task
                ref={refTask}
                width={taskWidth}
            >
                <BorderLeft
                    onMouseDown={(e) => handleTaskBorderMove(e, false, true)}
                    onTouchStart={(e) => handleTaskBorderMove(e, true, true)}
                />
                <TaskContent
                    onMouseEnter={(e) => {
                        setHint({
                            top: e.pageY + (parseInt(getComputedStyle(refTask.current).height) / 2),
                            left: e.pageX,
                        })
                    }}
                    onMouseLeave={() => setHint(null)}
                >
                    <TaskName>{task.name}</TaskName>
                </TaskContent>
                <BorderRight
                    onMouseDown={(e) => handleTaskBorderMove(e, false, false)}
                    onTouchStart={(e) => handleTaskBorderMove(e, true, false)}
                />

                {hint && (
                    <Hint
                        startDate={task.start_date}
                        endDate={task.end_date}
                        styles={{
                            top: hint.top,
                            left: hint.left,
                        }}
                    />
                )}
            </Task>
        </Block>
    )
}