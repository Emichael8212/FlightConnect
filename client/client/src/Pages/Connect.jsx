import {useState} from 'react';
import axios from 'axios';
import Header from '../Components/Header';
axios.defaults.withCredentials = true;

const STATUS = {
    IDLE: null,
    SENDING: 'sending',
    SUCCESS: 'success',
    ERROR: 'error',
};

export default function Connect() {

    // initialize state variables to track email form fields and status
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState(STATUS.IDLE);

    // initialize event handlers for email recipent
    const handleRecipientChange = (e) => {
        setTo(e.target.value);
        setStatus(STATUS.IDLE);
    };

    // initialize event handler for email for user input
    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
        setStatus(STATUS.IDLE);
    };

    // initialize event handler for email body
    const handleMessageChange = (e) => {
        setBody(e.target.value);
        setStatus(STATUS.IDLE);
    };

    // initialize event handler for email submit
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setStatus(STATUS.SENDING);
        try {
            const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
            // send email request to my backend server
            await axios.post(`${VITE_BASE_URL}/email/connect`, {to, subject, text: body},
            {headers: {'Content-Type': 'application/json'}});
            setStatus('sent successfully');

        } catch (error) {
            setStatus(STATUS.ERROR);

        };
    };

    return (
        <>
            <Header/>
            <form onSubmit={handleEmailSubmit}>
                <h2>Connect</h2>
                <label htmlFor="to">Recipient:</label>
                <input id="to" type="email" name="to"
                    value={to} placeholder="Recipent" onChange={handleRecipientChange}
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

                <button disabled={status===STATUS.SENDING} type="submit" className='connect btn'>
                    {status === STATUS.SENDING? 'Sending...' : 'Send Message'}
                </button>

            </form>
        </>
    );
}
