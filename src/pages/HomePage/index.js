import React from "react";
import { Section, GanttChart } from "../../components";


export default function HomePage(){
    return (
        <Section style={{
            padding: '20px 0',
        }}>
            <GanttChart />
        </Section>
    )
}