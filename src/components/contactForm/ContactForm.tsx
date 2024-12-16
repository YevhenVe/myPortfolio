import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import Button from '../button/Button';
import './ContactForm.scss';

const ContactForm: React.FC = () => {
    const form = useRef();
    const notify = (message: string, type: "success" | "error" = "success") => toast(message, { type });
    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        emailjs.sendForm(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, form.current, import.meta.env.VITE_PUBLIC_KEY)
            .then(
                () => {
                    notify("Email sent successfully!");
                    form.current.reset();
                },
                (error) => {
                    console.error('Failed to send email:', error);
                    notify("Failed to send email. Try again later.", "error");
                }
            );
    };

    return (
        <form className='contact-form' ref={form} onSubmit={sendEmail}>
            <input className='contact-input' type="text" name="from_name" placeholder="Your name" required />
            <input className='contact-input' type="email" name="from_email" placeholder="Your email" required />
            <textarea className='contact-text-input' name="message" placeholder="Your message" required />
            <Button label="Send" onClick={() => { }} className="send-button" imageRight="" imageLeft="" type="submit" />
        </form>
    );
};

export default ContactForm;
