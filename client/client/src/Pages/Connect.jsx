import {useState} from 'react';
import axios from 'axios';
import Header from '../components/Header';
axios.defaults.withCredentials = true;


export default function Connect() {

    // initialize state variables to track email form fields and status
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState(null);

    // initialize event handlers for email recipent
    const handleRecipentChange = (e) => {
        setTo(e.target.value);
        setStatus(null);
    };

    // initialize event handler for email for user input
    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
        setStatus(null);
    };

    // initialize event handler for email body
    const handleMessageChange = (e) => {
        setBody(e.target.value);
        setStatus(null);
    };

    // initialize event handler for email submit
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending email...');
        try {
            // send email request to my backend server
            await axios.post('/email/connect', {to, subject, text: body},
            {headers: {'Content-Type': 'application/json'}});
            setStatus('sent successfully');

        } catch (error) {
            setStatus('error sending email');

        };
    }

    return (
        <>
            <Header/>
            <form onSubmit={handleEmailSubmit}>
                <h2>Connect</h2>
                <label htmlFor="to">Recipent:</label>
                <input id="to" type="email" name="to"
                    value={to} placeholder="Recipent" onChange={handleRecipentChange}
                    required
                    />
                <br />

                <label htmlFor="subject">Subject:</label>
                <input id="subject" type="text" name="subject"
                    value={subject} onChange={handleSubjectChange}
                    required
                    />
                <br />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message"
                    value={body} onChange={handleMessageChange}
                    required
                    />
                <br />

                <button disabled={status==="sending email..."} type="submit" className='connect btn'>
                    {status === 'sending email...'? 'Sending...' : 'Send Message'}
                </button>

            </form>
        </>
    )
}
