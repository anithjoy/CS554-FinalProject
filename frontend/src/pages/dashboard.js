import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from '../components/authContext';
import { api } from "../api";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const Dashboard = () => {
  const [ticketData, setTicketData] = useState(null);
  const [ticketWithNoExpectedDate, setTicketWithNoExpectedDate] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () =>{
        try{
            const {data:ticketDataTemp} = await api.ticket.getAllTicket();
            const ticketDataTemp2 = [];
            const ticketDataTemp3 = [];
            ticketDataTemp.filter((ticket)=>{
              if(ticket.assign === user.email && ticket.expectedDate)
              {
                let start = new Date();
                let end = new Date(ticket.expectedDate);
                if(start>end)
                  start=end;
                  ticketDataTemp2.push( {
                  id: ticket._id,
                  title: ticket.name,
                  start: start,
                  end: end
                });
              }else if(ticket.assign === user.email && !ticket.expectedDate)
                ticketDataTemp3.push(ticket);
            });
            console.log(ticketDataTemp2);
            setTicketWithNoExpectedDate(ticketDataTemp3)
            setTicketData(ticketDataTemp2);
        }
        catch(e){
          if(e.response.status===500)
            router.push("/error");
          else if(e.response.status===401 )
          {
            router.push("/login");
          }else{
            setHasError(true);
            setError(e.response.data);
          }
        }
    }
    if(!ticketData)
      fetchData();
  },[]);

  const redirect = (e) =>{
    router.push(`/ticket/${e.id}`)
  }
  return (
    <div className="dashboardPage">
      {hasError && <div className="error">{error}</div>}
      {ticketData && <Calendar onSelectEvent={(e)=>redirect(e)} localizer={momentLocalizer(moment)} events={ticketData} startAccessor="start" endAccessor="end" defaultDate={new Date()} /> }
      {ticketWithNoExpectedDate && <div className="expectedDateColum">
        <h2>Assign Expected Date</h2>
        {ticketWithNoExpectedDate.length!=0 ?<ul>
        {ticketWithNoExpectedDate.map((ticket, index)=><li key={index} id={ticket._id} onClick={(e)=>redirect({id:e.target.id})}>{ticket.name}</li>)}
        </ul> : "All Tickets Have ExpectedDate"}
      </div>}
    </div>
  )
}

export default Dashboard