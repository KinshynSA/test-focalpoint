import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import TaskRow from "./TaskRow.js";
import Timelines from "./Timelines.js";
import defaultTasks from "../../constants/tasks.js";
import { sortArrByDateKey, getNumberOfDays } from "../../utils/index.js";
import { Switch } from "../";


const Block = styled.div`
display: inline-block;
max-width: 100%;
user-select: none;
`;
const Header = styled.div`
padding: 10px 20px;
border: 1px solid var(--gray500);
border-bottom: 0;
`;
const DateFormatSwitch = styled.div`
display: flex;
align-items: center;
font-size: var(--fs3);
line-height: var(--lh3);
`;
const DateFormatText = styled.span``
const Body = styled.div`
position: relative;
max-width: 100%;
padding-bottom: 10px;
overflow-x: auto;
border: 1px solid var(--gray500);
`;
const TasksTable = styled.div``;


export default function GanttChart(){
    const [dateFormat, setDateFormat] = useState('days');
    const [cellWidth, setCellWidth] = useState(40);
    const [tasks, setTasks] = useState(defaultTasks);
    const refBody = useRef(null);
    const [firstDate, setFirstDate] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const [numberOfCells, setNumberOfCells] = useState(0);

    useEffect(() => {
        if(!tasks) return;

        const firstDate = new Date(sortArrByDateKey([...tasks],'start_date')[0].start_date);
        firstDate.setDate(firstDate.getDate() - 3);
        setFirstDate((prevFirstDate) => {
            if(prevFirstDate && (+firstDate > +prevFirstDate)){
                return prevFirstDate;
            }
            return firstDate;
        });

        const lastDate = new Date(sortArrByDateKey([...tasks],'end_date').at(-1).end_date);
        lastDate.setDate(lastDate.getDate() + 4);
        setLastDate((prevLastDate) => {
            if(prevLastDate && (+lastDate < +prevLastDate)){
                return prevLastDate;
            }
            return lastDate;
        });
    }, [tasks]);

    useEffect(() => {
        if(firstDate && lastDate){
            setNumberOfCells(getNumberOfDays(firstDate, lastDate));
        }
    }, [firstDate, lastDate]);

    useEffect(() => {
        if(dateFormat === 'months'){
            setCellWidth(5);
        } else {
            setCellWidth(40);
        }
    }, [dateFormat])

    function changeTaskDuration(taskName, isStartDate, newDate){
        const task = tasks.find(item => item.name === taskName);
        if(isStartDate){
            task.start_date = newDate;
        } else {
            task.end_date = newDate;
        }
        setTasks(JSON.parse(JSON.stringify(tasks)));
    }

    if(!firstDate || !lastDate) return;
    return (
        <Block>
            <Header>
                <DateFormatSwitch>
                        <DateFormatText>Months</DateFormatText>
                        <Switch
                            style={{
                                margin: '0 6px',
                            }}
                            isChecked={dateFormat === 'days'}
                            onChange={() => {
                                if(dateFormat === 'days'){
                                    setDateFormat('month')
                                } else {
                                    setDateFormat('days')
                                }
                            }}
                        />
                        <DateFormatText>Days</DateFormatText>
                </DateFormatSwitch>
            </Header>
            <Body ref={refBody}>
                <Timelines
                    firstDate={firstDate}
                    lastDate={lastDate}
                    dateFormat={dateFormat}
                    numberOfCells={numberOfCells}
                    cellWidth={cellWidth}
                    refBody={refBody}
                />
                <TasksTable>
                    {tasks.map((task) => {
                        return (
                            <TaskRow
                                task={task}
                                key={task.name}
                                numberOfCells={numberOfCells}
                                cellWidth={cellWidth}
                                firstDate={firstDate}
                                lastDate={lastDate}
                                refBody={refBody}
                                changeTaskDuration={changeTaskDuration}
                            />
                        )
                    })}
                </TasksTable>
            </Body>
        </Block>
    )
}